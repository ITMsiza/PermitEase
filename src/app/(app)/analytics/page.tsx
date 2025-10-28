
"use client";

import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]} />
      <PageHeader
        title="Analytics"
        description="Generate and view various system analytics and reports."
        actions={
          <Button>
            <Icons.fileDown className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.barChart3 className="mr-2 h-5 w-5" /> {/* Changed Icon */}
            Analytics Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow users to generate, view, and export various analytics related to applications, permits, revenue, and system activity.
            Customizable report templates and scheduling options will be available.
          </p>
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Icons.barChart3 className="h-16 w-16 mr-4" />
            <p className="text-lg">Advanced analytical tools are under development.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
