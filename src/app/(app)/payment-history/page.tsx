"use client";

import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function PaymentHistoryPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Payment History' }]} />
      <PageHeader
        title="Payment History"
        description="View and track all financial transactions."
         actions={
          <Button variant="outline">
            <Icons.fileDown className="mr-2 h-4 w-4" />
            Export History
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.paymentHistory className="mr-2 h-5 w-5" />
            Transaction Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will display a comprehensive history of all payments made for permits.
            Features will include filtering by date, applicant, status, and exporting transaction data.
          </p>
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Icons.creditCard className="h-16 w-16 mr-4" />
            <p className="text-lg">Payment tracking features are being implemented.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
