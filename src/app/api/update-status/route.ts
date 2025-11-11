import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebaseAdmin'; // Admin SDK instances

export async function POST(req: NextRequest) {
  try {
    // 1. Verify User Authentication and Permissions 
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
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
    const applicationRef = db.collection('applications').doc(applicationId);

    try {
      await applicationRef.update({ status: newStatus });
      
      console.log(`Application ${applicationId} status updated to ${newStatus}`);

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
