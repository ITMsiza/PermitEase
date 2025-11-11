'use client';

import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react"; // Example of using state

type PermitDetails = {
    id: string;
    applicantName: string;
    vehicleType: string;
    status: string;
    expiryDate: string;
    renewalFee: string;
  };

export default function PermitRenewalPage() {
  const [permitId, setPermitId] = useState('');
  const [permitDetails, setPermitDetails] = useState<PermitDetails | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const handleSearch = async () => {
    if (!permitId) {
      setError("Please enter a Permit ID.");
      setPermitDetails(null);
      return;
    }

    setLoading(true);
    setError(null);
    setPermitDetails(null); // Clear previous details

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const dummyDetails = {
        id: permitId,
        applicantName: "Johannes van der Merwe", // Example data from blueprint
        vehicleType: "Sedan",
        status: "Expiring",
        expiryDate: "31 Dec 2023",
        renewalFee: "R 1, 600.00 ZAR", // Example fee
        
      };
      setPermitDetails(dummyDetails);


    } catch (err: unknown) { // Keep err as unknown for initial safety
        setError((err as Error).message || "An error occurred while fetching permit details.");
      } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!permitDetails) {
      setError("No permit details to renew.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Permit ${permitDetails.id} renewed successfully (simulated)!`);
      setPermitDetails(null); // Clear details after renewal

    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred during renewal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Permits', href: '/permits' }, { label: 'Renewal' }]} />
      <PageHeader
        title="Permit Renewal"
        description="Manage permit renewal processes."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.repeat className="mr-2 h-5 w-5" />
            Permit Renewal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-end space-x-4">
            <div className="grid gap-2 flex-grow">
              <Label htmlFor="permitId">Permit ID</Label>
              <Input
                id="permitId"
                placeholder="Enter Permit ID (e.g., APP-2023-001)"
                value={permitId}
                onChange={(e) => setPermitId(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {permitDetails && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="text-lg font-semibold">Permit Details:</h3>
              <p><strong>Permit ID:</strong> {permitDetails.id}</p>
              <p><strong>Applicant Name:</strong> {permitDetails.applicantName}</p>
              <p><strong>Vehicle Type:</strong> {permitDetails.vehicleType}</p>
              <p><strong>Status:</strong> {permitDetails.status}</p>
              <p><strong>Expiry Date:</strong> {permitDetails.expiryDate}</p>
             
              {/* Example of conditional rendering for renewal button */}
              {permitDetails.status !== 'Approved' && permitDetails.status !== 'Rejected' && ( // Add conditions for when renewal is allowed
                 <div className="pt-4">
                   <Button onClick={handleRenew} disabled={loading}>
                     {loading ? 'Renewing...' : `Renew Permit (Fee: ${permitDetails.renewalFee})`}
                   </Button>
                 </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </>
  );
}
