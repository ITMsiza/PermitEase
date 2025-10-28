
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from '@/components/icons';

const amendmentOptions = [
    { value: "3a", label: "3a) Amendment - Additional authority" },
    { value: "3b", label: "3b) Amendment - Amendment of route or area" },
    { value: "3c", label: "3c) Amendment - Change of particulars" },
    { value: "3e", label: "3e) Amendment - Amendment of timetables, tariffs or other conditions" },
    { value: "3f", label: "3f) Amendment - Replace existing vehicle" },
    { value: "3g", label: "3g) Amendment - OL for recapitalized vehicle" },
];

export default function AmendmentPage() {
  const router = useRouter();
  const [amendmentType, setAmendmentType] = useState('');
  const [justification, setJustification] = useState('');

  const handleCancel = () => {
    router.push('/dashboard');
  };

  /*const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle submission logic here
    console.log({ amendmentType, justification });
  };*/

  //----------
  // Add a function to handle form submission
const handleSubmitAmendment = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevent default form submission

  if (!amendmentType || !justification) {
      // Basic client-side validation
      alert("Please select an amendment type and provide a justification.");
      return;
  }

  // You'll need the applicationId here. Where does it come from?
  // It might be passed as a URL parameter, or fetched based on the current context.
  const applicationId = "PW-7971-15"; // Replace with actual logic to get the ID

  try {
      const response = await fetch('/api/submit-amendment', { // Call your new API route
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // Include authorization if needed
          },
          body: JSON.stringify({
              applicationId: applicationId,
              amendmentType: amendmentType,
              justification: justification,
              // Include any other data relevant to the specific amendment type
              // e.g., newAddress: addressState
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit amendment.');
      }

      const result = await response.json();
      console.log("Amendment submission successful:", result);

      // Show a success message to the user (similar to your review page toast)
      // toast({
      //     title: "Success",
      //     description: "Amendment submitted successfully.",
      // });

      // Optionally, redirect the user after successful submission
      // router.push(`/applications/${applicationId}`); // Or wherever appropriate

  } catch (error: any) {
      console.error("Error submitting amendment:", error);
      // Show an error message to the user
      // toast({
      //     title: "Error",
      //     description: error.message || "An error occurred while submitting the amendment.",
      //     variant: "destructive",
      // });
  }
};
  //-----------

  const breadcrumbItems = [
    { label: 'Permits', href: '/applications' },
    { label: 'Amendment' }
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      <Card>
        <CardHeader>
          <CardTitle>Permit Amendment</CardTitle>
          <CardDescription>Select the type of amendment and provide a justification.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitAmendment}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amendmentType" className="text-base font-semibold">Amendment Type <span className="text-destructive">*</span></Label>
              <Select
                  value={amendmentType}
                  onValueChange={setAmendmentType}
              >
                  <SelectTrigger id="amendmentType">
                      <SelectValue placeholder="-- Select from the list --" />
                  </SelectTrigger>
                  <SelectContent>
                      {amendmentOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="justification" className="text-base font-semibold">Justification <span className="text-destructive">*</span></Label>
                <Textarea
                    id="justification"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Provide a detailed justification for the amendment..."
                    rows={5}
                />
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={!amendmentType || !justification}>
                <Icons.check className="mr-2 h-4 w-4" />
                Submit Amendment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
