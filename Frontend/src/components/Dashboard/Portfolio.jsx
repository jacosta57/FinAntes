import React from 'react'
import { Line } from 'react-chartjs-2';

function Portfolio() {

    const investments = JSON.parse(localStorage.getItem("investments")) || [{ currentValue: 0, shares: 0}]
    let totalCurrentValue = 0;
    let totalBuyValue = 0;

    investments.forEach(investment => {
        totalCurrentValue += investment.currentValue * investment.shares;
        totalBuyValue += investment.purchaseValue * investment.shares;
    })

    let returnPercent;
    if (totalBuyValue > 0) {
        returnPercent = ((totalCurrentValue - totalBuyValue) / totalBuyValue * 100).toFixed(2);
    } else {
        returnPercent = "0.00";
    }

    const returnClass = returnPercent >= 0 ? "text-success" : "text-danger";


    const chartData = {
        labels: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'My First Dataset',
            data: [0, totalBuyValue, totalCurrentValue],
            fill: false,
            borderColor: totalCurrentValue > totalBuyValue ? 'green' : 'red',
            tension: 0.1
        }]
    }

    return (
        <div className="col-md-4">
            <div id="item4" className="card h-100 shadow-sm">
                <div className="card-header ">
                    <h5 className="card-title mb-0 text-primary">Investment Portfolio</h5>
                </div>
                <div className="card-body">
                    <Line data={chartData}/>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Total Portfolio</span>
                            <span >${totalCurrentValue}</span>
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