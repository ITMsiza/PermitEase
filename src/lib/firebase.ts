// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

const db = getFirestore(app);



// Export the Auth and Firestore instances
export { auth, db, type User };

/**
 * Sets user profile data in Firestore.
 *
 * @param user - The authenticated Firebase user object.
 * @param profileData - An object containing the profile data to set (e.g., { name: string, email: string }).
 * @returns A Promise that resolves when the data is successfully set.
 * @throws Error if the user is not authenticated or if required fields are missing/invalid.
 */
export const setUserProfile = async (user: User | null, profileData: { name: string; email: string; role: string; department: string; dotAddress: string; subordinates: string; }) => {
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (!profileData.name || typeof profileData.name !== 'string') {
    throw new Error("Invalid or missing name field.");
  }

  if (!profileData.email || typeof profileData.email !== 'string' || !/\S+@\S+\.\S+/.test(profileData.email)) {
    throw new Error("Invalid or missing email field.");
  }

  /*if (!profileData.role || typeof profileData.role !== 'string') {
    throw new Error("Invalid or missing role field.");
  }*/

  if (!profileData.department || typeof profileData.department !== 'string') {
    throw new Error("Invalid or missing department field.");
  }

  if (!profileData.dotAddress || typeof profileData.dotAddress !== 'string') {
    throw new Error("Invalid or missing DoT Address field.");
  }

  if (!profileData.subordinates || typeof profileData.subordinates !== 'string') {
    throw new Error("Invalid or missing subordinates field.");
  }

  try {
    await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
    return { status: 'success', message: 'Profile updated successfully.' };
  } catch (error: any) {
    console.error("Error setting user profile:", error);
    return { status: 'error', message: error.message || 'An unknown error occurred.' };
  }

  /*if (!user) {
    return { status: 'error', message: "User is not authenticated." };
  }

  try {
    await setDoc(doc(db, "applications", user.uid), applicationData, { merge: true });
    return { status: 'success', message: 'Application data saved successfully.' };
  } catch (error: any) {
    console.error("Error setting application data:", error);
    return { status: 'error', message: error.message || 'An unknown error occurred.' };
  }*/
};
