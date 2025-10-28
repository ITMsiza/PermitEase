// src/app/api/dashboard/kpis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Admin SDK Firestore instance
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeFilter = searchParams.get('timeFilter');

    let startDate = new Date(0); // Default to start of epoch (all time)
    const endDate = new Date(); // Default end date is now

    /*if (timeFilter === 'weekly') {
      // Set startDate to the beginning of 7 days ago
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6); // Count the current day as well
    } else if (timeFilter === 'monthly') {
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 1);
    }*/
      if (timeFilter === 'weekly') {
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } 
      else if (timeFilter === 'bi-weekly') {
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 14);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } 
      else if (timeFilter === 'monthly') {
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } 
      else if (timeFilter === 'quarterly') {
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } 
      else if (timeFilter === '6-monthly') {
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } 
      else if (timeFilter === 'yearly') {
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }
    // Add more time filter options as needed (e.g., 'yearly')

    // Convert dates to Firestore Timestamps for querying
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    // Fetch applications within the calculated date range
    const snapshot = await db.collection("applications")
      .where('submittedAt', '>=', startTimestamp)
      .where('submittedAt', '<=', endTimestamp)
      .get();
    const applications = snapshot.docs.map(doc => doc.data());

    // Calculate KPIs based on the filtered applications
    const totalRevenue = applications.reduce((sum, app) => {
      // Assuming 'revenue' field exists on application documents
      return sum + (app.revenue && typeof app.revenue === 'number' ? app.revenue : 0);
    }, 0);
    
    const pendingApplications = applications.filter(app => app.status === 'Pending').length;
    const approvedPermits = applications.filter(app => app.status === 'Approved').length;
    const rejectedApplications = applications.filter(app => app.status === 'Rejected').length;

    const kpiData = [
      {
        id: "totalRevenue",
        title: "Total Revenue",
        value: `R ${totalRevenue.toFixed(2)}`, // Displaying with 2 decimal places
        description: "+15% from last month", // This description is static, update as needed
        baseValue: totalRevenue,
      },
      {
        id: "pendingApplications",
        title: "Pending Applications",
        value: String(pendingApplications),
        description: `Count for ${timeFilter || 'all time'}`, // Dynamic description
        baseValue: pendingApplications,
      },
      {
        id: "approvedPermits",
        title: "Approved Permits",
        value: String(approvedPermits),
        description: `Count for ${timeFilter || 'all time'}`, // Dynamic description
        baseValue: approvedPermits,
      },
      {
        id: "rejectedApplications",
        title: "Rejected Applications",
        value: String(rejectedApplications),
        description: `Count for ${timeFilter || 'all time'}`, // Dynamic description
        baseValue: rejectedApplications,
      },
    ];

    return NextResponse.json(kpiData);

  } catch (error) {
    console.error("Error fetching KPI data:", error);
    return NextResponse.json({ message: 'Failed to fetch KPI data.' }, { status: 500 });
  }
}