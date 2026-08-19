import type { ChartDataPoint, KPIData } from '@/types/super-admin/types'

export const revenueData = {
  daily: [
    { name: 'Mon', value: 145000, target: 130000 },
    { name: 'Tue', value: 168000, target: 140000 },
    { name: 'Wed', value: 152000, target: 145000 },
    { name: 'Thu', value: 189000, target: 150000 },
    { name: 'Fri', value: 210000, target: 165000 },
    { name: 'Sat', value: 195000, target: 170000 },
    { name: 'Sun', value: 142000, target: 150000 },
  ],
  weekly: [
    { name: 'W1', value: 845000, target: 800000 },
    { name: 'W2', value: 912000, target: 850000 },
    { name: 'W3', value: 768000, target: 870000 },
    { name: 'W4', value: 1102000, target: 950000 },
    { name: 'W5', value: 1245000, target: 1000000 },
    { name: 'W6', value: 1189000, target: 1050000 },
  ],
  monthly: [
    { name: 'Jan', value: 4200000, target: 4000000 },
    { name: 'Feb', value: 4500000, target: 4200000 },
    { name: 'Mar', value: 5100000, target: 4500000 },
    { name: 'Apr', value: 4800000, target: 4700000 },
    { name: 'May', value: 5600000, target: 5000000 },
    { name: 'Jun', value: 6200000, target: 5300000 },
    { name: 'Jul', value: 7100000, target: 5800000 },
  ],
  yearly: [
    { name: '2020', value: 18000000, target: 20000000 },
    { name: '2021', value: 28000000, target: 25000000 },
    { name: '2022', value: 42000000, target: 35000000 },
    { name: '2023', value: 58000000, target: 50000000 },
    { name: '2024', value: 71000000, target: 65000000 },
  ],
};

export const businessGrowthData: ChartDataPoint[] = [
  { name: 'Jan', registrations: 12, active: 8, churn: 2, renewals: 6 },
  { name: 'Feb', registrations: 15, active: 10, churn: 1, renewals: 8 },
  { name: 'Mar', registrations: 18, active: 14, churn: 3, renewals: 10 },
  { name: 'Apr', registrations: 14, active: 11, churn: 2, renewals: 9 },
  { name: 'May', registrations: 22, active: 18, churn: 1, renewals: 12 },
  { name: 'Jun', registrations: 25, active: 20, churn: 4, renewals: 15 },
  { name: 'Jul', registrations: 28, active: 24, churn: 2, renewals: 18 },
];

export const subscriptionDistributionData: ChartDataPoint[] = [
  { name: 'Trial', value: 3, color: 'hsl(var(--chart-1))' },
  { name: 'Starter', value: 4, color: 'hsl(var(--chart-3))' },
  { name: 'Professional', value: 8, color: 'hsl(var(--chart-5))' },
  { name: 'Enterprise', value: 6, color: 'hsl(var(--chart-7))' },
];

export const industryDistributionData: ChartDataPoint[] = [
  { name: 'Retail', value: 3, color: 'hsl(var(--chart-1))' },
  { name: 'Pharmacy', value: 3, color: 'hsl(var(--chart-2))' },
  { name: 'Restaurant', value: 2, color: 'hsl(var(--chart-3))' },
  { name: 'Hotel', value: 2, color: 'hsl(var(--chart-4))' },
  { name: 'School', value: 2, color: 'hsl(var(--chart-5))' },
  { name: 'Hospital', value: 1, color: 'hsl(var(--chart-6))' },
  { name: 'Property Mgmt', value: 2, color: 'hsl(var(--chart-7))' },
  { name: 'Manufacturing', value: 2, color: 'hsl(var(--chart-8))' },
  { name: 'Wholesale', value: 2, color: 'hsl(var(--chart-9))' },
  { name: 'Other', value: 1, color: 'hsl(var(--chart-10))' },
];

export const whatsappAnalyticsData: ChartDataPoint[] = [
  { name: 'W1', sent: 12000, delivered: 11500, read: 9800, failed: 500 },
  { name: 'W2', sent: 15000, delivered: 14200, read: 12500, failed: 800 },
  { name: 'W3', sent: 18000, delivered: 17500, read: 15200, failed: 500 },
  { name: 'W4', sent: 22000, delivered: 21000, read: 18500, failed: 1000 },
  { name: 'W5', sent: 25000, delivered: 24500, read: 21000, failed: 500 },
  { name: 'W6', sent: 28000, delivered: 27000, read: 23500, failed: 1000 },
];

