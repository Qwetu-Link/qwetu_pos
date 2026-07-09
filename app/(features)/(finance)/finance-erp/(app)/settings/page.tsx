
import { Button } from '@/components/ui/button'
import { Shield, Users, Key, Bell, Database, LogOut } from 'lucide-react'
import type { FinanceSettingsSection } from '@/types/finance'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Settings - Qwetu POS Financial Management',
  description: 'System settings and administration',
}

export default function SettingsPage() {
  const sections: FinanceSettingsSection[] = [
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
              <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-emerald-50">
                        <SectionIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-slate-900 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
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
          <h3 className="text-lg font-semibold text-slate-900">System Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start gap-2 h-auto py-4">
              <Database className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Database</div>
                <div className="text-xs text-slate-500">Backup & maintenance</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-4">
              <Shield className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Audit Trail</div>
                <div className="text-xs text-slate-500">View system logs</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto py-4">
              <LogOut className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Sign Out</div>
                <div className="text-xs text-slate-500">End session</div>
              </div>
            </Button>
          </div>
        </div>
      </PageLayout>
  )
}
