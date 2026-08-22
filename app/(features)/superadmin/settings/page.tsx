'use client';

import {
  Settings, Lock, CreditCard, Mail, MessageCircle, HardDrive, Shield, Bell, Save, KeyRound, Smartphone,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

const settingsTabs = [
  { value: 'general', label: 'General', icon: Settings },
  { value: 'authentication', label: 'Authentication', icon: Lock },
  { value: 'payments', label: 'Payments', icon: CreditCard },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'storage', label: 'Storage', icon: HardDrive },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const save = () => toast.success('Settings saved successfully');

  return (
    <AppShell>
      <PageHeader title="System Settings" description="Configure platform-wide settings">
        <Button size="sm" onClick={save}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input defaultValue="Qwetu ERP/POS" />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input defaultValue="https://qwetu.com/logo.png" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="nairobi">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Africa/Nairobi (GMT+3)</SelectItem>
                    <SelectItem value="lagos">Africa/Lagos (GMT+1)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select defaultValue="kes">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kes">KES - Kenyan Shilling</SelectItem>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input defaultValue="support@qwetu.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Security policies for user authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Password Policy</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Input type="number" defaultValue={8} />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Input type="number" defaultValue={90} />
                  </div>
                </div>
                <div className="space-y-3">
                  {['Require uppercase letters', 'Require numbers', 'Require special characters', 'Prevent password reuse'].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">{item}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Multi-Factor Authentication</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Require MFA for admins</p>
                        <p className="text-xs text-muted-foreground">All admin users must enable 2FA</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">SMS verification</p>
                        <p className="text-xs text-muted-foreground">Send OTP via SMS</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue={30} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'M-Pesa', desc: 'Safaricom mobile money', enabled: true, fields: ['Consumer Key', 'Consumer Secret', 'Shortcode', 'Passkey'] },
                { name: 'Stripe', desc: 'International card payments', enabled: true, fields: ['Publishable Key', 'Secret Key'] },
                { name: 'PayPal', desc: 'PayPal account payments', enabled: false, fields: ['Client ID', 'Client Secret'] },
                { name: 'Bank Transfer', desc: 'Direct bank transfers', enabled: true, fields: ['Bank Name', 'Account Number', 'Account Name'] },
              ].map((gateway) => (
                <div key={gateway.name} className="rounded-xl border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{gateway.name}</p>
                        <p className="text-xs text-muted-foreground">{gateway.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={gateway.enabled} />
                  </div>
                  {gateway.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      {gateway.fields.map((field) => (
                        <div key={field} className="space-y-1">
                          <Label className="text-xs">{field}</Label>
                          <Input type="password" placeholder="••••••••••••" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input defaultValue="smtp.sendgrid.net" />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input type="number" defaultValue={587} />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input defaultValue="apikey" />
              </div>
              <div className="space-y-2">
                <Label>Password / API Key</Label>
                <Input type="password" defaultValue="SG.xxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input defaultValue="noreply@qwetu.com" />
              </div>
              <div className="space-y-2">
                <Label>From Name</Label>
                <Input defaultValue="Qwetu Platform" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
                <span className="text-sm">Use TLS encryption</span>
                <Switch defaultChecked />
              </div>
              <div className="sm:col-span-2">
                <Button variant="outline" size="sm" onClick={() => toast.success('Test email sent!')}>Send Test Email</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Global Defaults</CardTitle>
              <CardDescription>Default settings for all WhatsApp connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en_US">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Category</Label>
                  <Select defaultValue="utility">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit (messages/min)</Label>
                  <Input type="number" defaultValue={100} />
                </div>
                <div className="space-y-2">
                  <Label>Retry Attempts</Label>
                  <Input type="number" defaultValue={3} />
                </div>
              </div>
              <div className="space-y-3">
                {['Auto-sync templates', 'Enable delivery receipts', 'Enable read receipts'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">{item}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Configuration</CardTitle>
              <CardDescription>File storage and backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Storage Provider</Label>
                <Select defaultValue="s3">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Bucket Name</Label>
                  <Input defaultValue="qwetu-uploads" />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input defaultValue="af-south-1" />
                </div>
                <div className="space-y-2">
                  <Label>Access Key</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">Enable automatic backups</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">Encrypt stored files</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>CORS, rate limiting, and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Allowed Origins (CORS)</Label>
                <Input defaultValue="https://qwetu.com, https://app.qwetu.com" />
                <p className="text-xs text-muted-foreground">Comma-separated list of allowed domains</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Rate Limit (requests/min)</Label>
                  <Input type="number" defaultValue={100} />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" defaultValue={5} />
                </div>
              </div>
              <div className="space-y-3">
                {['Enable IP whitelist', 'Block suspicious IPs', 'Require HTTPS', 'Enable audit logging', 'Enable brute force protection'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">{item}</span>
                    <Switch defaultChecked={item !== 'Enable IP whitelist'} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Configure how notifications are delivered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Email Notifications', desc: 'Send notifications via email', enabled: true, icon: Mail },
                { name: 'SMS Notifications', desc: 'Send notifications via SMS', enabled: true, icon: Smartphone },
                { name: 'Push Notifications', desc: 'Browser push notifications', enabled: true, icon: Bell },
                { name: 'WhatsApp Notifications', desc: 'Send via WhatsApp Cloud API', enabled: false, icon: MessageCircle },
              ].map((channel) => {
                const Icon = channel.icon;
                return (
                  <div key={channel.name} className="flex items-center justify-between rounded-xl border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{channel.name}</p>
                        <p className="text-xs text-muted-foreground">{channel.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={channel.enabled} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