export const apiUsageData: ChartDataPoint[] = [
  { name: '00:00', requests: 4500, errors: 45 },
  { name: '04:00', requests: 3200, errors: 20 },
  { name: '08:00', requests: 12500, errors: 120 },
  { name: '12:00', requests: 18000, errors: 180 },
  { name: '16:00', requests: 22000, errors: 250 },
  { name: '20:00', requests: 15000, errors: 90 },
];

export const paymentTrendsData: ChartDataPoint[] = [
  { name: 'Jan', revenue: 4200000, failed: 150000, refunds: 50000 },
  { name: 'Feb', revenue: 4500000, failed: 120000, refunds: 30000 },
  { name: 'Mar', revenue: 5100000, failed: 200000, refunds: 80000 },
  { name: 'Apr', revenue: 4800000, failed: 180000, refunds: 45000 },
  { name: 'May', revenue: 5600000, failed: 100000, refunds: 60000 },
  { name: 'Jun', revenue: 6200000, failed: 220000, refunds: 90000 },
  { name: 'Jul', revenue: 7100000, failed: 130000, refunds: 70000 },
];

export const churnData: ChartDataPoint[] = [
  { name: 'Jan', value: 2.1 },
  { name: 'Feb', value: 1.8 },
  { name: 'Mar', value: 2.5 },
  { name: 'Apr', value: 2.0 },
  { name: 'May', value: 1.5 },
  { name: 'Jun', value: 1.9 },
  { name: 'Jul', value: 1.4 },
];

export const dashboardKPIs: KPIData[] = [
  { label: 'Total Businesses', value: 18, format: 'number', growth: 12.5, previousValue: 16, sparkline: [12, 13, 14, 15, 16, 17, 18], icon: 'Building2', color: 'text-blue-500' },
  { label: 'Active Businesses', value: 12, format: 'number', growth: 8.2, previousValue: 11, sparkline: [8, 9, 10, 10, 11, 11, 12], icon: 'CheckCircle2', color: 'text-green-500' },
  { label: 'Trial Businesses', value: 3, format: 'number', growth: 50.0, previousValue: 2, sparkline: [1, 1, 2, 2, 2, 3, 3], icon: 'Clock', color: 'text-amber-500' },
  { label: 'Suspended Businesses', value: 1, format: 'number', growth: -50.0, previousValue: 2, sparkline: [2, 2, 2, 1, 1, 1, 1], icon: 'Ban', color: 'text-red-500' },
  { label: 'Expired Subscriptions', value: 1, format: 'number', growth: 0, previousValue: 1, sparkline: [1, 1, 1, 1, 1, 1, 1], icon: 'XCircle', color: 'text-orange-500' },
  { label: 'Monthly Revenue', value: 7100000, format: 'currency', growth: 14.5, previousValue: 6200000, sparkline: [4.2, 4.5, 5.1, 4.8, 5.6, 6.2, 7.1], icon: 'DollarSign', color: 'text-green-600' },
  { label: 'Annual Revenue', value: 71000000, format: 'currency', growth: 22.4, previousValue: 58000000, sparkline: [18, 28, 42, 58, 71], icon: 'TrendingUp', color: 'text-emerald-600' },
  { label: 'Total Transactions', value: 18450, format: 'number', growth: 18.3, previousValue: 15600, sparkline: [12000, 13500, 14000, 15600, 16800, 17500, 18450], icon: 'Receipt', color: 'text-indigo-500' },
  { label: 'Total Users', value: 1066, format: 'number', growth: 15.2, previousValue: 925, sparkline: [650, 720, 810, 880, 925, 990, 1066], icon: 'Users', color: 'text-purple-500' },
  { label: 'Active WhatsApp', value: 8, format: 'number', growth: 33.3, previousValue: 6, sparkline: [4, 5, 5, 6, 6, 7, 8], icon: 'MessageCircle', color: 'text-teal-500' },
  { label: 'Pending Registrations', value: 5, format: 'number', growth: 25.0, previousValue: 4, sparkline: [2, 3, 3, 4, 4, 5, 5], icon: 'UserPlus', color: 'text-cyan-500' },
  { label: 'New Businesses Today', value: 2, format: 'number', growth: 100.0, previousValue: 1, sparkline: [0, 1, 0, 1, 1, 2, 2], icon: 'Sparkles', color: 'text-pink-500' },
  { label: 'API Requests Today', value: 75200, format: 'number', growth: 11.8, previousValue: 67200, sparkline: [45000, 52000, 58000, 61000, 65000, 71000, 75200], icon: 'Activity', color: 'text-blue-600' },
];

