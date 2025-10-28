import { NextRequest, NextResponse } from 'next/server';
/*import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';*/
import { db } from '@/lib/firebaseAdmin';
// Initialize Firebase Admin SDK if not already initialized

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get('applicationId');

  if (!applicationId) {
    return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
  }

  try {
    const applicationRef = db.collection('applications').where('applicationIdDisplay', '==', applicationId).limit(1);
    const snapshot = await applicationRef.get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const applicationData = snapshot.docs[0].data();

    return NextResponse.json(applicationData);

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}