"use client";

import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function SystemAdministrationPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'System Administration' }]} />
      <PageHeader
        title="System Administration"
        description="Manage core system settings, user roles, and audit logs."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.systemAdministration className="mr-2 h-5 w-5" />
            Admin Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area is for administrators to manage system-level configurations, including user roles and permissions, audit trails, system health monitoring, and other critical administrative tasks.
          </p>
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Icons.shieldCheck className="h-16 w-16 mr-4" />
            <p className="text-lg">System administration tools are currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
