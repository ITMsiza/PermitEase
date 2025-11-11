"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";
import { useToast } from '@/hooks/use-toast'; // Assuming useToast for error notifications


type ApplicationStatus = "Pending" | "Approved" | "Rejected";

type Application = {
  id: string;
  fullName: string;
  vehicleType: string;
  status: ApplicationStatus;
  amount: number;
  submittedAt: string;
};

type VehicleTypesFilter = {
  vehicleType: string;
};

const vehicleTypesFilter: VehicleTypesFilter[] = [
  { vehicleType: 'Sedan' },
  { vehicleType: 'Minibus' },
  { vehicleType: 'Shuttle' },
  { vehicleType: 'Truck' },
  { vehicleType: 'Bus' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
};

const getStatusBadgeVariant = (status: ApplicationStatus): BadgeProps["variant"] => {
  switch (status) {
    case "Approved":
      return "success";
    case "Pending":
      return "warning";
    case "Rejected":
      return "destructive";
    default:
      return "outline";
  }
};

const vehicleTypes = Array.from(new Set(vehicleTypesFilter.map(app => app.vehicleType))).sort();


export default function PermitsPage() {
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

  const { toast } = useToast(); // Get toast function


  const filteredApplications = applications.filter(app => {
    if (vehicleTypeFilter === "all") return true;
    return app.vehicleType === vehicleTypeFilter;
  });

  // Effect to fetch recent applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoadingApplications(true);
      try {
        const response = await fetch('/api/get-all-applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data: Application[] = await response.json();

        setApplications(data);
      } catch (error) {
        console.error("Error fetching recent applications:", error);
        toast({
          title: "Error",
          description: "Failed to load recent applications.",
          variant: "destructive",
        });
        setApplications([]); // Clear data on error
      } finally {
        setIsLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [toast]); // Depend on toast to avoid lint warnings, though it's unlikely to change

  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Permits' }]} />
      <PageHeader
        title="Permits"
        description="Manage and track all permits."
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icons.filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-4 space-y-2">
                <div>
                  <Label htmlFor="vehicle-type-filter" className="text-sm font-medium">Vehicle Type</Label>
                  <Select
                    value={vehicleTypeFilter}
                    onValueChange={setVehicleTypeFilter}
                  >
                    <SelectTrigger id="vehicle-type-filter" className="mt-1 h-9">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" asChild>
              <Link href="/applications/new">
                <Icons.plus className="mr-2 h-4 w-4" />
                New
              </Link>
            </Button>
          </>
        }
      />
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.id}</TableCell>
                <TableCell>{app.fullName}</TableCell>
                <TableCell>{app.vehicleType}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(app.amount)}</TableCell>
                <TableCell>{app.submittedAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/applications/review?id=${app.id}`}>
                          <Icons.eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icons.edit className="mr-2 h-4 w-4" /> Edit Application
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Icons.trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredApplications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 flex justify-end items-center space-x-2">
        <Button variant="outline" size="sm">Previous</Button>
        <span className="text-sm text-muted-foreground">Page 1 of 10</span> {/* This pagination is static */}
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </>
  );
}

