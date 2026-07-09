import React from 'react'
import type { FinancePageLayoutProps } from '@/types/finance'

export function PageLayout({ title, subtitle, icon: Icon, actions, children }: FinancePageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="flex min-w-0 items-center gap-3 text-2xl font-extrabold text-white sm:text-3xl">
            {Icon && <Icon className="h-7 w-7 flex-shrink-0 text-[#E2F4DF] sm:h-8 sm:w-8" />}
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm font-medium text-[#9CB4CA] sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 self-start sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end [&_button]:w-full [&_button]:gap-2 sm:[&_button]:w-auto">
          {actions}
        </div>
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
