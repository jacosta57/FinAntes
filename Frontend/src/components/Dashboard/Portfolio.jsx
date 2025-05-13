import { Line } from 'react-chartjs-2';
import { useData } from 'DataContext';
import { useMemo } from 'react';

function Portfolio() {
    const { investments, userProfile, loading, error } = useData();

    const { chartData, chartOptions, totalCurrentValue, returnPercent } = useMemo(() => {
        let totalCurrentValue = 0;
        let totalBuyValue = 0;

        investments.forEach(investment => {
            totalCurrentValue += investment.currentValue * investment.shares;
            totalBuyValue += investment.purchaseValue * investment.shares;
        });

        let returnPercent;
        if (totalBuyValue > 0) { 
            returnPercent = ((totalCurrentValue - totalBuyValue) / totalBuyValue * 100).toFixed(2);
        } else { 
            returnPercent = "0.00";
        }

        const textColor = userProfile?.theme === 'light' ? '#000000' : '#FFFFFF';
        const gridColor = userProfile?.theme === 'light' ? '#e0e0e0' : '#444444';

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Portfolio Value',
                data: [0, totalBuyValue, totalCurrentValue],
                fill: false,
                borderColor: totalCurrentValue > totalBuyValue ? 'green' : 'red',
                tension: 0.1
            }]
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        };

        return { chartData: data, chartOptions: options, totalCurrentValue, returnPercent };
    }, [investments, userProfile?.theme]);

    const returnClass = parseFloat(returnPercent) >= 0 ? "text-success" : "text-danger";

    if (loading) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Loading...</div></div></div>;
    if (error) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center"><div className="text-center"><p className="text-danger">Error loading portfolio data</p><small className="text-muted">{error}</small></div></div></div></div>;

    return (
        <div className="col-md-4">
            <div id="item4" className="card h-100 shadow-sm">
                <div className="card-header ">
                    <h5 className="card-title mb-0 text-primary">Investment Portfolio</h5>
                </div>
                <div className="card-body">
                    <Line data={chartData} options={chartOptions} />
                    <div className="mt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Total Portfolio</span>
                            <span>${totalCurrentValue.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>This Month</span>
                            <span className={returnClass}>{returnPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Portfolio;