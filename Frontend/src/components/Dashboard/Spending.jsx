import React from 'react'
import { Chart } from 'react-chartjs-2';

function Expenses() {
    const regularExpenses = JSON.parse(localStorage.getItem("regularExpenses")) || [];
    const weeklySpendings = [0, 0, 0, 0];

    regularExpenses.forEach(expense => {
        const amount = expense.amount;

        switch (expense.frequency.toLowerCase()) {
            case 'weekly':
                // Add to each week
                weeklySpendings[0] += amount;
                weeklySpendings[1] += amount;
                weeklySpendings[2] += amount;
                weeklySpendings[3] += amount;
                break;

            case 'bi-weekly':
                // Add to second and fourth weeks
                weeklySpendings[1] += amount;
                weeklySpendings[3] += amount;
                break;

            case 'annually':
                // Divide by 12 and add to first week
                weeklySpendings[0] += amount / 12;
                break;

            case 'monthly':
            default:
                // Add to first week
                weeklySpendings[0] += amount;
        }
    });

    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Spending Outlook',
            data: weeklySpendings,
            backgroundColor: '#36a2eb',
            borderColor: '#1e88e5',
            borderWidth: 1
        }]
    }

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return 'Spending Outlook: $' + context.raw.toLocaleString();
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true
    }

    return (
        <div className="col-md-4">
            <div id="item2" className="card h-100 shadow-sm">
                <div className="card-header">
                    <h5 className="card-title mb-0 text-primary">Monthly Spending</h5>
                </div>
                <div className="card-body">
                    <Chart type='bar' data={chartData} options={chartOptions} redraw='false' />
                </div>
            </div>
        </div>


    )
}

export default Expenses