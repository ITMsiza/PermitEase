import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // Assuming you're using Firebase Admin SDK

export async function POST(req: Request) {
  try {
    // 1. Parse the request body
    const { applicationId, amendmentType, justification, ...otherAmendmentData } = await req.json();

    // 2. Validation
    if (!applicationId || !amendmentType || !justification) {
      return NextResponse.json(
        { message: "applicationId, amendmentType, and justification are required." },
        { status: 400 }
      );
    }

    // 3. Apply Business Logic based on amendmentType
    switch (amendmentType) {
      case "change_address":

        break;
      case "add_document":

        break;
      case "other":

        break;
      default:
        // Handle unknown amendment types (though validation above should prevent this)
        return NextResponse.json(
          { message: "Unsupported amendment type." },
          { status: 400 }
        );
    }

    // 4. Update Database (or create a new amendment record)
    // Example: Creating a new amendment record
    await db.collection("amendments").add({
      applicationId: applicationId,
      amendmentType: amendmentType,
      justification: justification,
      createdAt: new Date(),
    });

    // 5. Audit Trail/Logging (often done implicitly by database writes or explicitly here)
    console.log(`Amendment submitted for application ${applicationId} of type ${amendmentType}`);

    return NextResponse.json({
      success: true,
      message: `Amendment of type ${amendmentType} submitted for application ${applicationId}.`,
    });

  } catch (error: any) {
    console.error('Error in submit-amendment API:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message }, { status: 500 });
  }
}
