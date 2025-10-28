// src/app/api/applications/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebaseAdmin'; // Assuming Admin SDK instances
import { doc, updateDoc } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify User Authentication and Permissions (Crucial for Admin Actions)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
      // Implement logic to check if the user has admin or reviewer privileges
      // For example, checking a custom claim in the token:
      // if (!decodedToken.admin) {
      //   return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
      // }
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const uid = decodedToken.uid;


    // 2. Get Application ID and New Status from Request Body
    const { applicationId, newStatus } = await req.json();

    if (!applicationId || !newStatus) {
      return NextResponse.json({ message: 'Application ID and new status are required.' }, { status: 400 });
    }

    // Validate the new status (ensure it's one of the allowed statuses)
    const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Requires Info']; // Define your allowed statuses
    if (!allowedStatuses.includes(newStatus)) {
      return NextResponse.json({ message: 'Invalid status provided.' }, { status: 400 });
    }

    // 3. Update Application Status in Firestore
    const applicationRef = doc(db, "applications", applicationId);

    try {
      await updateDoc(applicationRef, { status: newStatus });
      console.log(`Application ${applicationId} status updated to ${newStatus}`);

      // 4. Trigger Dashboard Update (Conceptual - using a custom event for simplicity)
      // In a real application, you might use Firestore triggers or a dedicated system
      // For simplicity, this example doesn't directly trigger frontend updates from the backend API route.
      // The frontend dashboard would poll or listen for changes.

      return NextResponse.json({ success: true, applicationId: applicationId, newStatus: newStatus });

    } catch (firestoreError: any) {
      console.error(`Error updating application ${applicationId} status:`, firestoreError);
      return NextResponse.json({ message: 'Failed to update application status.', details: firestoreError?.message }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in update-status API:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message }, { status: 500 });
  }
}
