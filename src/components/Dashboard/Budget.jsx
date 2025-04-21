import React, { useState, useEffect, useContext } from 'react'
import { Chart as ChartJS } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { context } from 'themeContext';

function Budget() {

    const {theme} = useContext(context)
    let textColor;

    useEffect(() => {
      textColor = theme === 'light' ? '#000000' : '#FFFFFF'
    }, [theme]);

    const budgetCategories = JSON.parse(localStorage.getItem("budgetCategories")) || [];

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


    const chartData = {
            labels: spendingLabels,
            datasets: [{
                label: 'Monthly Budget',
                data: spendingData,
                backgroundColor: spendingColors,
                hoverOffset: 4
            }]
    };

    const chartOptions ={
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 8
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw || 0;
    
              const percentage = totalBudget > 0 ? Math.round((value / totalBudget) * 100) : 0;
    
              if (label === 'Remaining Budget') {
                return `${label}: $${value.toLocaleString()} (${percentage}% of budget)`;
              } else {
                const category = budgetCategories.find(cat => cat.name === label);
                if (category) {
                  const remaining = category.monthlyBudget - category.currentSpending;
                  const categoryPercentUsed = Math.round((category.currentSpending / category.monthlyBudget) * 100);
                  return `${label}: $${value.toLocaleString()} spent ($${remaining.toLocaleString()} remaining, ${categoryPercentUsed}% used)`;
                }
                return `${label}: $${value.toLocaleString()}`;
              }
            }
          }
        }
      },
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: true
    };

    const doughnutCenterText = {
      id: 'doughnutCenterText',
      beforeDraw: function(chart) {
        if (chart.config.type === 'doughnut') {
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;
          
          ctx.restore();
          
          const fontSize = (height / 280).toFixed(2) * 14;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          
          let percentUsed = 0;
          if (totalBudget > 0) {
            percentUsed = Math.round((totalSpending / totalBudget) * 100);
          }
          
          ctx.font = `bold ${fontSize * 1.2}px Arial`;
          ctx.fillStyle = textColor;
          ctx.fillText(`$${totalSpending.toLocaleString()}`, width / 2, height / 2 - 50);
          
          ctx.font = `${fontSize * 0.8}px Arial`;
          ctx.fillText('used', width / 2, height / 2 - 30);
          
          const remainingDisplay = budgetCategories.length === 0 && totalBudget === 1000 ? 
            'No budget data available' : 
            `$${remainingBudget.toLocaleString()} left (${percentUsed}% used)`;
          
          ctx.fillText(remainingDisplay, width / 2, height / 2 - 10);
          
          ctx.save();
        }
      }
    };

    useEffect(() => {
      ChartJS.register(doughnutCenterText);
    }, [theme]);


    return (
        <div className="col-md-4">
            <div id="item1" className="card h-100 shadow-sm">
                <div className="card-header">
                    <h5 className="card-title mb-0 text-primary">Budget</h5>
                </div>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <Doughnut data={chartData} options={chartOptions} redraw='false' />
                </div>
            </div>
        </div>
    )
}

export default Budget;