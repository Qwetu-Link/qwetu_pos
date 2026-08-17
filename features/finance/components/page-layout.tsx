import React from 'react'
import type { FinancePageLayoutProps } from '@/types/finance'

export function PageLayout({ title, subtitle, icon: Icon, actions, children }: FinancePageLayoutProps) {
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <h1 className="flex min-w-0 items-center gap-3 text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
            {Icon && <Icon className="h-7 w-7 flex-shrink-0 text-[#E2F4DF] sm:h-8 sm:w-8" />}
            <span className="min-w-0 break-words">{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-1 max-w-3xl text-sm font-medium text-[#9CB4CA] sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 self-stretch sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end [&_a]:w-full [&_button]:w-full [&_button]:gap-2 sm:[&_a]:w-auto sm:[&_button]:w-auto">
          {actions}
        </div>
      </div>

      <div className="w-full min-w-0">
        {children}
      </div>
    </div>
  )
}
