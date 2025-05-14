import { Chart } from 'react-chartjs-2';
import { useData } from 'DataContext';
import { useMemo } from 'react';

function Spending() {
    const { regularExpenses, userProfile, loading, error, symbol } = useData();

    const chartData = useMemo(() => {
        const weeklySpendings = [0, 0, 0, 0];

        regularExpenses.forEach(expense => {
            const amount = expense.amount;

            switch (expense.frequency.toLowerCase()) {
                case 'weekly':
                    weeklySpendings[0] += amount;
                    weeklySpendings[1] += amount;
                    weeklySpendings[2] += amount;
                    weeklySpendings[3] += amount;
                    break;

                case 'bi-weekly':
                    weeklySpendings[1] += amount;
                    weeklySpendings[3] += amount;
                    break;

                case 'annually':
                    weeklySpendings[0] += amount / 12;
                    break;

                case 'monthly':
                default: weeklySpendings[0] += amount;
            }
        });

        return {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Spending Outlook',
                data: weeklySpendings,
                backgroundColor: '#36a2eb',
                borderColor: '#1e88e5',
                borderWidth: 1
            }]
        };
    }, [regularExpenses]);

    const chartOptions = useMemo(() => {
        const textColor = userProfile?.theme === 'light' ? '#000000' : '#FFFFFF';
        const gridColor = userProfile?.theme === 'light' ? '#e0e0e0' : '#444444';

        return {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
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
                        label: function (context) {
                            return `Spending Outlook: ${symbol}${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        };
    }, [userProfile?.theme]);

    if (loading) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Loading...</div></div></div>;
    if (error) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center"><div className="text-center"><p className="text-danger">Error loading expenses data</p><small className="text-muted">{error}</small></div></div></div></div>;

    return (
        <div className="col-md-4">
            <div id="item2" className="card h-100 shadow-sm">
                <div className="card-header">
                    <h5 className="card-title mb-0 text-primary">Monthly Spending</h5>
                </div>
                <div className="card-body">
                    <Chart type='bar' data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    )
}

export default Spending;