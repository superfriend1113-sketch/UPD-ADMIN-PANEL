/**
 * Flagged Inventory Page
 * Items requiring manual review before going live
 */

import { createClient } from '@/lib/supabase/server';
import FlaggedInventoryClient from './FlaggedInventoryClient';

export const metadata = {
  title: 'Flagged Inventory',
  description: 'Items requiring manual review before going live',
};

async function getFlaggedItems() {
  const supabase = await createClient();
  
  // Fetch pending deals (flagged items)
  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      retailers (
        id,
        name,
        status
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching flagged items:', error);
    return [];
  }

  // Transform deals to match flagged inventory structure
  return (deals || []).map(deal => {
    const discount = deal.original_price && deal.discounted_price 
      ? Math.round((1 - deal.discounted_price / deal.original_price) * 100)
      : 0;
    
    // Determine risk flags based on deal properties
    const flags = [];
    
    if (discount > 50) {
      flags.push({ text: 'Discount >50%', severity: 'high' });
    }
    
    if (deal.quantity && deal.quantity > 100) {
      flags.push({ text: 'High quantity', severity: 'default' });
    }
    
    if (!deal.image_url) {
      flags.push({ text: 'No image', severity: 'default' });
    }
    
    // Determine risk level
    const riskLevel = discount > 50 || flags.some(f => f.severity === 'high') ? 'HIGH' : 'MEDIUM';
    
    return {
      id: deal.id,
      sku: deal.sku || 'N/A',
      title: deal.title || deal.product_name,
      description: deal.description,
      category: deal.categories?.name || deal.category || 'Uncategorized',
      category_id: deal.category_id,
      condition: deal.condition || 'N/A',
      location: deal.location || 'N/A',
      original_price: deal.original_price || 0,
      current_price: deal.discounted_price || deal.price || 0,
      minimum_price: deal.minimum_price,
      quantity: deal.quantity || 1,
      retailer_id: deal.retailer_id,
      retailer_name: deal.retailers?.name || deal.retailer || 'Unknown',
      retailer_status: deal.retailers?.status === 'approved' ? 'Verified Partner' : 'New Partner',
      deal_url: deal.deal_url,
      image_url: deal.image_url,
      start_date: deal.start_date,
      end_date: deal.end_date,
      status: deal.status,
      risk_level: riskLevel,
      flagged_at: deal.created_at,
      flags: flags,
      flag_notes: `Automatic flag: Deal submitted by ${deal.retailers?.name || 'retailer'} requires admin review.`,
    };
  });
}

async function getRecentlyClearedItems() {
  const supabase = await createClient();
  
  // Get deals approved in the last 24 hours
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      retailers (
        id,
        name,
        status
      )
    `)
    .eq('status', 'approved')
    .gte('approved_at', twentyFourHoursAgo.toISOString())
    .order('approved_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching recently cleared items:', error);
    return [];
  }

  // For each deal, fetch the admin user info if approved_by exists
  const dealsWithAdmin = await Promise.all(
    (deals || []).map(async (deal) => {
      let adminEmail = 'Admin';
      
      if (deal.approved_by) {
        const { data: adminUser } = await supabase
          .from('user_profiles')
          .select('email, full_name')
          .eq('id', deal.approved_by)
          .single();
        
        if (adminUser) {
          adminEmail = adminUser.email || adminUser.full_name || 'Admin';
        }
      }
      
      const discount = deal.original_price && deal.discounted_price 
        ? Math.round((1 - deal.discounted_price / deal.original_price) * 100)
        : 0;
      
      // Determine original flags
      const flags = [];
      if (discount > 50) {
        flags.push('Discount >50%');
      }
      if (deal.quantity && deal.quantity > 100) {
        flags.push('High quantity');
      }
      
      return {
        id: deal.id,
        sku: deal.sku || 'N/A',
        title: deal.title || deal.product_name,
        retailer_name: deal.retailers?.name || 'Unknown',
        original_flag: flags.join(', ') || 'Standard review',
        cleared_by: adminEmail,
        cleared_at: deal.approved_at,
      };
    })
  );

  return dealsWithAdmin;
}

async function getStats() {
  const supabase = await createClient();
  
  // Get count of pending deals
  const { count: awaitingCount } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get count of deals approved today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count: clearedTodayCount } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
    .gte('approved_at', today.toISOString());

  // Get count of rejected deals
  const { count: rejectedCount } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected');

  // Calculate average review time (simplified - just using a placeholder)
  // In a real implementation, you'd calculate this from approved_at - created_at
  const avgReviewTime = '2.4h';

  return {
    awaiting: awaitingCount || 0,
    clearedToday: clearedTodayCount || 0,
    rejected: rejectedCount || 0,
    avgReviewTime,
  };
}

export default async function FlaggedInventoryPage() {
  const items = await getFlaggedItems();
  const stats = await getStats();
  const recentlyCleared = await getRecentlyClearedItems();

  return <FlaggedInventoryClient items={items} stats={stats} recentlyCleared={recentlyCleared} />;
}
