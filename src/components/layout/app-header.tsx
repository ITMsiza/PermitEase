
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getAuth, signOut } from "firebase/auth"; // Import getAuth and signOut
import { useRouter } from "next/navigation"; // Import useRouter for navigation


const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/applications': 'Permits',
  '/applications/new': 'New Permit',
  '/applications/review': 'Review Permit',
  '/licences': 'Licences',
  '/licences/active': 'Active Licences',
  '/licences/in-progress': 'Licences In Progress',
  '/licences/suspended': 'Suspended Licences',
  '/workflow': 'Workflows',
  '/payment-history': 'Payments',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/system-administration': 'Admin',
  '/': 'Dashboard',
};

const THEME_STORAGE_KEY = 'permitwise-theme';

export function AppHeader() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleLogout = async () => {
    const auth = getAuth(); // Get the auth instance
    try {
      await signOut(auth); // Sign out the user
      console.log("User signed out successfully.");
      // Redirect to the login page after logout
      router.push('/auth'); // Assuming '/auth' is your login page route
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally, show an error message to the user
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialIsDark = storedTheme === 'light' ? false : true;
    setIsDarkMode(initialIsDark);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode, isMounted]);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };


  let currentTitle = 'PermitWise';
  const sortedPaths = Object.keys(pageTitles).sort((a, b) => b.length - a.length);

  for (const path of sortedPaths) {
    if (pathname.startsWith(path)) {
      currentTitle = pageTitles[path];
      break;
    }
  }

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="block">
              <h1 className="text-lg font-semibold text-foreground truncate">
                Loading...
              </h1>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 md:px-6">
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="block">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {currentTitle}
            </h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 md:px-6">
          <div className="relative w-full max-w-md lg:max-w-lg">
            <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for anything..."
              className="w-full rounded-full bg-background pl-9 pr-4 h-9"
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="sm" aria-label="Ask Maestro AI" className="px-2">
            <Icons.sparkles className="h-5 w-5 mr-1.5" />
            <span className="text-sm hidden sm:inline">Ask Maestro AI</span>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Toggle Theme" onClick={handleThemeToggle}>
            {isDarkMode ? <Icons.light className="h-5 w-5" /> : <Icons.dark className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Icons.bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar"/>
                  <AvatarFallback>PW</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">PermitWise User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@permitwise.co.za
                  </p>
                  <p className="text-xs leading-none text-muted-foreground pt-1">Role: Admin</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Icons.user className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Icons.settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}> {/* Call handleLogout on click */}
                <Icons.logOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

    