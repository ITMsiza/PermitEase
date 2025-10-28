import { NextResponse } from "next/server";
import {db} from "@/lib/firebaseAdmin";

// 🔹 Map full province names to abbreviations
const provinceMap: Record<string, string> = {
  "Gauteng": "GP",
  "Western Cape": "WC",
  "KwaZulu-Natal": "KZN",
  "Eastern Cape": "EC",
  "Limpopo": "LP",
  "Mpumalanga": "MP",
  "North West": "NW",
  "Free State": "FS",
  "Northern Cape": "NC",
};

// 🔹 Type for status counts
type StatusCounts = {
  approved: number;
  pending: number;
  rejected: number;
};

// 🔹 Type for final API response
type ProvinceStatus = {
  province: string;
  approved: number;
  pending: number;
  rejected: number;
};

export async function GET() {
  try {
    const snapshot = await db.collection("applications").get();

    // 🔹 Initialize result structure with 0 counts
    const counts: Record<string, StatusCounts> = {};
    Object.values(provinceMap).forEach((abbr) => {
      counts[abbr] = { approved: 0, pending: 0, rejected: 0 };
    });

    // 🔹 Count statuses
    snapshot.forEach((doc) => {
      const data = doc.data() as { province?: string; status?: string };

      const provinceName = data.province || "Unknown";
      const provinceAbbr = provinceMap[provinceName] || provinceName;
      const status = (data.status || "").toLowerCase();

      if (!counts[provinceAbbr]) {
        counts[provinceAbbr] = { approved: 0, pending: 0, rejected: 0 };
      }

      if (status === "approved") counts[provinceAbbr].approved += 1;
      if (status === "pending") counts[provinceAbbr].pending += 1;
      if (status === "rejected") counts[provinceAbbr].rejected += 1;
    });

    // 🔹 Convert to array format
    const provincialApplicationStatusData: ProvinceStatus[] = Object.entries(counts).map(
      ([province, { approved, pending, rejected }]) => ({
        province,
        approved,
        pending,
        rejected,
      })
    );

    return NextResponse.json({ success: true, data: provincialApplicationStatusData });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
