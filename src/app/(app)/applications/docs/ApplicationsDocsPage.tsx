'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; 

interface Application {
  applicationIdDisplay: string;
}

export default function ApplicationsDocsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add a loading state specifically for selected application data
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [selectedApplicationData, setSelectedApplicationData] = useState<any>(null); // To hold data for the selected application

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true); // Keep loading for the list of applications
        const response = await fetch('/api/get-all-applications');
        if (!response.ok) {
          throw new Error(`Error fetching applications: ${response.statusText}`);
        }
        const data = await response.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);

      }
    };

     const fetchPendingApplications = async () => {
      try {
        setLoading(true); // Keep loading for the list of applications
        const response = await fetch('/api/get-all-pending-applications?status=Pending');
        if (!response.ok) {
          throw new Error(`Error fetching pending applications: ${response.statusText}`);
        }
        const data = await response.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching pending applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingApplications(); // Fetch only pending applications
    fetchApplications();
  }, []); // Fetch applications only once on component mount
  
  useEffect(() => {
    if (applicationId) {
      const fetchApplicationData = async () => {
        try {
          setLoadingSelected(true); // Set loading state for the specific application data
          const response = await fetch(`/api/get-application-data?applicationId=${applicationId}`);
          if (!response.ok) {
            throw new Error(`Error fetching application data: ${response.statusText}`);
          }
          const data = await response.json();
          setSelectedApplicationData(data);
        } catch (err: any) {
          // Handle error fetching specific application data
          console.error(`Error fetching data for application ${applicationId}:`, err);
          setSelectedApplicationData(null); // Clear data if fetch fails
        } finally {          setLoadingSelected(false); // Unset loading
        }
      };

      fetchApplicationData();
    } else {
      setSelectedApplicationData(null); // Clear selected data if no ID in URL
    }
  }, [applicationId]); // Fetch specific application data when applicationId changes

  
  const handleApplicationSelect = (id: string) => {
    router.push(`/applications/review?applicationId=${id}`);
  };

  const breadcrumbItems = [
    { label: 'Permits', href: '/applications' },
    { label: 'Documents' }
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading applications...</p>}
            {error && <p className="text-destructive">Error: {error}</p>}
            {!loading && !error && applications.length === 0 && (
              <p>No applications found.</p>
            )}
            {!loading && !error && applications.length > 0 && (
              <ScrollArea className="h-[500px]">
                <ul className="space-y-2">
                  {applications.map((app) => (
                    <li key={app.applicationIdDisplay}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${applicationId === app.applicationIdDisplay ? 'font-semibold bg-muted' : ''}`}
                        onClick={() => handleApplicationSelect(app.applicationIdDisplay)}
                      >
                        {app.applicationIdDisplay}
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}