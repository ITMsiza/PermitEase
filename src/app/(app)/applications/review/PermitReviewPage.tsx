"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter for potential redirection
import { useToast } from '@/hooks/use-toast'; // Assuming useToast
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

// This must be removed
const applicationDetails = {
  applicantName: "Johannes van der Merwe",
  permitType: "Public Operating Licence",
  referenceNumber: "APP-2023-001-GP",
  submissionDate: "15 Nov 2023",
  status: "Pending" as "Pending" | "Approved" | "Rejected",
  applicationSubType: "New Application",
};

/*interface Application {
  applicationIdDisplay: string;
  // Add other properties you might want to display initially, e.g.:
  // applicationType: string;
  // submittedAt: string;
}*/
/*interface ApplicationData {
  // ... (Your existing and new fields here)
   applicationIdDisplay: string | null;
   applicationType: string; // This field is likely intended for the new section
   amendmentType?: string;
   serviceType: string; // Keep this existing field
   applyingAs: 'individual' | 'company' | '';
    appCompany?: string; // Affiliated With
   identificationType?: 'sa_id' | 'sa_passport' | 'foreign_passport' | '';
    // Add other existing fields here
    fullName?: string;
    saIdNumber?: string;
    saIdDocumentFile?: File | null;
    saPassportNumber?: string;
    saPassportDocumentFile?: File | null;
    foreignPassportNumber?: string;
    foreignPassportDocumentFile?: File | null;
    driversLicenceNumber?: string;
    driversLicenceFile?: File | null;

    companyName?: string;
    companyRegistrationNumber?: string;
    companyRegistrationDocumentFile: File | null;
    tradeName?: string;
    businessType?: string;
    companyMemorandumOfUnderstanding: boolean;
    companyMemorandumOfUnderstandingFile: File | null;
    companyCertificateOfIncorporation: boolean;
    companyCertificateOfIncorporationFile: File | null;
    companyFoundingStatement: boolean;
    companyFoundingStatementFile: File | null;

    incomeTaxNumber?: string;
    taxClearanceCertificateFile: File | null;

     // Address fields (from your snippet)
    postalAddressStreet: string;
    postalAddressSuburb: string; // Keep this existing field
    postalAddressCity: string; // Keep this existing field
    postalCode: string;
    domiciliumCitandi: string;
    isStreetAddressSameAsPostal: boolean;
    streetAddressStreet?: string;
    streetAddressSuburb?: string;
    streetAddressCity?: string;
    streetPostalCode?: string;

    // --- NEW FIELDS (for the new sections) ---

    // Application Type (using new names to avoid conflict if needed, adjust as required)
    newApplicationTypeSelection: string;
    newPermitSubTypeSelection: string;

    // Contact Information (new fields not covered by existing address)

    telephoneCode?: string;
    telephoneNumber: string;
    emailAddress: string;

    // Vehicle Information
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number | '';
    vehicleVIN: string;
    vehicleRegistrationNumber: string;
    vehicleOwnershipDocumentFile: File | null;
    vehicleLicenseDiscFile: File | null;
}*/

const formSections = [
  { id: "A", title: "Application Type" },
  { id: "B", title: "Applicant Details" },
  { id: "C", title: "Representative Info" },
  { id: "D", title: "Existing Licence Info" },
  { id: "F", title: "Transport Service Type" },
  { id: "G", title: "Route Details" },
  { id: "H", title: "Ranks & Terminals" },
  { id: "I", title: "Contract Info" },
  { id: "L", title: "Vehicle Information" },
];

const getStatusBadgeVariant = (status: "Pending" | "Approved" | "Rejected") => {
  switch (status) {
    case "Approved": return "success";
    case "Pending": return "warning";
    case "Rejected": return "destructive";
    default: return "outline";
  }
};

