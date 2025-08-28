// This script creates test users in Firebase Authentication
// Run with: node db/createUsers.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Logging helpers ----
const log = (...args) => console.log(`[CREATE USERS]`, ...args);
const error = (...args) => console.error(`[CREATE USERS ERROR]`, ...args);

// ---- Load service account key ----
let serviceAccount;
try {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');
  log('Reading service account key...');
  const raw = fs.readFileSync(keyPath, 'utf8');
  serviceAccount = JSON.parse(raw);
  log('Service account key loaded for project:', serviceAccount.project_id);
} catch (e) {
  error('Failed to read or parse serviceAccountKey.json. Ensure the file exists and is valid JSON.');
  process.exit(1);
}

// ---- Initialize Firebase Admin ----
try {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  log('Firebase Admin initialized successfully.');
} catch (e) {
  error('Failed to initialize Firebase Admin SDK:', e);
  process.exit(1);
}

const auth = getAuth();

// Test users to create
const testUsers = [
  { email: 'ramp@test.com', password: 'password123', displayName: 'Bob Ramp', uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2' },
  { email: 'supervisor@test.com', password: 'password123', displayName: 'Alice Supervisor', uid: 'oyNXZXbe58drPs01sjs89FreQ893' },
  { email: 'maintenance@test.com', password: 'password123', displayName: 'David Maintenance', uid: 'yqOVbQwuTIerNx8TQRkY2G5M2mZ2' },
];

async function createUser(userInfo) {
  try {
    // Check if user exists
    try {
      await auth.getUser(userInfo.uid);
      log(`User ${userInfo.email} already exists. Updating...`);
      
      // Update existing user
      await auth.updateUser(userInfo.uid, {
        email: userInfo.email,
        displayName: userInfo.displayName,
        password: userInfo.password
      });
      log(`Updated user: ${userInfo.email}`);
      
      return;
    } catch (e) {
      // User doesn't exist, create new one
      if (e.code === 'auth/user-not-found') {
        const user = await auth.createUser({
          uid: userInfo.uid,
          email: userInfo.email,
          emailVerified: true,
          password: userInfo.password,
          displayName: userInfo.displayName,
          disabled: false
        });
        
        log(`Created new user: ${user.uid} (${userInfo.email})`);
      } else {
        throw e;
      }
    }
  } catch (e) {
    error(`Error processing user ${userInfo.email}:`, e);
  }
}

async function createUsers() {
  log('Starting user creation...');
  
  for (const user of testUsers) {
    await createUser(user);
  }
  
  log('User creation complete!');
}

createUsers()
  .then(() => {
    log('All users processed successfully');
    process.exit(0);
  })
  .catch(e => {
    error('An error occurred:', e);
    process.exit(1);
  });