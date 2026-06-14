
import { Button } from '@/components/ui/button'
import { Shield, Users, Key, Bell, Database, LogOut } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Settings - Qwetulink Finance ERP',
  description: 'System settings and administration',
}

export default function SettingsPage() {
  const sections = [
    {
      title: 'Business Profile',
      icon: Database,
      description: 'Manage business information and branding',
      items: ['Business Name', 'Address', 'Tax ID', 'Logo', 'Currency Settings']
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage users and access control',
      items: ['Create Users', 'Roles & Permissions', 'User Deactivation', 'Password Policy']
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Manage security and data protection',
      items: ['Two-Factor Authentication', 'API Keys', 'Session Management', 'Backup & Recovery']
    },
    {
      title: 'Integrations',
      icon: Key,
      description: 'Connect with external services',
      items: ['M-Pesa Integration', 'Bank APIs', 'Email Service', 'SMS Gateway']
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure system alerts and notifications',
      items: ['Email Notifications', 'SMS Alerts', 'Payment Reminders', 'Low Stock Alerts']
    },
    {
      title: 'System',
      icon: Database,
      description: 'System configuration and maintenance',
      items: ['Fiscal Year Setup', 'Chart of Accounts', 'Backup Settings', 'Audit Logs']
    },
  ]

  return (
      <PageLayout
        title="Settings"
        subtitle="Configure system settings and administration"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const SectionIcon = section.icon
            return (
              <div key={section.title} className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <SectionIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="sm" className="w-full">
                  Configure
                </Button>
              </div>
            )
          })}
        </div>

        {/* Additional Admin Actions */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">System Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start gap-2 h-auto py-4">
              <Database className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Database</div>
                <div className="text-xs text-muted-foreground">Backup & maintenance</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-4">
              <Shield className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Audit Trail</div>
                <div className="text-xs text-muted-foreground">View system logs</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-4">
              <LogOut className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Sign Out</div>
                <div className="text-xs text-muted-foreground">End session</div>
              </div>
            </Button>
          </div>
        </div>
      </PageLayout>
  )
}
