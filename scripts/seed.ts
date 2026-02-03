#!/usr/bin/env ts-node

/**
 * Seed Script Entry Point
 * Run this script to populate Firestore with initial sample data
 * 
 * Usage:
 *   npm run seed
 */

import dotenv from 'dotenv';
import { initializeAdmin, getAdminFirestore } from '../lib/firebase/adminConfig';
import { seedAll } from './seedData';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    console.log('Initializing Firebase Admin SDK...');
    initializeAdmin();
    
    const db = getAdminFirestore();
    console.log('Connected to Firestore\n');

    await seedAll(db);

    console.log('\nSeeding complete! You can now use the application with sample data.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
