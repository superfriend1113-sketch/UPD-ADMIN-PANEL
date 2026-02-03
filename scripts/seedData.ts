/**
 * Data Seeding Script
 * Populates Firestore with initial sample data for development and testing
 */

import * as admin from 'firebase-admin';
import { categories } from './fixtures/categories';
import { retailers } from './fixtures/retailers';
import { deals } from './fixtures/deals';

/**
 * Seed categories collection
 */
export async function seedCategories(db: admin.firestore.Firestore): Promise<void> {
  console.log('Seeding categories...');
  
  const batch = db.batch();
  let count = 0;

  for (const category of categories) {
    const docRef = db.collection('categories').doc(category.slug);
    batch.set(docRef, {
      ...category,
      id: category.slug,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    count++;
  }

  await batch.commit();
  console.log(`✓ Seeded ${count} categories`);
}

/**
 * Seed retailers collection
 */
export async function seedRetailers(db: admin.firestore.Firestore): Promise<void> {
  console.log('Seeding retailers...');
  
  const batch = db.batch();
  let count = 0;

  for (const retailer of retailers) {
    const docRef = db.collection('retailers').doc(retailer.slug);
    batch.set(docRef, {
      ...retailer,
      id: retailer.slug,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    count++;
  }

  await batch.commit();
  console.log(`✓ Seeded ${count} retailers`);
}

/**
 * Seed deals collection
 */
export async function seedDeals(db: admin.firestore.Firestore): Promise<void> {
  console.log('Seeding deals...');
  
  const batch = db.batch();
  let count = 0;

  for (const deal of deals) {
    const docRef = db.collection('deals').doc();
    batch.set(docRef, {
      ...deal,
      id: docRef.id,
      expirationDate: admin.firestore.Timestamp.fromDate(deal.expirationDate),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    count++;
  }

  await batch.commit();
  console.log(`✓ Seeded ${count} deals`);
}

/**
 * Seed all collections
 */
export async function seedAll(db: admin.firestore.Firestore): Promise<void> {
  try {
    console.log('Starting database seeding...\n');

    await seedCategories(db);
    await seedRetailers(db);
    await seedDeals(db);

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n✗ Error seeding database:', error);
    throw error;
  }
}
