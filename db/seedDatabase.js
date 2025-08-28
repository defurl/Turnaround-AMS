// This is a Node.js script to initialize and seed your Firestore database.
//
// HOW TO RUN:
// 1. Ensure you have installed deps: `npm install firebase-admin`.
// 2. Download your service account key JSON from the Firebase Console.
// 3. Save it as `serviceAccountKey.json` in the same directory as this script.
// 4. From your terminal, run: `node seedDatabase.js`
//
// NOTE: This script will add new turnarounds each time it's run. For a clean test,
// you can manually delete the 'turnarounds' collection in Firebase before running.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Logging helpers ----
const log = (...args) => console.log(`[SEED]`, ...args);
const error = (...args) => console.error(`[SEED ERROR]`, ...args);

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

const db = getFirestore();

// --- EXPANDED MOCK DATA ---
// Using the UIDs you provided as examples.
const users = {
  'oyNXZXbe58drPs01sjs89FreQ893': { employeeId: 'SUP001', fullName: 'Alice Supervisor', role: 'Supervisor', assignedTurnarounds: [] },
  'QB2HAwd0e1PsuLiVLdcn8V81eKs2': { employeeId: 'RAMP001', fullName: 'Bob Ramp', role: 'Ramp Agent', assignedTurnarounds: [] },
  'lRX1iSQrlkfRkaigCrHQxUqQ6w62': { employeeId: 'RAMP002', fullName: 'Charlie Ramp', role: 'Ramp Agent', assignedTurnarounds: [] },
  'yqOVbQwuTIerNx8TQRkY2G5M2mZ2': { employeeId: 'MAINT001', fullName: 'David Maintenance', role: 'Maintenance Engineer', assignedTurnarounds: [] },
  'Ft4i8A63rYWnFLoWUteKPBls7WD2': { employeeId: 'MAINT002', fullName: 'Frank Maintenance', role: 'Maintenance Engineer', assignedTurnarounds: [] },
  'ZiUWfH3UqpbwxNyVMKVOvxakQmz2': { employeeId: 'CAT001', fullName: 'Eve Catering', role: 'Catering', assignedTurnarounds: [] },
};

const flights = {
    'BA2490-2025-09-15': { flightNumber: 'BA2490', airline: 'British Airways', aircraftType: '787-9', origin: 'LHR', destination: 'JFK', scheduledArrival: new Date('2025-09-15T14:30:00Z'), scheduledDeparture: new Date('2025-09-15T16:00:00Z') },
    'AF123-2025-09-15': { flightNumber: 'AF123', airline: 'Air France', aircraftType: 'A350', origin: 'CDG', destination: 'SFO', scheduledArrival: new Date('2025-09-15T17:00:00Z'), scheduledDeparture: new Date('2025-09-15T18:30:00Z') },
    'LH400-2025-09-15': { flightNumber: 'LH400', airline: 'Lufthansa', aircraftType: '747-8', origin: 'FRA', destination: 'JFK', scheduledArrival: new Date('2025-09-15T19:00:00Z'), scheduledDeparture: new Date('2025-09-15T20:30:00Z') },
    'UA88-2025-09-15': { flightNumber: 'UA88', airline: 'United Airlines', aircraftType: '777-300ER', origin: 'EWR', destination: 'PEK', scheduledArrival: new Date('2025-09-15T21:00:00Z'), scheduledDeparture: new Date('2025-09-15T22:30:00Z') },
};

