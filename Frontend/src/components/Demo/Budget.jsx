import React, { useEffect, useMemo } from 'react'
import { Chart as ChartJS } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

function Budget() {
  const budgetCategories = [
    { name: 'Groceries', monthlyBudget: 500, currentSpending: 350 },
    { name: 'Transportation', monthlyBudget: 200, currentSpending: 150 },
    { name: 'Entertainment', monthlyBudget: 150, currentSpending: 120 },
    { name: 'Utilities', monthlyBudget: 300, currentSpending: 280 },
    { name: 'Healthcare', monthlyBudget: 100, currentSpending: 50 }
  ];
  
  const symbol = '$';
  const loading = false;
  const error = null;

  useEffect(() => {
    const doughnutCenterText = {
      id: 'doughnutCenterText',
      beforeDraw: function (chart) {
        if (chart.config.type === 'doughnut') {
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;

          ctx.restore();

          const fontSize = (height / 280).toFixed(2) * 14;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';

          const chartInstance = chart;
          const data = chartInstance.data;
          const dataset = data.datasets[0];
          const dataPoints = dataset.data;

          let totalSpending = 0;
          let totalBudget = 0;

          for (let i = 1; i < dataPoints.length; i++) {
            totalSpending += dataPoints[i];
          }

          totalBudget = dataPoints[0] + totalSpending;

          let percentUsed = 0;
          if (totalBudget > 0) {
            percentUsed = Math.round((totalSpending / totalBudget) * 100);
          }

          const theme = document.documentElement.getAttribute('data-theme');
          const textColor = theme === 'light' ? '#000000' : '#FFFFFF';

          ctx.font = `bold ${fontSize * 1.2}px Arial`;
          ctx.fillStyle = textColor;
          ctx.fillText(`${symbol}${totalSpending.toLocaleString()}`, width / 2, height / 2 - 50);

          ctx.font = `${fontSize * 0.8}px Arial`;
          ctx.fillText('used', width / 2, height / 2 - 30);

          const remainingBudget = totalBudget - totalSpending;
          const remainingDisplay = totalBudget === 1000 && dataPoints.length === 1 ?
            'No budget data available' :
            `${symbol}${remainingBudget.toLocaleString()} left (${percentUsed}% used)`;

          ctx.fillText(remainingDisplay, width / 2, height / 2 - 10);

          ctx.save();
        }
      }
    };

    ChartJS.register(doughnutCenterText);

    return () => {
      ChartJS.unregister(doughnutCenterText);
    };
  }, [symbol, budgetCategories]);

  const { chartData, chartOptions } = useMemo(() => {
    let totalBudget = 0;
    let totalSpending = 0;
    const spendingData = [];
    const spendingLabels = [];
    const spendingColors = [
      '#ff6384', // Pink
      '#ffcd56', // Yellow
      '#36a2eb', // Blue
      '#9966ff', // Purple
      '#ff9f40', // Orange
      '#c9cbcf'  // Gray
    ];

    if (budgetCategories && budgetCategories.length > 0) {
      budgetCategories.forEach((category, index) => {
        totalBudget += category.monthlyBudget;
        totalSpending += category.currentSpending;

        spendingData.push(category.currentSpending);
        spendingLabels.push(category.name);
      });
    }

    const remainingBudget = totalBudget - totalSpending;

    if (budgetCategories.length === 0 || totalBudget === 0) {
      spendingData.push(1000);
      spendingLabels.push('Remaining Budget');
      totalBudget = 1000;
    } else {
      spendingData.unshift(remainingBudget);
      spendingLabels.unshift('Remaining Budget');
    }

    spendingColors.unshift('#28a745');

    const data = {
      labels: spendingLabels,
      datasets: [{
        label: 'Monthly Budget',
        data: spendingData,
        backgroundColor: spendingColors,
        hoverOffset: 4
      }]
    };

    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'light' ? '#000000' : '#FFFFFF';

    const options = {
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 8,
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw || 0;

              const percentage = totalBudget > 0 ? Math.round((value / totalBudget) * 100) : 0;

              if (label === 'Remaining Budget') {
                return `${label}: ${symbol}${value.toLocaleString()} (${percentage}% of budget)`;
              } else {
                const category = budgetCategories.find(cat => cat.name === label);
                if (category) {
                  const remaining = category.monthlyBudget - category.currentSpending;
                  return `${label}: ${symbol}${value.toLocaleString()} spent, ${symbol}${remaining.toLocaleString()} remaining`;
                }
                return `${label}: ${symbol}${value.toLocaleString()}`;
              }
            }
          }
        }
      },
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: true
    };

    return { chartData: data, chartOptions: options };
  }, [budgetCategories]);

  if (loading) {
    return (
      <div className="col-md-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex justify-content-center align-items-center">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-md-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="text-center">
              <p className="text-danger">Error loading budget data</p>
              <small className="text-muted">{error}</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-4">
      <div id="item1" className="card h-100 shadow-sm">
        <div className="card-header">
          <h5 className="card-title mb-0 text-primary">Budget</h5>
        </div>
        <div className="card-body d-flex flex-column align-items-center justify-content-center">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Budget;