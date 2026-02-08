#!/usr/bin/env ts-node

/**
 * Seed Script Entry Point
 * Run this script to populate Supabase with initial sample data
 * 
 * Usage:
 *   npm run seed
 */

// Load environment variables from .env.local FIRST before any imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import modules that depend on environment variables
import { supabaseAdmin } from '../lib/supabase/adminConfig';
import { seedAll } from './seedData';

async function main() {
  try {
    console.log('Initializing Supabase Admin Client...');
    console.log('Connected to Supabase\n');

    await seedAll(supabaseAdmin);

    console.log('\nSeeding complete! You can now use the application with sample data.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
