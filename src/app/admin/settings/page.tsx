'use client'; // For form handling if we add actual forms

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getSiteSettings } from '@/lib/mock-data';
import type { SiteSettings, SocialMediaLink } from '@/types';
import { UploadCloud, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const fetchedSettings = await getSiteSettings();
      setSettings(fetchedSettings);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !settings) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Site Settings</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please wait while settings are being loaded.</p>
        </CardContent>
      </Card>
    );
  }

  // Placeholder for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Settings saved (mock)!');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Site Settings</CardTitle>
        <CardDescription>Manage your website's general settings, logo, and contact information.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {/* Company Info Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-headline text-lg font-medium">Company Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue={settings.companyName} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input id="whatsappNumber" defaultValue={settings.whatsappNumber} className="mt-1" placeholder="e.g., 15551234567" />
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-headline text-lg font-medium">Company Logo</h3>
            <div>
              <Label htmlFor="logoUrl">Logo URL (or upload new)</Label>
              <Input id="logoUrl" defaultValue={settings.logoUrl} className="mt-1" />
              <div className="mt-2 flex items-center gap-4">
                {settings.logoUrl && (
                   <Image src={settings.logoUrl} alt="Current Logo" width={150} height={50} className="rounded border p-2 h-16 w-auto object-contain bg-muted" data-ai-hint="company logo" />
                )}
                <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" /> Upload New Logo
                </Button>
              </div>
               <p className="text-xs text-muted-foreground mt-1">Recommended size: 300x100px. Use a URL or upload functionality.</p>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-medium">Social Media Links</h3>
            {settings.socialMediaLinks.map((link, index) => (
              <div key={link.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
                <div className="sm:col-span-1">
                  <Label htmlFor={`socialPlatform-${index}`}>Platform</Label>
                  <Input id={`socialPlatform-${index}`} defaultValue={link.platform} disabled className="mt-1 bg-muted/50" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`socialUrl-${index}`}>URL</Label>
                  <div className="flex items-center gap-2">
                    <Input id={`socialUrl-${index}`} defaultValue={link.url} className="mt-1" />
                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Add Social Link
            </Button>
          </div>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button type="submit" className="ml-auto">Save Settings</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
