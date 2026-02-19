/**
 * Pending Applications Page
 * Review and approve/reject retailer applications
 */

import { createClient } from '@/lib/supabase/server';
import PendingApplicationsClient from './PendingApplicationsClient';

export const metadata = {
  title: 'Pending Applications',
  description: 'Review pending retailer applications',
};

async function getPendingApplications() {
  const supabase = await createClient();
  
  // First, get all pending retailers
  const { data: retailers, error } = await supabase
    .from('retailers')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending applications:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error
    });
    return [];
  }

  if (!retailers || retailers.length === 0) {
    return [];
  }

  // Get user_ids that are not null
  const userIds = retailers
    .filter(r => r.user_id)
    .map(r => r.user_id);

  if (userIds.length === 0) {
    // No user_ids to fetch, return retailers without emails
    return retailers.map(retailer => ({
      ...retailer,
      email: null
    }));
  }

  // Fetch emails from user_profiles for these user_ids
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('id, email')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching user profiles:', {
      message: profilesError.message,
      details: profilesError.details,
      hint: profilesError.hint,
      code: profilesError.code,
      fullError: profilesError
    });
  }

  // Create a map of user_id to email
  const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

  // Merge emails into retailer objects
  const retailersWithEmails = retailers.map(retailer => ({
    ...retailer,
    email: retailer.user_id ? emailMap.get(retailer.user_id) : null
  }));

  return retailersWithEmails;
}

async function getStats() {
  const supabase = await createClient();
  
  // Pending count
  const { count: pendingCount } = await supabase
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Approved count
  const { count: approvedCount } = await supabase
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  // Rejected count
  const { count: rejectedCount } = await supabase
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected');

  // Calculate approval rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { count: recentApproved } = await supabase
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
    .gte('updated_at', thirtyDaysAgo.toISOString());

  const { count: recentRejected } = await supabase
    .from('retailers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected')
    .gte('updated_at', thirtyDaysAgo.toISOString());

  const totalRecent = (recentApproved || 0) + (recentRejected || 0);
  const approvalRate = totalRecent > 0 ? Math.round(((recentApproved || 0) / totalRecent) * 100) : 0;

  return {
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0,
    approvalRate,
  };
}

export default async function PendingApplicationsPage() {
  const applications = await getPendingApplications();
  const stats = await getStats();

  return <PendingApplicationsClient applications={applications} stats={stats} />;
}
