"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from '@/lib/firebase'; // Import auth and db instances
const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'staff', // Assign a default role
        createdAt: new Date(),
      });

      console.log('User signed up and profile created:', user);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
 <div className="p-8 border rounded shadow-md">
 <h2>Sign Up</h2>
 {error && <p style={{ color: 'red' }}>{error}</p>}
 <div className="mb-4">
 <label htmlFor="email">Email:</label>
 <input
          type="email"
 id="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full px-3 py-2 border rounded"
 disabled={loading}
 />
      </div>
      <div className="mb-4">
 <label htmlFor="password">Password:</label>
 <input
          type="password"
 id="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full px-3 py-2 border rounded"
 disabled={loading}
 />
      </div>
      <button
        onClick={handleSignUp}
        disabled={loading}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </div>

    </div>
  );
};

export default SignUp;