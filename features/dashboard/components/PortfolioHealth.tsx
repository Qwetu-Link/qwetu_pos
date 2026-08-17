import { icon } from '@/utils/icons'
import type { DashboardPaymentHealthItem } from '@/types/dashboard-live'

const healthColors: Record<DashboardPaymentHealthItem['label'], string> = {
    Active: 'status-active',
    Overdue: 'status-overdue',
    Completed: 'status-completed',
}

const healthColorVars: Record<DashboardPaymentHealthItem['label'], string> = {
    Active: 'var(--dashboard-blue)',
    Overdue: 'var(--dashboard-red)',
    Completed: 'var(--dashboard-emerald)',
}

export function PortfolioHealth({ data }: { data: DashboardPaymentHealthItem[] }) {

    const propertyHealth = data.map((item) => ({
        ...item,
        color: healthColors[item.label],
    }))
    const totalPayments = propertyHealth.reduce((total, item) => total + item.value, 0)
    const overdue = propertyHealth.find((item) => item.label === 'Overdue')?.value ?? 0
    const overdueRate = totalPayments > 0 ? (overdue / totalPayments) * 100 : 0
    const donutSegments = propertyHealth
        .filter((item) => item.value > 0 && totalPayments > 0)
        .reduce<{ segments: string[]; cursor: number }>((acc, item) => {
            const start = acc.cursor
            const end = start + (item.value / totalPayments) * 100

            return {
                cursor: end,
                segments: [...acc.segments, `${healthColorVars[item.label]} ${start}% ${end}%`],
            }
        }, { cursor: 0, segments: [] }).segments
    const donutBackground = donutSegments.length > 0
        ? `conic-gradient(${donutSegments.join(', ')})`
        : 'conic-gradient(var(--dashboard-border) 0 100%)'

    return (
        <div className="panel health-panel">
            <div className="panel-head">
                <div>
                    <span className="eyebrow">Portfolio health</span>
                    <h3>Lipa Mdogo Payment status</h3>
                </div>
                {icon('MoreHorizontal', { size: 18 })}
            </div>
            <div className="donut-wrap">
                <div
                    className="donut"
                    style={{
                        background: donutBackground,
                    }}
                >
                    <div>
                        <strong>{totalPayments}</strong>
                        <span>Total order payments</span>
                    </div>
                </div>
                <div className="health-legend">
                    {propertyHealth.map((item) => (
                        <div key={item.label}>
                            <span>
                                <i className={item.color} />
                                {item.label}
                            </span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
            <div className="health-progress">
                {propertyHealth.map((item) => <i key={item.label} className={item.color} style={{ width: `${totalPayments > 0 ? (item.value / totalPayments) * 100 : 0}%` }} />)}
            </div>
            <p className="insight">
                {icon('Sparkles', { size: 15 })} <span><strong>{overdueRate.toFixed(1)}%</strong> of installment payments need follow-up.</span>
            </p>
        </div>
    )
}
