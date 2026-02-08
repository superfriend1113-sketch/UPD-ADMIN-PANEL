/**
 * Data Seeding Script
 * Populates Supabase with initial sample data for development and testing
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { categories } from './fixtures/categories';
import { retailers } from './fixtures/retailers';
import { deals } from './fixtures/deals';

/**
 * Seed categories collection
 */
export async function seedCategories(supabase: SupabaseClient): Promise<void> {
  console.log('Seeding categories...');
  
  const categoriesData = categories.map(category => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
    order: category.order,
    is_active: category.isActive,
    deal_count: category.dealCount,
  }));

  const { error } = await supabase
    .from('categories')
    .insert(categoriesData);

  if (error) {
    throw new Error(`Error seeding categories: ${error.message}`);
  }

  console.log(`✓ Seeded ${categoriesData.length} categories`);
}

/**
 * Seed retailers collection
 */
export async function seedRetailers(supabase: SupabaseClient): Promise<void> {
  console.log('Seeding retailers...');
  
  const retailersData = retailers.map(retailer => ({
    slug: retailer.slug,
    name: retailer.name,
    logo_url: retailer.logoUrl,
    website_url: retailer.websiteUrl,
    affiliate_id: retailer.affiliateId,
    is_active: retailer.isActive,
    deal_count: retailer.dealCount,
    commission: parseFloat(retailer.commission.replace('%', '')),
  }));

  const { error } = await supabase
    .from('retailers')
    .insert(retailersData);

  if (error) {
    throw new Error(`Error seeding retailers: ${error.message}`);
  }

  console.log(`✓ Seeded ${retailersData.length} retailers`);
}

/**
 * Seed deals collection
 */
export async function seedDeals(supabase: SupabaseClient): Promise<void> {
  console.log('Seeding deals...');
  
  const dealsData = deals.map(deal => ({
    product_name: deal.productName,
    description: deal.description,
    image_url: deal.imageUrl,
    price: deal.price,
    original_price: deal.originalPrice,
    savings_percentage: deal.savingsPercentage,
    category: deal.category,
    retailer: deal.retailer,
    deal_url: deal.dealUrl,
    expiration_date: deal.expirationDate.toISOString(),
    is_active: deal.isActive,
    is_featured: deal.isFeatured,
    view_count: deal.viewCount,
    click_count: deal.clickCount,
    slug: deal.slug,
    meta_description: deal.metaDescription,
  }));

  const { error } = await supabase
    .from('deals')
    .insert(dealsData);

  if (error) {
    throw new Error(`Error seeding deals: ${error.message}`);
  }

  console.log(`✓ Seeded ${dealsData.length} deals`);
}

/**
 * Seed all collections
 */
export async function seedAll(supabase: SupabaseClient): Promise<void> {
  try {
    console.log('Starting database seeding...\n');

    await seedCategories(supabase);
    await seedRetailers(supabase);
    await seedDeals(supabase);

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n✗ Error seeding database:', error);
    throw error;
  }
}
