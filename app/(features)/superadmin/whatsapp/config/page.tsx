'use client';

import * as React from 'react';
import { Eye, EyeOff, RefreshCw, Send, CheckCircle2, FileText, Zap } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

interface ConfigField {
  key: string;
  label: string;
  value: string;
  masked: boolean;
}

export default function WhatsAppConfigPage() {
  const [fields, setFields] = React.useState<ConfigField[]>([
    { key: 'appId', label: 'App ID', value: '1234567890123456', masked: true },
    { key: 'appSecret', label: 'App Secret', value: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', masked: true },
    { key: 'accessToken', label: 'Access Token', value: 'EAAGm0P4ZC...long_token_string...xyz123', masked: true },
    { key: 'verifyToken', label: 'Verify Token', value: 'qwetu_verify_2024', masked: true },
    { key: 'webhookUrl', label: 'Webhook URL', value: 'https://api.qwetu.com/webhooks/whatsapp', masked: false },
    { key: 'apiVersion', label: 'API Version', value: 'v20.0', masked: false },
    { key: 'phoneNumberId', label: 'Phone Number ID', value: '1029384756', masked: true },
    { key: 'businessAccountId', label: 'Business Account ID', value: '102938475601', masked: true },
  ]);

  const toggleMask = (key: string) => {
    setFields(fields.map(f => f.key === key ? { ...f, masked: !f.masked } : f));
  };

  return (
    <AppShell>
      <PageHeader title="API Configuration" description="WhatsApp Cloud API global configuration">
        <Button variant="outline" size="sm" onClick={() => toast.success('Testing connection...')}>
          <Zap className="h-4 w-4" /> Test Connection
        </Button>
        <Button size="sm" onClick={() => toast.success('Syncing templates with WhatsApp...')}>
          <FileText className="h-4 w-4" /> Sync Templates
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
            <CardDescription>WhatsApp Business API credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={field.key}
                    type={field.masked ? 'password' : 'text'}
                    value={field.value}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => toggleMask(field.key)}
                  >
                    {field.masked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Incoming webhook settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Webhook URL</Label>
                <Input value="https://api.qwetu.com/webhooks/whatsapp" readOnly className="font-mono text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>API Version</Label>
                <Select defaultValue="v20.0">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v20.0">v20.0 (Latest)</SelectItem>
                    <SelectItem value="v19.0">v19.0</SelectItem>
                    <SelectItem value="v18.0">v18.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Webhook Active</span>
                </div>
                <p className="mt-1 text-xs text-green-600 dark:text-green-500">Last received: 2 minutes ago</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Test and manage API connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => toast.success('Connection test successful!')}>
                <Zap className="h-4 w-4" /> Test Connection
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => toast.success('Token refreshed successfully')}>
                <RefreshCw className="h-4 w-4" /> Refresh Token
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => toast.success('Test message sent!')}>
                <Send className="h-4 w-4" /> Send Test Message
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => toast.success('Syncing templates...')}>
                <FileText className="h-4 w-4" /> Sync Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
