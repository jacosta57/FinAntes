import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';

function Portfolio() {
    const investments = [
        { symbol: 'AAPL', shares: 10, purchaseValue: 150, currentValue: 180 },
        { symbol: 'GOOGL', shares: 5, purchaseValue: 2800, currentValue: 3100 },
        { symbol: 'MSFT', shares: 8, purchaseValue: 300, currentValue: 400 },
        { symbol: 'AMZN', shares: 6, purchaseValue: 3200, currentValue: 3500 }
    ];
    
    const loading = false;
    const error = null;
    const symbol = '$';

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

        const theme = document.documentElement.getAttribute('data-theme');
        const textColor = theme === 'light' ? '#000000' : '#FFFFFF';
        const gridColor = theme === 'light' ? '#e0e0e0' : '#444444';

        const monthlyData = [];
        const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
        
        monthlyData.push(totalBuyValue);
        
        const totalReturn = totalCurrentValue - totalBuyValue;
        const monthlyGrowth = totalReturn / (monthLabels.length - 1);
        
        for (let i = 1; i < monthLabels.length; i++) {
            const previousValue = monthlyData[i - 1];
            const variance = (Math.random() - 0.5) * monthlyGrowth * 0.8;
            const nextValue = previousValue + monthlyGrowth + variance;
            monthlyData.push(Math.round(nextValue));
        }
        
        monthlyData[monthlyData.length - 1] = totalCurrentValue;
        
        const data = {
            labels: monthLabels,
            datasets: [{
                label: 'Portfolio Value',
                data: monthlyData,
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
                            return symbol + value.toLocaleString();
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
                            return `${context.dataset.label} : ${symbol} ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        };

        return { chartData: data, chartOptions: options, totalCurrentValue, returnPercent };
    }, [investments]);

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
                            <span>{symbol}{totalCurrentValue.toFixed(2)}</span>
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