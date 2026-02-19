/**
 * Approved Retailers Page
 * View and manage approved retailers
 */

import { createClient } from '@/lib/supabase/server';
import ApprovedRetailersClient from './ApprovedRetailersClient';

export const metadata = {
  title: 'Approved Retailers',
  description: 'Active partners with full platform access',
};

async function getApprovedRetailers() {
  const supabase = await createClient();
  
  // First, get all approved retailers
  const { data: retailers, error } = await supabase
    .from('retailers')
    .select('*')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved retailers:', {
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

export default async function ApprovedRetailersPage() {
  const retailers = await getApprovedRetailers();

  return <ApprovedRetailersClient retailers={retailers} />;
}
