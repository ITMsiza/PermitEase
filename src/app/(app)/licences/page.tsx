
"use client";

import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function LicencesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Licences' }]} />
      <PageHeader
        title="Licences"
        description="Manage issued licences and their statuses."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.permits className="mr-2 h-5 w-5" /> {/* Using existing Briefcase icon */}
            Licences Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will contain tools and tables for managing processed licences.
            Features like viewing licence details, renewal tracking, and status updates will be available here.
            You can navigate to specific views for Active, In Progress, or Suspended licences using the sidebar.
          </p>
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Icons.workflow className="h-16 w-16 mr-4" />
            <p className="text-lg">Licence management features coming soon!</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
