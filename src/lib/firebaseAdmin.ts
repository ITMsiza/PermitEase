import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";


if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();
export const adminAuth = getAuth();


/*import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth"; // Import getAuth


if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.GOOGLE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}


export const db = getFirestore();
export const adminAuth = getAuth(); // Export adminAuth*/