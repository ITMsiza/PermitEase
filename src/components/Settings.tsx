
/*"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { auth, setUserProfile } from "@/lib/firebase"; // Import auth and setUserProfile

export default function SettingsPage() {

  const handleSaveProfile = async () => {
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const roleSelect = document.getElementById('role') as HTMLSelectElement | null;
    const departmentInput = document.getElementById('department') as HTMLInputElement | null;
    const dotAddressTextarea = document.getElementById('dot-address') as HTMLTextAreaElement | null;
    const subordinatesTextarea = document.getElementById('subordinates') as HTMLTextAreaElement | null;

    const profileData = {
      name: nameInput?.value || '',
      email: emailInput?.value || '',
      role: roleSelect?.value || '',
      department: departmentInput?.value || '',
      dotAddress: dotAddressTextarea?.value || '',
      subordinates: subordinatesTextarea?.value || '',
    };

    const user = auth.currentUser; // Get the current authenticated user
    if (user) {
      await setUserProfile(user, profileData); // Call setUserProfile with the user object and profile data
    } else {
      console.error("No user is logged in."); // Handle the case where no user is logged in
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
      <PageHeader title="Settings" description="Manage your account and system preferences." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-auto lg:grid-cols-6 mb-6">
          <TabsTrigger value="profile"><Icons.userProfile className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Icons.notificationPreferences className="mr-1.5 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="system"><Icons.systemPreferences className="mr-1.5 h-4 w-4" />System</TabsTrigger>
          <TabsTrigger value="access"><Icons.accessControl className="mr-1.5 h-4 w-4" />Access</TabsTrigger>
          <TabsTrigger value="password"><Icons.passwordChange className="mr-1.5 h-4 w-4" />Password</TabsTrigger>
          <TabsTrigger value="language"><Icons.languageSettings className="mr-1.5 h-4 w-4" />Language</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal information and organizational details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://placehold.co/80x80.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>PW</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="w-full md:w-auto">Upload New Picture</Button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="assessor">Assessor</SelectItem>
                      <SelectItem value="approver">Approver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="e.g., Operations, Permitting" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="dot-address">DoT Address</Label>
                <Textarea id="dot-address" placeholder="Enter Department of Transport physical address" rows={3} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="subordinates">Subordinates</Label>
                <Textarea id="subordinates" placeholder="List names or roles of subordinates, if any" rows={3} />
              </div>

            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive updates about application statuses and system alerts via email.
                  </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="app-notifications" className="flex flex-col space-y-1">
                  <span>In-App Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Display notifications within the PermitWise application.
                  </span>
                </Label>
                <Switch id="app-notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-wide settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="africa-johannesburg">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africa-johannesburg">(GMT+02:00) Johannesburg</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="date-format">Date Format</Label>
                 <Select defaultValue="dd-mmm-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mmm-yyyy">DD MMM YYYY (e.g., 15 Nov 2023)</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (e.g., 2023-11-15)</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY (e.g., 11/15/2023)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save System Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Role-based Access Control</CardTitle>
              <CardDescription>Manage user roles and permissions. (Placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Access control management interface will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Choose your preferred language for the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="language">Select Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="af">Afrikaans</SelectItem>
                    <SelectItem value="zu">Zulu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Language</Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </>
  );
}*/
