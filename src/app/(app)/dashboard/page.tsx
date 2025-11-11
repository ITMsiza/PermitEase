
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, PieChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast for error notifications

const fullProvincialRevenueData = [
  { month: "Jan", GP: 70000, WC: 40000, KZN: 25000, EC: 18000, LP: 10000, MP: 12000, NW: 15000, FS: 9000, NC: 7000 },
  { month: "Feb", GP: 75000, WC: 45000, KZN: 30000, EC: 20000, LP: 12000, MP: 15000, NW: 17000, FS: 10000, NC: 8000 },
  { month: "Mar", GP: 72000, WC: 42000, KZN: 28000, EC: 19000, LP: 11000, MP: 14000, NW: 16000, FS: 9500, NC: 7500 },
  { month: "Apr", GP: 78000, WC: 48000, KZN: 32000, EC: 22000, LP: 13000, MP: 16000, NW: 18000, FS: 11000, NC: 8500 },
  { month: "May", GP: 85000, WC: 50000, KZN: 35000, EC: 25000, LP: 15000, MP: 18000, NW: 20000, FS: 12000, NC: 9000 },
  { month: "Jun", GP: 90000, WC: 55000, KZN: 38000, EC: 28000, LP: 16000, MP: 20000, NW: 22000, FS: 13000, NC: 10000 },
  { month: "Jul", GP: 92000, WC: 57000, KZN: 39000, EC: 29000, LP: 17000, MP: 21000, NW: 23000, FS: 14000, NC: 11000 },
  { month: "Aug", GP: 88000, WC: 53000, KZN: 37000, EC: 27000, LP: 15000, MP: 19000, NW: 21000, FS: 13500, NC: 10500 },
  { month: "Sep", GP: 95000, WC: 60000, KZN: 40000, EC: 30000, LP: 18000, MP: 22000, NW: 24000, FS: 15000, NC: 12000 },
  { month: "Oct", GP: 98000, WC: 62000, KZN: 42000, EC: 31000, LP: 19000, MP: 23000, NW: 25000, FS: 16000, NC: 12500 },
  { month: "Nov", GP: 100000, WC: 65000, KZN: 45000, EC: 33000, LP: 20000, MP: 25000, NW: 27000, FS: 17000, NC: 13000 },
  { month: "Dec", GP: 105000, WC: 68000, KZN: 47000, EC: 35000, LP: 22000, MP: 27000, NW: 29000, FS: 18000, NC: 14000 },
];

type ApplicationStatus = "Pending" | "Approved" | "Rejected";

const chartConfig = {
  approved: { label: "Approved", color: "hsl(var(--status-approved))" },
  pending: { label: "Pending", color: "hsl(var(--status-pending))" },
  rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
  GP: { label: "GP", color: "hsl(var(--chart-1))" },
  WC: { label: "WC", color: "hsl(var(--chart-2))" },
  KZN: { label: "KZN", color: "hsl(var(--chart-3))" },
  EC: { label: "EC", color: "hsl(var(--chart-4))" },
  LP: { label: "LP", color: "hsl(var(--chart-5))" },
  MP: { label: "MP", color: "hsl(var(--chart-1))" },
  NW: { label: "NW", color: "hsl(var(--chart-2))" },
  FS: { label: "FS", color: "hsl(var(--chart-3))" },
  NC: { label: "NC", color: "hsl(var(--chart-4))" },
  eHailers: { label: "E-hailiers", color: "hsl(var(--chart-1))" },
  minibusType: { label: "Minibus", color: "hsl(var(--chart-2))" },
  shuttleType: { label: "Shuttle", color: "hsl(var(--chart-3))" },
  tourism: { label: "Tourism", color: "hsl(var(--chart-5))" },
  appStatusApproved: { label: "Approved", color: "hsl(var(--status-approved))" },
  appStatusPending: { label: "Pending", color: "hsl(var(--status-pending))" },
  appStatusRejected: { label: "Rejected", color: "hsl(var(--destructive))" },
};

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

const timeFilterOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "6-monthly", label: "6-Monthly" },
  { value: "yearly", label: "Yearly" },
];

