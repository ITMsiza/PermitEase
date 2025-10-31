
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  useSidebar, 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Logo } from "./logo";
import type { LucideProps } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubMenuItem {
  href: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

interface MenuItemType {
  href: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  subItems?: SubMenuItem[];
  isToggle?: boolean;
}

const dashboardItem: MenuItemType[] = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.dashboard },
];

const applicationsAndLicencesItems: MenuItemType[] = [
  {
    href: "/applications",
    label: "Permits",
    icon: Icons.applications, // Assuming Icons.applications is suitable for Permits
    isToggle: true,
    subItems: [
       { href: "/applications/new?applicationType=New", label: "New", icon: Icons.plusCircle },
       { href: "/applications/amendment", label: "Amendment", icon: Icons.edit },
       { href: "/applications/renewal", label: "Renewal", icon: Icons.repeat },
       { href: "/applications/new?applicationType=Transfer", label: "Transfer", icon: Icons.arrowRightLeft },
       { href: "/applications/new?applicationType=Conversion", label: "Conversion", icon: Icons.refreshCw },
    ],
  },
  {
    href: "/licences",
    label: "Licences",
    icon: Icons.permits,
    isToggle: true,
    subItems: [
      { href: "/licences/active", label: "Active", icon: Icons.approveApplication },
      { href: "/licences/in-progress", label: "In Progress", icon: Icons.loader },
      { href: "/licences/suspended", label: "Suspended", icon: Icons.rejectApplication },
      { href: "/licences/renewal", label: "Renewal", icon: Icons.repeat }, 
      { href: "/licences/conversion", label: "Conversion", icon: Icons.refreshCw }, 
    ],
  },
];

const workflowAndNotificationsItems: MenuItemType[] = [
  { href: "/workflow", label: "Workflows", icon: Icons.workflow },
  { href: "/notifications", label: "Notifications", icon: Icons.bell },
];

const financialItems: MenuItemType[] = [
  { href: "/payment-history", label: "Payments", icon: Icons.paymentHistory },
  { href: "/analytics", label: "Analytics", icon: Icons.barChart3 },
];

const adminSettingsItems: MenuItemType[] = [
  { href: "/settings", label: "Settings", icon: Icons.settings },
  { href: "/system-administration", label: "Admin", icon: Icons.systemAdministration },
];

const logoutItem: MenuItemType[] = [
  { href: "#logout", label: "Log Out", icon: Icons.logOut },
];


export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = usePathname(); 
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const { toggleSidebar, state: sidebarState, isMobile } = useSidebar();

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  React.useEffect(() => {
    applicationsAndLicencesItems.forEach(item => {
      if (item.subItems && item.isToggle) {
        const isSubMenuKey = item.label.toLowerCase().replace(/\s+/g, '-');
        const isAnySubItemActive = item.subItems.some(subItem => {
            const subItemBasePath = subItem.href.split('?')[0];
            const currentBasePath = pathname.split('?')[0];
            if (currentBasePath === subItemBasePath) {
                 const subItemQuery = new URLSearchParams(subItem.href.split('?')[1] || '');
                 const currentQuery = new URLSearchParams(searchParams.split('?')[1] || ''); 
                 
                 let match = true;
                 subItemQuery.forEach((value, key) => {
                    if (currentQuery.get(key) !== value) {
                        match = false;
                    }
                 });
                 return match;
            }
            return false;
        });
      }
    });
  }, [pathname, searchParams]);

  const renderMenuItem = (item: MenuItemType) => {
    const IconComponent = item.icon;
    const isSubMenuKey = item.label.toLowerCase().replace(/\s+/g, '-');
    const isSubMenuOpen = openSubMenus[isSubMenuKey] || false;

    let isParentActive = pathname === item.href.split('?')[0] || (item.href !== "/" && pathname.startsWith(item.href.split('?')[0] + "/"));
    
    if (item.subItems && item.subItems.some(subItem => {
        const subItemBasePath = subItem.href.split('?')[0];
        return pathname.startsWith(subItemBasePath) && subItem.href === pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
    })) {
    }


    return (
      <SidebarMenuItem key={item.label}>
        <div className="flex items-center w-full">
          <Link
            href={item.href}
            legacyBehavior={item.subItems && item.isToggle ? true : undefined} 
            passHref={item.subItems && item.isToggle ? true : undefined}
          >
            <SidebarMenuButton
              isActive={isParentActive && (!item.subItems || !item.isToggle || pathname === item.href.split('?')[0] || !item.subItems.some(sub => pathname.startsWith(sub.href.split('?')[0])))}
              tooltip={{ children: item.label, side: "right", align: "center" }}
              className="justify-start flex-grow"
              onClick={(e) => {
                if (item.href === "#logout") {
                  e.preventDefault();
                  alert('Logout clicked!');
                }
              }}
            >
              <IconComponent className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </SidebarMenuButton>
          </Link>
          {item.isToggle && item.subItems && item.subItems.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSubMenu(isSubMenuKey);
              }}
              className="p-2 hover:bg-sidebar-accent rounded-md ml-1 flex-shrink-0"
              aria-label={`Toggle ${item.label} sub-menu`}
              aria-expanded={isSubMenuOpen}
            >
              <Icons.chevronSmallDown
                className={`h-4 w-4 text-sidebar-foreground transition-transform duration-200 ${
                  isSubMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
        {item.isToggle && item.subItems && item.subItems.length > 0 && isSubMenuOpen && (
          <SidebarMenuSub>
            {item.subItems.map((subItem) => {
              const SubIconComponent = subItem.icon;
              const subItemBasePath = subItem.href.split('?')[0];
              const subItemQueryString = subItem.href.split('?')[1] || '';
              
              const currentQueryString = searchParams.split('?')[1] || '';
              const isActive = pathname === subItemBasePath && subItemQueryString === currentQueryString;


              return (
                <SidebarMenuSubItem key={subItem.href}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuSubButton asChild isActive={isActive}>
                          <Link href={subItem.href}>
                            <SubIconComponent className="h-4 w-4" />
                            <span className="truncate">{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="center">
                        <p>{subItem.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader className="p-4 flex flex-row items-center">
        {/* Expanded state on Desktop */}
        {sidebarState === 'expanded' && !isMobile && (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 flex-grow">
              <Logo className="h-8 w-auto" />
            </Link>
            <Button // Collapse Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <Icons.chevronsLeft className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Collapsed state on Desktop */}
        {sidebarState === 'collapsed' && !isMobile && (
          <Button // Expand Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mx-auto"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
          >
            <Icons.chevronsRight className="h-5 w-5" />
          </Button>
        )}

        {/* Mobile state (Sheet view) */}
        {isMobile && (
           <Link href="/dashboard" className="flex items-center gap-2 flex-grow">
              <Logo className="h-8 w-auto" />
            </Link>
          // The Sheet (mobile sidebar) has its own close (X) button by default.
          // It's opened by the SidebarTrigger in AppHeader.
        )}
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {dashboardItem.map(item => renderMenuItem(item))}
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          {applicationsAndLicencesItems.map(item => renderMenuItem(item))}
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          {workflowAndNotificationsItems.map(item => renderMenuItem(item))}
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          {financialItems.map(item => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator className="my-2" />
      <SidebarFooter className="p-2">
         <SidebarMenu>
            {adminSettingsItems.map(item => renderMenuItem(item))}
          </SidebarMenu>
          <SidebarSeparator className="my-2" />
         <SidebarMenu>
            {logoutItem.map(item => renderMenuItem(item))}
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
