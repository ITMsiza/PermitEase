import { db } from '@/lib/firebaseAdmin'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(req: NextRequest) {
  try {
    // Calculate the timestamp for 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const fourteenDaysAgoTimestamp = Timestamp.fromDate(fourteenDaysAgo);

    // Query Firestore for applications submitted within the last 14 days
    const applicationsRef = db.collection('applications');
    const snapshot = await applicationsRef
      .where('submittedAt', '>=', fourteenDaysAgo)
      .orderBy('submittedAt', 'desc') // Optional: order by submission date
      .get();

    const recentApplications: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Convert Timestamp to a serializable format if needed (e.g., ISO string)
      if (data.submittedAt instanceof Timestamp) {
        data.submittedAt = data.submittedAt.toDate().toISOString();
      }
      recentApplications.push({
        id: doc.id, // Include document ID if needed
        ...data,
      });
    });

    return NextResponse.json(recentApplications, { status: 200 });

  } catch (error) {
    console.error('Error fetching recent applications:', error);
    return NextResponse.json({ message: 'Error fetching recent applications', error }, { status: 500 });
  }
}