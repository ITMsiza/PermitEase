import { firestore } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let applicationsRef: firestore.CollectionReference | firestore.Query = db.collection('applications');
    if (status) {
      applicationsRef = applicationsRef.where('status', '==', status);
    }
    const snapshot = await applicationsRef.get();

    const applications: any[] = [];
    snapshot.forEach(doc => {
      applications.push({
        id: doc.id, // Include document ID if needed on the client side
        ...doc.data()
      });
    });

    return NextResponse.json(applications, { status: 200 });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ message: 'Error fetching applications', error: (error as Error).message }, { status: 500 });
  }
}