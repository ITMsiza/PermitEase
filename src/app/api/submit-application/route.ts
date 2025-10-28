// src/app/api/submit-application/route.ts
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
    const data = await req.json(); // Assuming the body is JSON

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
          // Decide how to handle upload errors: fail the submission or continue?
          // For now, let's log and continue, setting the field to null
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
      // You might also want to add the user ID here if not already in 'data'
      // userId: decodedToken.uid, // Assuming you verify token and get UID
    };

    // Determine the document reference
    // Using applicationIdDisplay if available, otherwise let Firestore create an ID (less common for submissions tied to a user)
    // A more typical approach might be to use the user's UID or let Firestore auto-generate
    const applicationRef = db.collection('applications').doc(dataToSave.applicationIdDisplay || undefined);
    // If you want to use user's UID as doc ID after token verification:
    // const applicationRef = db.collection('applications').doc(uid);

    // Save data to Firestore
    await applicationRef.set(dataToSave, { merge: true }); // Use set with merge: true

    /*const savedDoc = await applicationRef.get();
const savedData = savedDoc.data();

return NextResponse.json({
  ...savedData,
  submittedAt: savedData?.submittedAt?.toISOString() || null,
  applicationId: applicationRef.id,
});*/

    // Return success response
    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    // Return a more detailed error response in development, less in production
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message }, { status: 500 });
  }
}


/*import { db } from '@/lib/firebaseAdmin';
import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

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
    const data = await req.json();

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

    for (const field of fileFields) {
      const fileData = data[field];
      if (fileData && typeof fileData === 'string' && fileData.startsWith('data:')) {
        const uploadedUrl = await uploadToCloudinary(fileData, `${field}-${Date.now()}`);
        data[field] = uploadedUrl;
      } else {
        data[field] = null;
      }
    }

    const applicationRef = db.collection('applications').doc(data.applicationIdDisplay || undefined);
    await applicationRef.set({
      ...data,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message }, { status: 500 });
  }
}*/



// pages/api/submit-application.ts
/*import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, db } from '@/lib/firebaseAdmin';
import cloudinary from '@/lib/cloudinary';

// Helper to upload file data to Cloudinary
const uploadToCloudinary = async (fileData: string, filename: string) => {
  const uploadRes = await cloudinary.uploader.upload(fileData, {
    folder: 'permitwise_applications',
    public_id: filename,
    resource_type: 'auto', // auto handles pdf, png, etc.
  });
  return uploadRes.secure_url;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    let data = req.body;

    // 1. Handle file fields (base64 format expected)
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

    for (const field of fileFields) {
      const fileData = data[field];
      if (fileData && typeof fileData === 'string' && fileData.startsWith('data:')) {
        const uploadedUrl = await uploadToCloudinary(fileData, `${field}-${Date.now()}`);
        data[field] = uploadedUrl;
      } else {
        data[field] = null;
      }
    }

    // 2. Save to Firestore
    const applicationRef = db.collection('applications').doc(data.applicationIdDisplay || undefined);
    await applicationRef.set({
      ...data,
      uid,
      submittedAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, applicationId: applicationRef.id });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: (error as any)?.message });
  }
}*/













/*import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebaseAdmin'; // Assuming 'db' is the Admin SDK Firestore instance

import formidable from 'formidable';
import axios from 'axios';

// Configure formidable to handle incoming files
const form = formidable({ maxFileSize: 5 * 1024 * 1024 }); // Set max file size (e.g., 5MB)

// Helper function to parse the incoming request
function parseRequest(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

// Helper function to upload a file to Cloudinary
async function uploadToCloudinary(file: formidable.File): Promise<string> {
  const formData = new FormData();
  // Assuming the file object from formidable has a path or can be read into a Blob/Buffer
  // You might need to adjust this part based on the exact structure of formidable's File object
  // If formidable provides a file path, you might need to read the file content
  // If formidable provides a readable stream, you can pipe it to axios
  // For simplicity, let's assume we can append the file directly for now.
  // You might need to adjust this based on how formidable handles files and what axios expects.
  // A more robust approach might involve reading the file into a buffer.

  // Example: If formidable gives a file path
  // const fileContent = require('fs').readFileSync(file.filepath);
  // formData.append("file", new Blob([fileContent]), file.originalFilename || 'upload');


  // Example: Assuming file object can be appended directly (check formidable docs)
  formData.append("file", file as any); // Type assertion might be needed
  formData.append("upload_preset", "unsigned_preset"); // Replace with your actual preset

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dpnreoz8m/upload", // Replace with your Cloudinary cloud name
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary.");
  }
}


export async function POST(req: NextRequest) {
  try {
    // Verify the token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("Token verified."); // Log after token verification


    // Parse the request to get fields and files
    const { fields, files } = await parseRequest(req);

    // Prepare data for Firestore, separating file fields
    const firestoreData: any = {};
    const fileFields: { [key: string]: formidable.File | formidable.File[] } = {};

    // Separate fields and files
    for (const key in fields) {
       // formidable returns arrays even for single fields, so take the first element
      firestoreData[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    }

    for (const key in files) {
         // formidable returns arrays even for single files, so take the first element
         const fileFields: { [key: string]: formidable.File | formidable.File[] | undefined } = {};

    };

    console.log("Request parsed. Fields:", fields, "Files:", files); // Log parsed data

    // Upload files to Cloudinary and get URLs
    const uploadedFileUrls: { [key: string]: string } = {};
    for (const fieldName in fileFields) {
      const file = fileFields[fieldName];
       if (file) { // Check if file exists
          try {
               const url = await uploadToCloudinary(file as formidable.File); // Ensure it's treated as a single File
               uploadedFileUrls[fieldName] = url;
          } catch (error) {
               console.error(`Error uploading file ${fieldName}:`, error);
               return NextResponse.json({ message: `Failed to upload file: ${fieldName}` }, { status: 500 });
          }
       }
    }


    // Combine non-file data with Cloudinary URLs
    const updatedData = {
      ...firestoreData,
      ...uploadedFileUrls,
      // Add any other server-side data you want to store (e.g., timestamp)
      createdAt: new Date().toISOString(),
      userId: uid, // Store the user's ID
    };

    console.log("Uploaded file URLs:", uploadedFileUrls); // Log after file uploads


    // Save data to Firestore using Admin SDK functions
    const applicationDocRef = db.collection("applications").doc(uid); // Use Admin SDK approach
    await applicationDocRef.set(updatedData, { merge: true }); // Use set with merge: true

    console.log("Saving to Firestore:", updatedData); // Log data before saving

    return NextResponse.json({ success: true, message: "Form received." })
    
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}*/
