import React from 'react'

interface PageLayoutProps {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string; size?: number }>
  actions?: React.ReactNode
  children: React.ReactNode
}

export function PageLayout({ title, subtitle, icon: Icon, actions, children }: PageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
            {Icon && <Icon className="text-emerald-600 flex-shrink-0" size={32} />}
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Action Button Container - Automatically scales button layout heights */}
        <div className="flex items-center gap-3 self-start sm:self-auto [&_button]:px-5 [&_button]:py-2.5 [&_button]:rounded-xl [&_button]:font-medium [&_button]:transition-all">
          {actions}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}