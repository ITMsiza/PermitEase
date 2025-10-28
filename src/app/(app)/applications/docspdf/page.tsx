// src/app/(app)/applications/docspdf/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast"; // Assuming this is the correct import

// Define a type for your application data (optional but recommended)
interface Application {
    id: string; // Assuming you have a unique ID
    applicationIdDisplay: string; // The ID you want to display and use for fetching specific data
    // Add other properties of your application data as needed
    [key: string]: any; // Allow for other arbitrary properties
}

export default function DocsPdfPage() {
    // State for fetching the list of applications
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [applicationsError, setApplicationsError] = useState<string | null>(null);

    // State for tracking individual PDF download loading
    const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

    // State for tracking individual Raw Data download loading
    const [downloadingRawDataId, setDownloadingRawDataId] = useState<string | null>(null);


    // Function to fetch the list of all pending applications
    const fetchPendingApplications = async () => {
        setLoadingApplications(true);
        setApplicationsError(null);
        try {
            // Ensure this endpoint returns the list of pending applications with their data
            const response = await fetch('/api/get-all-pending-applications?status=Pending');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch pending applications.');
            }

            const data: Application[] = await response.json(); // Assuming your API returns an array of applications
            setApplications(data);

        } catch (error: any) {
            console.error("Error fetching pending applications:", error);
            setApplicationsError(error.message || "An error occurred while fetching pending applications.");
            toast({
                title: "Error",
                description: error.message || "Could not fetch pending applications.",
                variant: "destructive",
            });
        } finally {
            setLoadingApplications(false);
        }
    };

    // Function to fetch and download the PDF for a specific application (Keep this if needed)
    const fetchAndDownloadApplicationPdf = async (applicationId: string, filename: string) => {
       setDownloadingPdfId(applicationId);
       try {
           const response = await fetch(`/api/get-application-pdf-data?applicationId=${applicationId}`);

           if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.error || `Failed to fetch PDF for application ${applicationId}.`);
           }

           const blob = await response.blob();
           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
           a.href = url;
           a.download = filename;
           document.body.appendChild(a);
           a.click();
           a.remove();
           window.URL.revokeObjectURL(url);

           toast({
               title: "Download Successful",
               description: `PDF downloaded for application ${applicationId}.`,
           });

       } catch (error: any) {
           console.error(`Error fetching or downloading PDF for ${applicationId}:`, error);
           toast({
               title: "Download Failed",
               description: error.message || `Could not download PDF for application ${applicationId}.`,
               variant: "destructive",
           });
       } finally {
           setDownloadingPdfId(null);
       }
    };

    // --- New Function to Fetch and Download Raw Data ---
    const fetchAndDownloadRawData = async (applicationId: string) => {
        setDownloadingRawDataId(applicationId);
        try {
            // Call your existing API endpoint that fetches single application data
            // This is likely similar to the one you use for displaying details
            const response = await fetch(`/api/get-application-data?applicationId=${applicationId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch data for application ${applicationId}.`);
            }

            const data = await response.json(); // Get the raw JSON data

            // Convert the data to a string (e.g., JSON string)
            const dataString = JSON.stringify(data, null, 2); // Use null, 2 for pretty printing JSON

            // Create a Blob with the data string
            const blob = new Blob([dataString], { type: 'application/json' }); // Use 'application/json' for JSON file

            // Create a downloadable link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `application_${applicationId}_data.json`; // Suggest a filename

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast({
                title: "Download Successful",
                description: `Raw data downloaded for application ${applicationId}.`,
            });

        } catch (error: any) {
            console.error(`Error fetching or downloading raw data for ${applicationId}:`, error);
            toast({
                title: "Download Failed",
                description: error.message || `Could not download raw data for application ${applicationId}.`,
                variant: "destructive",
            });
        } finally {
            setDownloadingRawDataId(null);
        }
    };


    // Fetch the list of applications when the component mounts
    useEffect(() => {
        fetchPendingApplications();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Pending Applications Data Download</h2>
                </div>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Download Application Data</CardTitle>
                        <CardDescription>
                            Click the button next to an Application ID to download its data or PDF report.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <Icons.fileText className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold text-foreground">Select an Application to Download</h3>

                            {/* Display loading, error, or the list of applications */}
                            {loadingApplications && (
                                <div className="mt-4 flex items-center">
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Loading pending applications...
                                </div>
                            )}
                            {applicationsError && (
                                <p className="mt-4 text-destructive">{applicationsError}</p>
                            )}

                            {!loadingApplications && !applicationsError && (
                                <div className="mt-6 w-full max-w-lg">
                                    {applications.length > 0 ? (
                                        <ul className="text-left space-y-3">
                                            {applications.map((app) => (
                                                <li key={app.id} className="border p-4 rounded-md flex flex-col sm:flex-row justify-between items-center">
                                                    <span className="font-medium mb-2 sm:mb-0 flex-grow text-left">{app.applicationIdDisplay}</span>
                                                    <div className="flex space-x-2"> {/* Container for multiple buttons */}
                                                         <Button
                                                             variant="outline"
                                                             size="sm"
                                                             onClick={() => fetchAndDownloadRawData(app.applicationIdDisplay)}
                                                             disabled={downloadingRawDataId === app.applicationIdDisplay}
                                                         >
                                                             {downloadingRawDataId === app.applicationIdDisplay ? (
                                                                 <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                                             ) : (
                                                                 <Icons.download className="mr-2 h-4 w-4" />
                                                             )}
                                                             {downloadingRawDataId === app.applicationIdDisplay ? "Downloading Data..." : "Download Data (JSON)"}
                                                         </Button>
                                                         {/* Keep the PDF download button if desired */}
                                                          <Button
                                                              variant="outline"
                                                              size="sm"
                                                              onClick={() => fetchAndDownloadApplicationPdf(app.applicationIdDisplay, `permit_${app.applicationIdDisplay}.pdf`)}
                                                              disabled={downloadingPdfId === app.applicationIdDisplay}
                                                          >
                                                             {downloadingPdfId === app.applicationIdDisplay ? (
                                                                 <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                                             ) : (
                                                                 <Icons.download className="mr-2 h-4 w-4" />
                                                             )}
                                                              {downloadingPdfId === app.applicationIdDisplay ? "Downloading PDF..." : "Download PDF"}
                                                          </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground">No pending applications found.</p>
                                    )}
                                </div>
                            )}

                        </div>
                    </CardContent>
                </Card>

                {/* Keep the combined PDF section if still needed */}
                {/* ... (Combined PDF card) ... */}

            </div>
        </ScrollArea>
    );
}