/*interface ApplicantType {
  newApplicationTypeSelection: string;
  newPermitSubTypeSelection: string;
}

interface ApplicantDetails {
  fullName?: string;
saIdNumber?: string;
saIdDocumentFile?: File | null;

saPassportNumber?: string;
saPassportDocumentFile?: File | null;

foreignPassportNumber?: string;
foreignPassportDocumentFile?: File | null;

driversLicenceNumber?: string;
driversLicenceFile?: File | null;
}

interface ServiceType {
  serviceType: string; // Keep this existing field
}

interface ContactInfor {
  telephoneCode?: string;      // Area code or country code
telephoneNumber: string;     // Main phone number
emailAddress: string;        // Primary email

}

interface RepresentativeInfo
{
  fullName?: string;  
identificationType?: 'sa_id' | 'sa_passport' | 'foreign_passport' | '';

saIdNumber?: string;
saIdDocumentFile?: File | null;

saPassportNumber?: string;
saPassportDocumentFile?: File | null;

foreignPassportNumber?: string;
foreignPassportDocumentFile?: File | null;

driversLicenceNumber?: string;
driversLicenceFile?: File | null;

}

interface VehicleDetails {
  vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number | '';
    vehicleVIN: string;
    vehicleRegistrationNumber: string;
    vehicleOwnershipDocumentFile: File | null;
    vehicleLicenseDiscFile: File | null;
}*/

/*interface ApplicationData {
  amendmentType?: string;
  serviceType?: string;
  applyingAs?: string;
  applicantInfo?: ApplicantInfo;
  vehicleDetails?: VehicleDetails;
}*/

