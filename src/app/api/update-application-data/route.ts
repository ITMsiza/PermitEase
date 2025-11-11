import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // Your initialized Firebase Admin SDK

export async function POST(req: Request) {
  try {
    // Parse request body
    const { applicationId, newStatus } = await req.json();

    //  Validate input
    if (!applicationId || !newStatus) {
      return NextResponse.json(
        { message: "applicationId and newStatus are required." },
        { status: 400 }
      );
    }

    //  Optional: Ensure newStatus is valid
    const allowedStatuses = ["Approved", "Rejected"];
    if (!allowedStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: "Invalid status value." },
        { status: 400 }
      );
    }

    //  Update Firestore document
    await db.collection("applications").doc(applicationId).update({
      status: newStatus,
    });

    return NextResponse.json({
      message: `Status updated to ${newStatus} for application ${applicationId}.`,
    });

  } catch (error: any) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { message: "Failed to update application status.", error: error.message },
      { status: 500 }
    );
  }
}