export const subscriptionKPIs: KPIData[] = [
  { label: 'Active', value: 12, format: 'number', growth: 8.2, previousValue: 11, sparkline: [8, 9, 10, 10, 11, 11, 12], icon: 'CheckCircle2', color: 'text-green-500' },
  { label: 'Trial', value: 3, format: 'number', growth: 50.0, previousValue: 2, sparkline: [1, 1, 2, 2, 2, 3, 3], icon: 'Clock', color: 'text-amber-500' },
  { label: 'Expired', value: 1, format: 'number', growth: 0, previousValue: 1, sparkline: [1, 1, 1, 1, 1, 1, 1], icon: 'XCircle', color: 'text-red-500' },
  { label: 'Due Today', value: 1, format: 'number', growth: -50.0, previousValue: 2, sparkline: [2, 2, 1, 1, 1, 1, 1], icon: 'CalendarClock', color: 'text-orange-500' },
  { label: 'Due This Week', value: 3, format: 'number', growth: 50.0, previousValue: 2, sparkline: [1, 2, 2, 2, 3, 3, 3], icon: 'CalendarDays', color: 'text-blue-500' },
  { label: 'Monthly Revenue', value: 7100000, format: 'currency', growth: 14.5, previousValue: 6200000, sparkline: [4.2, 4.5, 5.1, 4.8, 5.6, 6.2, 7.1], icon: 'DollarSign', color: 'text-emerald-500' },
  { label: 'Annual Revenue', value: 71000000, format: 'currency', growth: 22.4, previousValue: 58000000, sparkline: [18, 28, 42, 58, 71], icon: 'TrendingUp', color: 'text-emerald-600' },
  { label: 'Churn Rate', value: 1.4, format: 'percent', growth: -26.3, previousValue: 1.9, sparkline: [2.1, 1.8, 2.5, 2.0, 1.5, 1.9, 1.4], icon: 'TrendingDown', color: 'text-red-500' },
];

export const whatsappKPIs: KPIData[] = [
  { label: 'Connected Businesses', value: 8, format: 'number', growth: 33.3, previousValue: 6, sparkline: [4, 5, 5, 6, 6, 7, 8], icon: 'Link', color: 'text-green-500' },
  { label: 'Active Phone Numbers', value: 8, format: 'number', growth: 33.3, previousValue: 6, sparkline: [4, 5, 5, 6, 6, 7, 8], icon: 'Phone', color: 'text-blue-500' },
  { label: 'Templates', value: 10, format: 'number', growth: 25.0, previousValue: 8, sparkline: [6, 7, 7, 8, 8, 9, 10], icon: 'FileText', color: 'text-purple-500' },
  { label: 'Messages Sent Today', value: 28000, format: 'number', growth: 16.6, previousValue: 24000, sparkline: [18000, 20000, 22000, 24000, 25000, 27000, 28000], icon: 'Send', color: 'text-teal-500' },
  { label: 'Delivered', value: 27000, format: 'number', growth: 17.3, previousValue: 23000, sparkline: [17000, 19000, 21000, 23000, 24000, 26000, 27000], icon: 'CheckCheck', color: 'text-green-600' },
  { label: 'Failed', value: 1000, format: 'number', growth: -20.0, previousValue: 1250, sparkline: [1500, 1400, 1300, 1250, 1100, 1050, 1000], icon: 'XCircle', color: 'text-red-500' },
  { label: 'Read Rate', value: 87, format: 'percent', growth: 4.8, previousValue: 83, sparkline: [78, 80, 81, 83, 84, 85, 87], icon: 'Eye', color: 'text-amber-500' },
  { label: 'Est. Messaging Cost', value: 140000, format: 'currency', growth: 16.6, previousValue: 120000, sparkline: [90000, 100000, 110000, 120000, 125000, 135000, 140000], icon: 'DollarSign', color: 'text-indigo-500' },
];