export default function PermitReviewPage() {
  
  const [selectedApplicationData, setSelectedApplicationData] = useState<any>(null); // To hold data for the selected application
  //const [applications, setApplications] = useState<ApplicationData[]>([]);
  //const [selectedApplicationData, setSelectedApplicationData] = useState<ApplicationData | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);

    // Assuming you have the application ID available (e.g., from route parameters)
    // const applicationId = router.query.applicationId; // Example for Pages Router
    // In App Router, you might get params from the component props or a hook

    try {
      // Call your backend API to update the status
      const response = await fetch(`/api/update-application-data?applicationId=${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if your backend requires it for admin actions
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({ applicationId, newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status.');
      }

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}.`,
      });

      // Optionally, redirect after update
      // router.push('/admin/applications'); // Redirect back to the applications list

    } catch (error: any) {
      console.error(`Error updating status to ${newStatus}:`, error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred while updating status.',
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      const fetchApplicationData = async () => {
        try {
          setLoadingSelected(true); // Set loading state for the specific application data
          // setLoading(true);
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
          // setLoading(false); // Unset loading if used
        }
      };

      fetchApplicationData();
    } else {
      setSelectedApplicationData(null); // Clear selected data if no ID in URL
    }
  }, [applicationId]); // Fetch specific application data when applicationId changes

  //---------------------------------------------------------------------------------
  const renderSectionContent = (sectionId: string) => {
    if (!selectedApplicationData) {
      return <p className="text-muted-foreground">Select an application to view details.</p>;
    }

    switch (sectionId) {
      case "A":
        return (
          <div>
            <p>Amendment Type: {selectedApplicationData.amendmentType}</p>
          </div>
        );

      case "B":
        return (
          <div>
            <p>fullName: {selectedApplicationData.fullName}</p>
            <p>SA Id number: {selectedApplicationData.saIdNumber}</p>
            <p>SA Id aocument file: {selectedApplicationData.saIdDocumentFile}</p>
            <p>SA passport number: {selectedApplicationData.saPassportNumber}</p>
            <p>Foreign passport number: {selectedApplicationData.foreignPassportNumber}</p>
            <p>Foreign passport document file: {selectedApplicationData.foreignPassportDocumentFile}</p>
            <p>Drivers licence numbere: {selectedApplicationData.driversLicenceNumber}</p>
            <p>Drivers licence file: {selectedApplicationData.driversLicenceFile}</p>
          </div>
        );

        case "F":
        return (
          <div>
            <p>Transport Service Type: {selectedApplicationData.serviceType}</p>
          </div>
        );

        case "I":
          return (
            <div>
              <p>Telephone Code: {selectedApplicationData.telephoneCode}</p>
              <p>Telephone: {selectedApplicationData.telephone}</p>
              <p>Email Address: {selectedApplicationData.emailAddress}</p>
            </div>
          );

      case "L":
        return (
          <div>
            <p>Vehicle Type: {selectedApplicationData.vehicleType}</p>
            <p>Vehicle Make: {selectedApplicationData.vehicleMake}</p>
            <p>Vehicle Model: {selectedApplicationData.vehicleModel}</p>
            <p>Vehicle Year: {selectedApplicationData.vehicleYear}</p>
            <p>Vehicle VIN: {selectedApplicationData.vehicleVIN}</p>
            <p>Vehicle registration Number: {selectedApplicationData.vehicleRegistrationNumber}</p>
            <p>Vehicle Vehicle Ownership Document File: {selectedApplicationData.vehicleOwnershipDocumentFile}</p>
            <p>Vehicle License Disc File : {selectedApplicationData.vehicleLicenseDiscFile}</p>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Content for <strong>{sectionId}</strong> will be displayed here when data is provided.
            </p>
          </div>
        );
    }
  };
  //---------------------------------------------------------------------------------

  

  return (
    <>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Permits', href: '/applications' },
        { label: 'Review Permit' }
      ]} />
      <PageHeader
        title={`Review: ${applicationDetails.referenceNumber}`}
        description="Administrative panel for permit review and processing."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Permit Details */}
        <Card className="lg:w-1/3 lg:max-w-sm shadow-md sticky top-[calc(theme(spacing.16)_+_theme(spacing.6))] self-start max-h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12))]">
          <CardHeader>
            <CardTitle>Permit Details</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.24))]">
            <CardContent className="space-y-3 text-sm">
            {!applicationId && !loadingSelected && <p>Select an application from the list to view details.</p>}
            {applicationId && !selectedApplicationData && <p>Loading application details...</p>}
            {selectedApplicationData && selectedApplicationData.status=="Pending" && (
                <div className="space-y-4">
                  {/* Display fetched application data here */}
                  <div>
                  <p className="font-semibold text-foreground">Applicant Name:</p>
                  <p className="text-muted-foreground">{selectedApplicationData.fullName}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Permit Type:</p>
                  <p className="text-muted-foreground">{selectedApplicationData.applicationType}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Reference Number:</p>
                  <p className="text-muted-foreground">{selectedApplicationData.applicationIdDisplay}</p>
                </div>
                <div>
                <p className="font-semibold text-foreground">Submission Date:</p>
                {/*<p className="text-muted-foreground">
  {selectedApplicationData?.submittedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(selectedApplicationData.submittedAt.toDate())
    : "N/A"}
</p>*/}
                  </div>
                  <div>
                  <p className="font-semibold text-foreground">Status:</p>
                  <Badge variant={getStatusBadgeVariant(selectedApplicationData.status)}>
                    {selectedApplicationData.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Application Type:</p>
                  {/*<p className="text-muted-foreground">{selectedApplicationData.applicationType}</p>*/}
                </div>
                  {/* Add more fields as needed */}
                  {/* Example: Conditional display of amendment type */}
                  {/*selectedApplicationData.applicationType === 'amendment' && selectedApplicationData.amendmentType && (
                       <p><span className="font-semibold">Amendment Type:</span> {selectedApplicationData.amendmentType}</p>
                  )}
                   <p><span className="font-semibold">Service Type:</span> {selectedApplicationData.serviceType}</p>
                   <p><span className="font-semibold">Applying As:</span> {selectedApplicationData.applyingAs}</p>
                   {/* Add more fields based on your ApplicationFormData structure */}
                   {/* Example: Display uploaded documents (will require more complex rendering) */}
                   {/*
                   {selectedApplicationData.saIdDocumentFile && (
                       <p><span className="font-semibold">SA ID Document:</span> <a href={selectedApplicationData.saIdDocumentFile} target="_blank" rel="noopener noreferrer">View Document</a></p>
                   )}
                   */}
                </div>
              
              )}
              {/*------------------------------------------------------------------------*/}
              {/*<div>
                <p className="font-semibold text-foreground">Applicant Name:</p>
                <p className="text-muted-foreground">{applicationDetails.applicantName}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Permit Type:</p>
                <p className="text-muted-foreground">{applicationDetails.permitType}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Reference Number:</p>
                <p className="text-muted-foreground">{applicationDetails.referenceNumber}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Submission Date:</p>
                <p className="text-muted-foreground">{applicationDetails.submissionDate}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Status:</p>
                <Badge variant={getStatusBadgeVariant(applicationDetails.status)}>
                  {applicationDetails.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold text-foreground">Application Type:</p>
                <p className="text-muted-foreground">{applicationDetails.applicationSubType}</p>
              </div>*/}
              <Separator className="my-4" />
              <div>
                <Button className="w-full" variant="outline" onClick={() => router.push('/applications/docs')}>
                View all documents
                </Button>
              </div>
               <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-2" variant="outline">
                    <Icons.routeMap className="mr-2 h-4 w-4" />
                    View Route Map
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Route Mapping</DialogTitle>
                    <DialogDescription>
                      Visual representation of the proposed route.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-muted-foreground mb-2"><strong>Route Description:</strong></p>
                    <p>From Point A (e.g., Johannesburg CBD) via N1, M1 to Point B (e.g., Pretoria CBD), including stops at Midrand Gautrain Station and Centurion Mall.</p>
                    <div className="mt-4 h-64 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">(Map placeholder: Visual route would be displayed here)</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => {
                        const currentDialog = document.querySelector('[role="dialog"]');
                        if (currentDialog && currentDialog.parentElement) {
                            const closeButton = currentDialog.querySelector('button[aria-label="Close"]');
                            if(closeButton instanceof HTMLElement) closeButton.click();
                        }
                    }}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Right Main Content - Tabs & Actions */}
        <div className="flex-1 lg:w-2/3">
          <Tabs defaultValue="form-sections" className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-6">
              <TabsTrigger value="form-sections" className="text-sm px-3 py-2 h-auto data-[state=active]:shadow-md">
                <Icons.fileText className="mr-2 h-4 w-4" /> Permit Form Sections
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-sm px-3 py-2 h-auto data-[state=active]:shadow-md">
                <Icons.viewDocs className="mr-2 h-4 w-4" /> Documents
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-sm px-3 py-2 h-auto data-[state=active]:shadow-md">
                <Icons.messageSquare className="mr-2 h-4 w-4" /> Notes & Comms
              </TabsTrigger>
              <TabsTrigger value="final-actions" className="text-sm px-3 py-2 h-auto data-[state=active]:shadow-md">
                <Icons.clipboardCheck className="mr-2 h-4 w-4" /> Final Actions
              </TabsTrigger>
            </TabsList>

            {/*<TabsContent value="form-sections">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Permit Form Sections (FORM-1A)</CardTitle>
                  <CardDescription>Review the details provided in each section of the permit form.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={formSections[0].id} className="w-full">
                    <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:flex xl:flex-wrap gap-1 h-auto mb-4">
                      {formSections.map((section) => (
                        <TabsTrigger key={section.id} value={section.id} className="text-xs px-2 py-1.5 h-auto data-[state=active]:shadow-md">
                          [{section.id}] {section.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <Separator className="mb-4" />
                    <ScrollArea className="h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.72))] sm:h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.64))] md:h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.60))]"> {/* Adjusted scroll height more granularly /}
                      {formSections.map((section) => (
                        <TabsContent key={section.id} value={section.id} className="p-4 border rounded-md bg-background">
                          <h3 className="text-lg font-semibold mb-2">Section [{section.id}]: {section.title}</h3>
                          <p className="text-muted-foreground">
                            Content for {section.title} will be displayed here. This includes all relevant fields and information as per FORM-1A.
                            For now, this is a placeholder.
                          </p>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center">
                              <label htmlFor={`field-${section.id}-1`} className="w-1/3 text-sm font-medium">Mock Field 1:</label>
                              <input id={`field-${section.id}-1`} type="text" readOnly value="Sample Data" className="flex-1 p-2 border rounded-md bg-muted/50 text-sm" />
                            </div>
                            <div className="flex items-center">
                              <label htmlFor={`field-${section.id}-2`} className="w-1/3 text-sm font-medium">Mock Field 2:</label>
                              <input id={`field-${section.id}-2`} type="text" readOnly value="More Sample Data" className="flex-1 p-2 border rounded-md bg-muted/50 text-sm" />
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </ScrollArea>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>*/}
            <TabsContent value="form-sections">
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle>Permit Form Sections (FORM-1A)</CardTitle>
      <CardDescription>
        Review the details provided in each section of the permit form.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue={formSections[0].id} className="w-full">
        {/* Section Tabs Navigation */}
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:flex xl:flex-wrap gap-1 h-auto mb-4">
          {formSections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="text-xs px-2 py-1.5 h-auto data-[state=active]:shadow-md"
            >
              [{section.id}] {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <Separator className="mb-4" />

        {/* Section Content */}
        <ScrollArea className="h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.72))] sm:h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.64))] md:h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.60))]">
          {formSections.map((section) => (
            <TabsContent
              key={section.id}
              value={section.id}
              className="p-4 border rounded-md bg-background"
            >
              <h3 className="text-lg font-semibold mb-2">
                Section [{section.id}]: {section.title}
              </h3>

              {/* Load actual dynamic content */}
              {renderSectionContent(section.id)}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="documents">
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle>Attached Documents</CardTitle>
      <CardDescription>Manage and review all uploaded documents for this permit.</CardDescription>
    </CardHeader>

    <ScrollArea className="h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.48))]">
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.fileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Document Management Area</h3>
          <p className="text-muted-foreground mt-2">
            <a
              href="#"
              className="text-primary hover:underline"
              onClick={() => {
                router.push('/applications/docs')   
              }}
            >
              View
            </a>,  
            <a
              href="#"
              className="text-primary hover:underline"
              onClick={() => {
                router.push('/applications/docspdf')   
              }}
            >
              download
            </a>
            , or request additional documents here. <br />
            (Functionality to be implemented)
          </p>
          <Button variant="outline" className="mt-6">
            <Icons.plus className="mr-2 h-4 w-4" /> Add Document (Placeholder)
          </Button>
        </div>
      </CardContent>
    </ScrollArea>
  </Card>
</TabsContent>

            {/*<TabsContent value="documents">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Attached Documents</CardTitle>
                  <CardDescription>Manage and review all uploaded documents for this permit.</CardDescription>
                </CardHeader>
                <ScrollArea className="h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.48))]"> {/* Adjusted scroll height /}
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icons.fileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-foreground">Document Management Area</h3>
                      <p className="text-muted-foreground mt-2">
                        View, download, or request additional documents here. <br />
                        (Functionality to be implemented)
                      </p>
                      <Button variant="outline" className="mt-6">
                        <Icons.plus className="mr-2 h-4 w-4" /> Add Document (Placeholder)
                      </Button>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </TabsContent>*/}

            <TabsContent value="notes">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Internal Notes & Communication Log</CardTitle>
                  <CardDescription>Record notes and track communications related to this permit.</CardDescription>
                </CardHeader>
                <ScrollArea className="h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.12)_-_theme(spacing.48))]"> {/* Adjusted scroll height */}
                  <CardContent>
                     <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Icons.messageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-foreground">Notes & Communication Center</h3>
                        <p className="text-muted-foreground mt-2">
                          Add internal notes, log calls, or track email correspondence. <br />
                          (Functionality to be implemented)
                        </p>
                        <Button variant="outline" className="mt-6">
                            <Icons.plusCircle className="mr-2 h-4 w-4" /> Add Note (Placeholder)
                        </Button>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </TabsContent>
            {/* Final Actions Tab Content */}
            <TabsContent value="final-actions">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Decision & Actions</CardTitle>
                  <CardDescription>Make a final decision on the permit or request further actions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 items-center">
                  {/* Approve Button */}
                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusUpdate('Approved')} // Call handler on click
                        disabled={isUpdatingStatus}>
                  <Icons.approveApplication className="mr-2 h-4 w-4" /> Approve Permit
                </Button>
                {/* Reject Button */}
                <Button variant="destructive"
                        onClick={() => handleStatusUpdate('Rejected')} // Call handler on click
                        disabled={isUpdatingStatus}>
                  <Icons.rejectApplication className="mr-2 h-4 w-4" /> Reject with Reason
                </Button>
                {/* Request More Info Button */}
                <Button variant="outline" onClick={() => handleStatusUpdate('Requires Info')} disabled={isUpdatingStatus}>
                  <Icons.requestMoreInfo className="mr-2 h-4 w-4" /> Request More Info
                </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

    