const mockNotifications = [
  { id: 1, text: "New application #APP-2025-006 from S. Dlamini needs review.", icon: Icons.bell, time: "2m ago", actionLabel: "Review", actionHref: "/applications/review?id=APP-2025-006" },
  { id: 2, text: "Route for #APP-2025-001 (J. van der Merwe) flagged for congestion.", icon: Icons.route, time: "1h ago", actionLabel: "View", actionHref: "/applications/review?id=APP-2025-001&tab=G" },
  { id: 3, text: "Payment received for #APP-2024-103.", icon: Icons.creditCard, time: "3h ago", actionLabel: "View", actionHref: "/payment-history?transactionId=PAY-2024-103" },
];

const mockSuggestedInsights = [
  { text: "Consider reviewing processing times for Minibus applications, they are trending higher.", actionLabel: "Analyze with AI", actionType: "ai_analyze_minibus_processing_time" },
  { text: "Weekend application submissions have increased by 10%.", actionLabel: "View Report", actionHref: "/analytics?type=weekend_submissions" },
  { text: "High rejection rate in GP province, investigate common reasons.", actionLabel: "Investigate with AI", actionType: "ai_investigate_gp_rejections" },
];

// Define the structure of your KPI data
interface KpiData {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: React.ElementType; // Type for icon component
  iconClassName: string;
  baseValue: number; // You might still use this for calculations/charts
}

// Define the structure of the data you expect from your backend API
interface FetchedKpiData {
  id: string;
  title: string;
  value: string | number; // Backend might send number or formatted string
  description: string;
  baseValue: number;
  // Note: Icon information is often managed on the frontend based on id
}

type RecentApplication = {
  id: string;
  fullName: string;
  vehicleType: string;
  applicationType: string;
  applicationSubType: string;
  status: ApplicationStatus;
  amount: number;
};

type ProvinceStatus = {
  province: string;
  approved: number;
  pending: number;
  rejected: number;
};