const turnarounds = [
    {
        flightInfo: { flightNumber: 'BA2490', origin: 'LHR', aircraftType: '787-9' },
        gate: 'B34', status: 'In Progress', progress: 25,
        assignedCrew: [
            { uid: 'oyNXZXbe58drPs01sjs89FreQ893', name: 'Alice Supervisor', role: 'Supervisor' },
            { uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2', name: 'Bob Ramp', role: 'Ramp Agent' },
            { uid: 'yqOVbQwuTIerNx8TQRkY2G5M2mZ2', name: 'David Maintenance', role: 'Maintenance Engineer' },
            { uid: 'ZiUWfH3UqpbwxNyVMKVOvxakQmz2', name: 'Eve Catering', role: 'Catering' },
        ],
        lastUpdated: new Date(),
        tasks: [
            { name: 'Position Chocks', assignedRole: 'Ramp Agent', assignedTo: { uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2', name: 'Bob Ramp' }, status: 'Completed', isDelayed: false, sequence: 1 },
            { name: 'Connect Ground Power', assignedRole: 'Ramp Agent', assignedTo: { uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2', name: 'Bob Ramp' }, status: 'Pending', isDelayed: false, sequence: 2 },
            { name: 'Perform Walkaround Inspection', assignedRole: 'Maintenance Engineer', assignedTo: { uid: 'yqOVbQwuTIerNx8TQRkY2G5M2mZ2', name: 'David Maintenance' }, status: 'Pending', isDelayed: false, sequence: 3 },
            { name: 'Catering Service Dock', assignedRole: 'Catering', assignedTo: { uid: 'ZiUWfH3UqpbwxNyVMKVOvxakQmz2', name: 'Eve Catering' }, status: 'Pending', isDelayed: false, sequence: 4 },
        ]
    },
    {
        flightInfo: { flightNumber: 'LH400', origin: 'FRA', aircraftType: '747-8' },
        gate: 'A7', status: 'Delayed', progress: 50,
        assignedCrew: [
            { uid: 'oyNXZXbe58drPs01sjs89FreQ893', name: 'Alice Supervisor', role: 'Supervisor' },
            { uid: 'lRX1iSQrlkfRkaigCrHQxUqQ6w62', name: 'Charlie Ramp', role: 'Ramp Agent' },
            { uid: 'yqOVbQwuTIerNx8TQRkY2G5M2mZ2', name: 'David Maintenance', role: 'Maintenance Engineer' },
        ],
        lastUpdated: new Date(),
        tasks: [
            { name: 'Position Chocks', assignedRole: 'Ramp Agent', assignedTo: { uid: 'lRX1iSQrlkfRkaigCrHQxUqQ6w62', name: 'Charlie Ramp' }, status: 'Completed', isDelayed: false, sequence: 1 },
            { name: 'Connect Ground Power', assignedRole: 'Ramp Agent', assignedTo: { uid: 'lRX1iSQrlkfRkaigCrHQxUqQ6w62', name: 'Charlie Ramp' }, status: 'Completed', isDelayed: false, sequence: 2 },
            { 
              name: 'Begin Baggage Unload', 
              assignedRole: 'Ramp Agent', 
              assignedTo: { uid: 'lRX1iSQrlkfRkaigCrHQxUqQ6w62', name: 'Charlie Ramp' }, 
              status: 'Delayed', 
              isDelayed: true, 
              delayReason: 'Late arrival of baggage cart.', 
              delayTimestamp: new Date(),
              estimatedDelayMinutes: 30,
              reportedBy: { 
                uid: 'lRX1iSQrlkfRkaigCrHQxUqQ6w62', 
                name: 'Charlie Ramp',
                role: 'Ramp Agent'
              },
              sequence: 3 
            },
            { name: 'Engine Oil Check', assignedRole: 'Maintenance Engineer', assignedTo: { uid: 'yqOVbQwuTIerNx8TQRkY2G5M2mZ2', name: 'David Maintenance' }, status: 'Pending', isDelayed: false, sequence: 4 },
        ]
    },
    {
        flightInfo: { flightNumber: 'UA88', origin: 'EWR', aircraftType: '777-300ER' },
        gate: 'C12', status: 'On Time', progress: 0,
        assignedCrew: [
            { uid: 'oyNXZXbe58drPs01sjs89FreQ893', name: 'Alice Supervisor', role: 'Supervisor' },
            { uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2', name: 'Bob Ramp', role: 'Ramp Agent' },
            { uid: 'Ft4i8A63rYWnFLoWUteKPBls7WD2', name: 'Frank Maintenance', role: 'Maintenance Engineer' },
            { uid: 'ZiUWfH3UqpbwxNyVMKVOvxakQmz2', name: 'Eve Catering', role: 'Catering' },
        ],
        lastUpdated: new Date(),
        tasks: [
            { name: 'Position Chocks', assignedRole: 'Ramp Agent', assignedTo: { uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2', name: 'Bob Ramp' }, status: 'Pending', isDelayed: false, sequence: 1 },
            { name: 'Connect Ground Power', assignedRole: 'Ramp Agent', assignedTo: { uid: 'QB2HAwd0e1PsuLiVLdcn8V81eKs2', name: 'Bob Ramp' }, status: 'Pending', isDelayed: false, sequence: 2 },
            { name: 'Fuel Check', assignedRole: 'Maintenance Engineer', assignedTo: { uid: 'Ft4i8A63rYWnFLoWUteKPBls7WD2', name: 'Frank Maintenance' }, status: 'Pending', isDelayed: false, sequence: 3 },
            { name: 'Load Catering Supplies', assignedRole: 'Catering', assignedTo: { uid: 'ZiUWfH3UqpbwxNyVMKVOvxakQmz2', name: 'Eve Catering' }, status: 'Pending', isDelayed: false, sequence: 4 },
        ]
    },
];

// --- Seeding Function ---
async function seedDatabase() {
  log('Starting database seeding...');
  const batch = db.batch();

  log('Seeding users...');
  for (const [id, data] of Object.entries(users)) {
    if (id.includes('NEW_')) {
        error(`Please replace placeholder UID '${id}' with a real Firebase Auth UID.`);
        continue;
    }
    const userRef = db.collection('users').doc(id);
    batch.set(userRef, { ...data, assignedTurnarounds: [] }, { merge: true }); // Reset turnarounds
  }

  // Seed Flights (idempotent: will create or update)
  log('Seeding flights...');
  for (const [id, data] of Object.entries(flights)) {
    const flightRef = db.collection('flights').doc(id);
    batch.set(flightRef, data);
  }
  
  await batch.commit();
  log('Users and flights seeded.');

  // Seed Turnarounds (non-idempotent: adds new ones each time)
  log('Seeding turnarounds...');
  for (const turnaroundData of turnarounds) {
    const { tasks, ...turnaroundDoc } = turnaroundData;
    const turnaroundRef = await db.collection('turnarounds').add(turnaroundDoc);
    log(`Created turnaround with ID: ${turnaroundRef.id}`);

    // Update user docs with this turnaround ID
    for (const crewMember of turnaroundDoc.assignedCrew) {
        const userRef = db.collection('users').doc(crewMember.uid);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const existingTurnarounds = userDoc.data().assignedTurnarounds || [];
            await userRef.update({
                assignedTurnarounds: [...existingTurnarounds, turnaroundRef.id]
            });
        }
    }

    // Seed Tasks sub-collection
    const tasksBatch = db.batch();
    for (const task of tasks) {
      const taskRef = turnaroundRef.collection('tasks').doc();
      tasksBatch.set(taskRef, { 
          ...task, 
          completedBy: task.status === 'Completed' ? { 
            uid: task.assignedTo.uid, 
            name: task.assignedTo.name 
          } : null, 
          completionTime: task.status === 'Completed' ? new Date() : null,
          delayReason: task.delayReason || null,
          delayTimestamp: task.delayTimestamp || null,
          estimatedDelayMinutes: task.estimatedDelayMinutes || null,
          reportedBy: task.reportedBy || null,
      });
    }
    await tasksBatch.commit();
  }
  log('Turnarounds seeded.');

  log('Database seeding completed successfully!');
}

seedDatabase().catch(e => {
    error('An error occurred during seeding:', e);
    process.exit(1);
});