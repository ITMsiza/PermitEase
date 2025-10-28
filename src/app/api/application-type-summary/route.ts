// src/app/api/application-type-summary/route.ts
import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { db } from "@/lib/firebaseAdmin";

// 🔹 Define your application types
const applicationTypes = ["New", "Renewal", "Transfer", "Conversion", "Route Amendment"];

// 🔹 Map application type to color (CSS variable)
const typeColorMap: Record<string, string> = {
  New: "var(--color-new)",
  Renewal: "var(--color-renewal)",
  Transfer: "var(--color-transfer)",
  Conversion: "var(--color-conversion)",
  "Route Amendment": "var(--color-amendment)",
};

type ApplicationTypeData = {
  name: string;
  value: number;
  fill: string;
};

export async function GET() {
  try {
    const snapshot = await db.collection("applications").get();

    // Initialize counts
    const counts: Record<string, number> = {};
    applicationTypes.forEach((type) => (counts[type] = 0));

    // Count application types
    snapshot.forEach((doc) => {
      const data = doc.data() as { applicationType?: string };
      const type = data.applicationType;
      if (type && counts[type] !== undefined) {
        counts[type] += 1;
      }
    });

    // Format result as array
    const applicationTypeData: ApplicationTypeData[] = Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
        fill: typeColorMap[name] || "#ccc",
      })
    );

    return NextResponse.json({ success: true, data: applicationTypeData });
  } catch (error: any) {
    console.error("Error fetching application type summary:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