type ApplicationTypeData = {
  name: string;
  value: number;
  fill: string;
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("monthly"); // State for selected time filter
  const [currentProvincialRevenueData, setCurrentProvincialRevenueData] = useState(fullProvincialRevenueData.slice(0, 6));
  const [kpiData, setKpiData] = useState<KpiData[]>([]); // Initialize with an empty array
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [isLoadingRecentApplications, setIsLoadingRecentApplications] = useState(true);
  const [provincialApplicationStatusData, setProvincialApplicationStatusData] = useState<ProvinceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationTypeData, setApplicationTypeData] = useState<ApplicationTypeData[]>([]);


  const { toast } = useToast(); // Get toast function

  useEffect(() => {
    const fetchKpiData = async () => {

      try {

        // Fetch data from your backend API endpoint
        const response = await fetch("/api/kpis"); // Assuming your API is at /api/kpis
        if (!response.ok) {
          throw new Error('Failed to fetch KPI data');
        }

        const data: FetchedKpiData[] = await response.json(); // Assuming backend returns an array of KPI objects

        // Map the fetched data to your frontend KpiData structure
        const updatedKpiData: KpiData[] = data.map(fetchedKpi => {
          // Find the corresponding initial config to get icon and className
          const initialConfig = kpiData.find(config => config.id === fetchedKpi.id);

          return {
            id: fetchedKpi.id,
            title: fetchedKpi.title,
            value: String(fetchedKpi.value), // Ensure value is a string for display
            description: fetchedKpi.description,
            icon: initialConfig?.icon || Icons.file, // Use icon from initial config or a default
            iconClassName: initialConfig?.iconClassName || '', // Use className from initial config
            baseValue: fetchedKpi.baseValue,
          };
        });


        setKpiData(updatedKpiData); // Update kpiData state with fetched data 

      } catch (error) {
        console.error("Error fetching KPI data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
        setKpiData([]); // Clear data or set to initial on error
      } finally {
        setIsLoadingKpis(false);
      }
    };

    fetchKpiData();

    // *** Add event listener for application submission ***
    window.addEventListener('applicationSubmitted', fetchKpiData);

    // *** Clean up the event listener on component unmount ***
    return () => {
      window.removeEventListener('applicationSubmitted', fetchKpiData);
    };
  }, []); // Fetch data when the component mounts or timeFilter changes

  useEffect(() => {
    // Fetch API once on mount
    const fetchApplicationTypeData = async () => {
      try {
        const res = await fetch("/api/application-type-summary");
        const json = await res.json();

        if (json.success) {
          setApplicationTypeData(json.data);
        } else {
          setError(json.error || "Failed to fetch data");
        }
      } catch (err: any) {
        console.error("Error fetching application type data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationTypeData();
  }, []); // empty dependency array → runs only once

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const res = await fetch("/api/status-summary");
        if (!res.ok) throw new Error("Failed to fetch status data");

        const result = await res.json();
        setProvincialApplicationStatusData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []); // runs once on mount

  // Effect to fetch KPI data from the backend
  useEffect(() => {
    const fetchKpiData = async () => {
      setIsLoadingKpis(true);

      try {
        const queryParams = new URLSearchParams();
        if (selectedTimeFilter && selectedTimeFilter !== 'all') { // Only add if a filter is selected and not 'all'
          queryParams.append('timeFilter', selectedTimeFilter);
        }
        // Fetch data from your backend API endpoint
        const response = await fetch(`/api/kpis?${queryParams.toString()}`); // Assuming your API is at /api/kpis
        if (!response.ok) {
          throw new Error('Failed to fetch KPI data');
        }

        const data: FetchedKpiData[] = await response.json(); // Assuming backend returns an array of KPI objects

        // Map the fetched data to your frontend KpiData structure
        const updatedKpiData: KpiData[] = data.map(fetchedKpi => {
          // Find the corresponding initial config to get icon and className
          const initialConfig = kpiData.find(config => config.id === fetchedKpi.id);

          return {
            id: fetchedKpi.id,
            title: fetchedKpi.title,
            value: String(fetchedKpi.value), // Ensure value is a string for display
            description: fetchedKpi.description,
            icon: initialConfig?.icon || Icons.file, // Use icon from initial config or a default
            iconClassName: initialConfig?.iconClassName || '', // Use className from initial config
            baseValue: fetchedKpi.baseValue,
          };
        });


        setKpiData(updatedKpiData); // Update kpiData state with fetched data 

      } catch (error) {
        console.error("Error fetching KPI data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
        setKpiData([]); // Clear data or set to initial on error
      } finally {
        setIsLoadingKpis(false);
      }
    };

    fetchKpiData();

    // *** Add event listener for application submission ***
    window.addEventListener('applicationSubmitted', fetchKpiData);

    // *** Clean up the event listener on component unmount ***
    return () => {
      window.removeEventListener('applicationSubmitted', fetchKpiData);
    };
  }, [selectedTimeFilter]); // Fetch data when the component mounts or timeFilter changes

  // Effect to fetch recent applications from the backend
  useEffect(() => {
    const fetchRecentApplications = async () => {
      setIsLoadingRecentApplications(true);
      try {
        const response = await fetch('/api/get-recent-applications');
        if (!response.ok) {
          throw new Error('Failed to fetch recent applications');
        }
        const data: RecentApplication[] = await response.json();
        console.log();
        setRecentApplications(data);
      } catch (error) {
        console.error("Error fetching recent applications:", error);
        toast({
          title: "Error",
          description: "Failed to load recent applications.",
          variant: "destructive",
        });
        setRecentApplications([]); // Clear data on error
      } finally {
        setIsLoadingRecentApplications(false);
      }
    };

    fetchRecentApplications();
  }, [toast]); // Depend on toast to avoid lint warnings, though it's unlikely to change

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    setFormattedDate(now.toLocaleDateString('en-ZA', { dateStyle: 'full' }));
    setFormattedTime(now.toLocaleTimeString('en-ZA', { timeStyle: 'short' }));

    let filteredRevenueData = [...fullProvincialRevenueData];
    let revenueDescription = "";
    let revenueValue = kpiData.find(k => k.id === "totalRevenue")?.baseValue || 5200000;
    let pendingApps = kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45;
    let approvedPermits = kpiData.find(k => k.id === "approvedPermits")?.baseValue || 128;
    let rejectedApps = kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12;

    let pendingDesc = "", approvedDesc = "", rejectedDesc = "";

    const getRandomChange = (base: number, factor: number) => Math.floor(base * (1 + (Math.random() - 0.5) * factor));
    const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change}`;

    switch (selectedTimeFilter) {
      case "weekly":
        filteredRevenueData = fullProvincialRevenueData.slice(0, 1);
        revenueValue = getRandomChange(revenueValue, 0.02);
        revenueDescription = `${formatChange(Math.round(((revenueValue / (kpiData.find(k => k.id === "totalRevenue")?.baseValue || revenueValue)) - 1) * 100))}% from last week`;
        pendingApps = getRandomChange(pendingApps, 0.1);
        pendingDesc = `${formatChange(pendingApps - (kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45))} since last week`;
        approvedPermits = getRandomChange(approvedPermits, 0.05);
        approvedDesc = `Target: ${getRandomChange(200, 0.05)}`;
        rejectedApps = getRandomChange(rejectedApps, 0.15);
        rejectedDesc = `${formatChange(rejectedApps - (kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12))} from last week`;
        break;
      case "bi-weekly":
        filteredRevenueData = fullProvincialRevenueData.slice(0, 2);
        revenueValue = getRandomChange(revenueValue, 0.03);
        revenueDescription = `${formatChange(Math.round(((revenueValue / (kpiData.find(k => k.id === "totalRevenue")?.baseValue || revenueValue)) - 1) * 100))}% from last bi-week`;
        pendingApps = getRandomChange(pendingApps, 0.15);
        pendingDesc = `${formatChange(pendingApps - (kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45))} since last bi-week`;
        approvedPermits = getRandomChange(approvedPermits, 0.07);
        approvedDesc = `Target: ${getRandomChange(200, 0.07)}`;
        rejectedApps = getRandomChange(rejectedApps, 0.1);
        rejectedDesc = `${formatChange(rejectedApps - (kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12))} from last bi-week`;
        break;
      case "monthly":
        filteredRevenueData = fullProvincialRevenueData.slice(0, 6);
        revenueValue = getRandomChange(revenueValue, 0.15);
        revenueDescription = `${formatChange(Math.round(((revenueValue / (kpiData.find(k => k.id === "totalRevenue")?.baseValue || revenueValue)) - 1) * 100))}% from last month`;
        pendingApps = getRandomChange(pendingApps, 0.05);
        pendingDesc = `${formatChange(pendingApps - (kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45))} since last month`;
        approvedPermits = getRandomChange(approvedPermits, 0.1);
        approvedDesc = `Target: ${getRandomChange(200, 0.1)}`;
        rejectedApps = getRandomChange(rejectedApps, 0.05);
        rejectedDesc = `${formatChange(rejectedApps - (kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12))} from last month`;
        break;
      case "quarterly":
        filteredRevenueData = fullProvincialRevenueData.slice(0, 3);
        revenueValue = getRandomChange(revenueValue, 0.10);
        revenueDescription = `${formatChange(Math.round(((revenueValue / (kpiData.find(k => k.id === "totalRevenue")?.baseValue || revenueValue)) - 1) * 100))}% from last quarter`;
        pendingApps = getRandomChange(pendingApps, 0.2);
        pendingDesc = `${formatChange(pendingApps - (kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45))} since last quarter`;
        approvedPermits = getRandomChange(approvedPermits, 0.15);
        approvedDesc = `Target: ${getRandomChange(200, 0.15)}`;
        rejectedApps = getRandomChange(rejectedApps, 0.08);
        rejectedDesc = `${formatChange(rejectedApps - (kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12))} from last quarter`;
        break;
      case "6-monthly":
        filteredRevenueData = fullProvincialRevenueData.slice(0, 6);
        revenueValue = getRandomChange(revenueValue, 0.20);
        revenueDescription = `${formatChange(Math.round(((revenueValue / (kpiData.find(k => k.id === "totalRevenue")?.baseValue || revenueValue)) - 1) * 100))}% from last 6 months`;
        pendingApps = getRandomChange(pendingApps, 0.25);
        pendingDesc = `${formatChange(pendingApps - (kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45))} for last 6 months`;
        approvedPermits = getRandomChange(approvedPermits, 0.18);
        approvedDesc = `Target: ${getRandomChange(200, 0.18)}`;
        rejectedApps = getRandomChange(rejectedApps, 0.03);
        rejectedDesc = `${formatChange(rejectedApps - (kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12))} for last 6 months`;
        break;
      case "yearly":
      default:
        filteredRevenueData = fullProvincialRevenueData.slice(0, 12);
        revenueValue = getRandomChange(revenueValue, 0.25);
        revenueDescription = `${formatChange(Math.round(((revenueValue / (kpiData.find(k => k.id === "totalRevenue")?.baseValue || revenueValue)) - 1) * 100))}% from last year`;
        pendingApps = getRandomChange(pendingApps, 0.3);
        pendingDesc = `${formatChange(pendingApps - (kpiData.find(k => k.id === "pendingApplications")?.baseValue || 45))} from last year`;
        approvedPermits = getRandomChange(approvedPermits, 0.22);
        approvedDesc = `Target: ${getRandomChange(200, 0.22)}`;
        rejectedApps = getRandomChange(rejectedApps, 0.01);
        rejectedDesc = `${formatChange(rejectedApps - (kpiData.find(k => k.id === "rejectedApplications")?.baseValue || 12))} from last year`;
        break;
    }
    setCurrentProvincialRevenueData(filteredRevenueData);

    setKpiData(prevKpiData => prevKpiData.map(kpi => {
      if (kpi.id === "totalRevenue") return { ...kpi, value: `R ${(revenueValue / 1000000).toFixed(1)}Mil`, description: revenueDescription };
      if (kpi.id === "pendingApplications") return { ...kpi, value: pendingApps.toString(), description: pendingDesc };
      if (kpi.id === "approvedPermits") return { ...kpi, value: approvedPermits.toString(), description: approvedDesc };
      if (kpi.id === "rejectedApplications") return { ...kpi, value: rejectedApps.toString(), description: rejectedDesc };
      return kpi;
    }));

  }, [selectedTimeFilter]); // This useEffect seems to be for local data generation, not fetching from API. It should remain distinct from the KPI fetch useEffect.

  const handleAiActionClick = (actionType: string) => {
    alert(`AI Action Triggered: ${actionType}`);
  };

  const handleChartAction = (action: string, chartName: string) => {
    alert(`Chart Action: '${action}' for '${chartName}' is conceptual.`);
  };


  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <PageHeader
        title={greeting ? `${greeting}, Isaac!` : "Welcome, Isaac!"}
        description={`${formattedDate} at ${formattedTime}. Here's your operational overview.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedTimeFilter} onValueChange={setSelectedTimeFilter}> {/* Use selectedTimeFilter state */}
              <SelectTrigger className="w-auto h-9 text-sm" aria-label="Select time period for dashboard data">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {timeFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" asChild>
              <Link href="/applications/new">New</Link>
            </Button>
            <Button variant="outline" size="sm">
              <Icons.fileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* ... (greeting, date, time, filters - if any) ... */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {isLoadingKpis ? (
          // Show skeleton loaders while loading
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map(kpi => (
              <Card key={kpi.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kpi.title}
                  </CardTitle>
                  {/* You can add a loading spinner here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Fetching...</div>
                  <p className="text-xs text-muted-foreground">
                    Loading...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        ) : (
          // Render fetched KPI data
          kpiData.map(kpi => (
            <Card key={kpi.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.iconClassName}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Application Status by Province</CardTitle>
              <CardDescription>Breakdown of application statuses per province.</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Chart Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleChartAction('View as Table', 'Application Status by Province')}>View as Table</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartAction('Toggle Data Labels', 'Application Status by Province')}>Toggle Data Labels</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartAction('Export Chart Image', 'Application Status by Province')}>Export Chart Image</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={provincialApplicationStatusData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="province" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="approved" stackId="a" fill="var(--color-approved)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="rejected" stackId="a" fill="var(--color-rejected)" radius={[0, 0, 0, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Provincial Revenue Trend</CardTitle>
              <CardDescription>Revenue trend by province.</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Chart Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleChartAction('View as Table', 'Provincial Revenue Trend')}>View as Table</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartAction('Toggle Data Labels', 'Provincial Revenue Trend')}>Toggle Data Labels</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartAction('Export Chart Image', 'Provincial Revenue Trend')}>Export Chart Image</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={currentProvincialRevenueData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `R${value / 1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="GP" stackId="a" fill="var(--color-GP)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="WC" stackId="a" fill="var(--color-WC)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="KZN" stackId="a" fill="var(--color-KZN)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="EC" stackId="a" fill="var(--color-EC)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="LP" stackId="a" fill="var(--color-LP)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="MP" stackId="a" fill="var(--color-MP)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="NW" stackId="a" fill="var(--color-NW)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="FS" stackId="a" fill="var(--color-FS)" radius={[0, 0, 0, 0]} barSize={10} />
                <Bar dataKey="NC" stackId="a" fill="var(--color-NC)" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Application Type Distribution</CardTitle>
              <CardDescription>Distribution of applications by type.</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Chart Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleChartAction('View as Table', 'Application Type Distribution')}>View as Table</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartAction('Toggle Data Labels', 'Application Type Distribution')}>Toggle Data Labels</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleChartAction('Export Chart Image', 'Application Type Distribution')}>Export Chart Image</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-square">
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={applicationTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {applicationTypeData.map((entry, index) => (
                    <Cell key={`cell-app-type-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icons.lightbulb className="mr-2 h-5 w-5 text-[hsl(var(--chart-4))]" />
              Insights &amp; Actions
            </CardTitle>
            <CardDescription>Notifications, system suggestions, and AI-powered actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-1.5">Notifications</h4>
              <ul className="space-y-3">
                {mockNotifications.map(notif => (
                  <li key={notif.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-start space-x-2 flex-1">
                      <notif.icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-foreground">{notif.text}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {notif.actionLabel && notif.actionHref && (
                        <Button variant="outline" size="sm" asChild className="h-7 text-xs px-2 self-start">
                          <Link href={notif.actionHref}>
                            {notif.actionLabel}
                            <Icons.arrowRight className="ml-1.5 h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                      {notif.actionHref && notif.actionHref.includes('/applications/review') && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2 self-start ml-2"
                          onClick={() => handleAiActionClick(`ai_call_applicant_review_${notif.id}`)}
                        >
                          <Icons.sparkles className="mr-1 h-3 w-3 text-accent" />
                          Call with AI
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-foreground mb-1.5">Suggested Insights</h4>
              <ul className="space-y-3">
                {mockSuggestedInsights.map((insight, index) => (
                  <li key={index} className="flex items-center justify-between space-x-2">
                    <div className="flex items-start space-x-2 flex-1">
                      <Icons.sparkles className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                      <p className="text-muted-foreground flex-1">{insight.text}</p>
                    </div>
                    {insight.actionLabel && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2 self-start"
                        onClick={() => insight.actionType ? handleAiActionClick(insight.actionType) : (insight.actionHref ? window.open(insight.actionHref, '_blank') : undefined)}
                      >
                        {insight.actionLabel}
                        {insight.actionType && <Icons.sparkles className="ml-1.5 h-3 w-3 text-accent" />}
                        {insight.actionHref && <Icons.externalLink className="ml-1.5 h-3 w-3" />}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>A quick view of the latest permit applications.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingRecentApplications ? (
              <div className="p-4 text-center">Loading recent applications...</div>
            ) : recentApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>Vehicle Type</TableHead>
                      <TableHead>Permit Type</TableHead>
                      <TableHead>Application Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.fullName}</TableCell>
                        <TableCell>{app.vehicleType}</TableCell>
                        <TableCell>{app.applicationSubType}</TableCell>
                        <TableCell>{app.applicationType}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(app.amount)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-0.5">
                            {/* Link to review page */}
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                              <Link href={`/applications/review?applicationId=${app.id}`}>
                                <Icons.eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            {/* Edit Button (conceptual) */}
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Icons.edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            {/* Delete Button (conceptual, only if not approved) */}
                            {app.status !== "Approved" && (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Icons.trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No recent applications found.</div>
            )}
            <div className="p-4 text-right border-t">
              <Button variant="link" size="sm" asChild>
                <Link href="/applications">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
