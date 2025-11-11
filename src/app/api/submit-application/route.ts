import { db } from '@/lib/firebaseAdmin'; // Assuming 'db' is your Admin SDK Firestore instance
import cloudinary from '@/lib/cloudinary';
import { serverTimestamp, Timestamp  } from "firebase/firestore";

import { NextRequest, NextResponse } from 'next/server';

// Helper function to upload base64 file data to Cloudinary
const uploadToCloudinary = async (fileData: string, filename: string) => {
  const uploadRes = await cloudinary.uploader.upload(fileData, {
    folder: 'permitwise_applications', 
    public_id: filename,
    resource_type: 'auto',
  });
  return uploadRes.secure_url;
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // body is JSON

    const fileFields = [
      'saIdDocumentFile',
      'saPassportDocumentFile',
      'foreignPassportDocumentFile',
      'driversLicenceFile',
      'companyRegistrationDocumentFile',
      'companyMemorandumOfUnderstandingFile',
      'companyCertificateOfIncorporationFile',
      'companyFoundingStatementFile',
      'taxClearanceCertificateFile',
    ];

    // Process file fields for Cloudinary upload
    for (const field of fileFields) {
      const fileData = data[field];
      // Check if the field contains base64 file data
      if (fileData && typeof fileData === 'string' && fileData.startsWith('data:')) {
        try {
          const uploadedUrl = await uploadToCloudinary(fileData, `${field}-${Date.now()}`);
          data[field] = uploadedUrl; // Replace base64 data with Cloudinary URL
        } catch (uploadError) {
          console.error(`Error uploading file ${field} to Cloudinary:`, uploadError);
          data[field] = null;
        }
      } else {
        // If it's not base64 data or doesn't exist, ensure it's null or remove it if not needed
        data[field] = null;
      }
    }

    // Prepare data for Firestore, adding the initial status
    const dataToSave = {
      ...data,
      status: "Pending", // Set the initial status to "Pending"
      submittedAt: new Date(), // Consider using serverTimestamp() for server-side timestamp
    };

    // Determine the document reference
    // Using applicationIdDisplay if available, otherwise let Firestore create an ID (less common for submissions tied to a user)
    const applicationRef = db.collection('applications').doc(dataToSave.applicationIdDisplay || undefined);
    // If you want to use user's UID as doc ID after token verification:
    // const applicationRef = db.collection('applications').doc(uid);

    // Save data to Firestore
    await applicationRef.set(dataToSave, { merge: true }); // Use set with merge: true

    // Return success response
    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    // Return a more detailed error response in development, less in production
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message }, { status: 500 });
  }
}