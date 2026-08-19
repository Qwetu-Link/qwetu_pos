
import type { DashboardCollectionPoint } from "@/types/admin/dashboard-live";

function formatAxisValue(value: number) {
    if (value >= 1_000_000) return `KES ${Math.round(value / 1_000_000)}M`;
    if (value >= 1_000) return `KES ${Math.round(value / 1_000)}K`;
    return `KES ${value}`;
}

function getNiceAxisMax(value: number) {
    if (value <= 0) return 20_000_000;

    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;
    const niceMultiplier = normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;

    return niceMultiplier * magnitude;
}

export function CollectionChart({ data }: { data: DashboardCollectionPoint[] }) {
    const collectionData = data.length > 0 ? data : [{ month: 'Now', value: 0 }];
    const maxValue = Math.max(...collectionData.map((item) => item.value), 0);
    const axisMax = getNiceAxisMax(maxValue);
    const chart = collectionData.map((item) => (item.value / axisMax) * 94);
    const lastIndex = Math.max(chart.length - 1, 1);
    const axisValues = [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(axisMax * ratio));

    const linePath = `M 0 ${170 - chart[0] * 1.55} ${chart
        .map((value, index) => `L ${(index / lastIndex) * 600} ${170 - value * 1.55}`)
        .join(' ')}`
    const areaPath = `M 0 170 ${chart
        .map((value, index) => `L ${(index / lastIndex) * 600} ${170 - value * 1.55}`)
        .join(' ')} L 600 170 Z`

    return (
        <div className="panel chart-panel">
            <div className="panel-head">
                <div>
                    <span className="eyebrow">Collection performance</span>
                    <h3>Order payment collected</h3>
                </div>
                <div className="chart-actions">
                    <span className="legend">
                        <i className="legend-dot" />
                        Collected
                    </span>
                    <select aria-label="Chart period" defaultValue="Last 12 months">
                        <option>Last 12 months</option>
                    </select>
                </div>
            </div>
            <div className="chart-wrap">
                <div className="y-axis">
                    {axisValues.map((value, index) => (
                        <span key={`${value}-${index}`}>{index === axisValues.length - 1 ? '0' : formatAxisValue(value)}</span>
                    ))}
                </div>
                <div className="chart-area">
                    <div className="chart-grid">{[1, 2, 3, 4].map((index) => <i key={index} />)}</div>
                    <svg viewBox="0 0 600 170" preserveAspectRatio="none" className="line-chart" aria-label="Rent collection trend">
                        <path d={linePath} fill="none" stroke="var(--dashboard-orange)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                        <path d={areaPath} fill="url(#areaFill)" opacity=".16" />
                        <defs>
                            <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                                <stop stopColor="var(--dashboard-orange)" />
                                <stop offset="1" stopColor="var(--dashboard-orange)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {chart.map((value, index) => (
                            <circle
                                key={index}
                                cx={(index / lastIndex) * 600}
                                cy={170 - value * 1.55}
                                r="4"
                                fill="var(--dashboard-panel)"
                                stroke="var(--dashboard-orange)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                    </svg>
                    <div className="x-axis">{collectionData.map((item) => <span key={item.month}>{item.month}</span>)}</div>
                </div>
            </div>
        </div>
    )
}
