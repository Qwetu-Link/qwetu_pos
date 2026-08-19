'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, Eye, RefreshCw, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badges';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { whatsappTemplates } from '@/data/mock-data';
import type { WhatsAppTemplate, TemplateCategory } from '@/types/super-admin/types';
import { toast } from 'sonner';
import { AppShell } from '@/components/layouts/app-shell';

type TemplateFilter = 'all' | TemplateCategory;

const templateFilters = new Set<string>(['all', 'Authentication', 'Utility', 'Marketing']);

export default function TemplatesPage() {
  const [filter, setFilter] = React.useState<TemplateFilter>('all');
  const [preview, setPreview] = React.useState<WhatsAppTemplate | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = filter === 'all' ? whatsappTemplates : whatsappTemplates.filter(t => t.category === filter);

  return (
    <AppShell>
      <PageHeader title="Template Manager" description="Create and manage WhatsApp message templates">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger >
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Submit a new WhatsApp message template for approval</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tpl-name">Template Name</Label>
                <Input id="tpl-name" placeholder="e.g. order_status" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="en_GB">English (UK)</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tpl-header">Header (optional)</Label>
                <Input id="tpl-header" placeholder="Header text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tpl-body">Body</Label>
                <Textarea id="tpl-body" placeholder="Hi {{1}}, your order #{{2}}..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tpl-footer">Footer (optional)</Label>
                <Input id="tpl-footer" placeholder="Footer text" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast.success('Template submitted for approval'); setCreateOpen(false); }}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs
        value={filter}
        onValueChange={(value) => {
          if (templateFilters.has(value)) {
            setFilter(value as TemplateFilter);
          }
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Utility">Utility</TabsTrigger>
          <TabsTrigger value="Authentication">Authentication</TabsTrigger>
          <TabsTrigger value="Marketing">Marketing</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tpl, i) => (
          <Card key={tpl.id} className="flex flex-col transition-all hover:shadow-lg" style={{ animation: `fade-in 0.3s ease-out ${i * 0.05}s both` }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-mono">{tpl.name}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Badge variant="outline">{tpl.category}</Badge>
                    <span className="text-xs">{tpl.language}</span>
                  </CardDescription>
                </div>
                <StatusBadge status={tpl.status} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{tpl.body}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tpl.variables} variables</span>
                <span>-</span>
                <span>Updated {tpl.lastUpdated}</span>
              </div>
              <div className="mt-auto flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreview(tpl)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success('Edit dialog would open')}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success('Syncing with WhatsApp...')}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => toast.error('Delete requires confirmation')}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono">{preview?.name}</DialogTitle>
            <DialogDescription>Template preview</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-full max-w-xs rounded-2xl bg-[#e5ddd5] p-3 dark:bg-[#1f2c34]">
                  <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-[#202c33]">
                    {preview.header && (
                      <p className="mb-1 font-semibold text-[#075e54] dark:text-[#53bdeb]">{preview.header}</p>
                    )}
                    <p className="text-sm text-gray-800 dark:text-gray-100">{preview.body}</p>
                    {preview.footer && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{preview.footer}</p>
                    )}
                    <p className="mt-1 text-right text-[10px] text-gray-400">12:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Preview as seen on WhatsApp</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
