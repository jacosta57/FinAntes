import React from 'react'

function CashFlow() {

    const incomeSources = JSON.parse(localStorage.getItem("incomeSources")) || [{amount: 0}];
    let totalIncome = 0;
    incomeSources.forEach(source => { totalIncome += source.amount });
    totalIncome = totalIncome.toFixed(2);

    const regularExpenses = JSON.parse(localStorage.getItem("regularExpenses")) || [{amount: 0}];
    let totalExpenses = 0;
    regularExpenses.forEach(source => { totalExpenses += source.amount });
    totalExpenses = totalExpenses.toFixed(2);

    const totalNet = (totalIncome - totalExpenses).toFixed(2);
    let netClass = totalNet > 0 ? 'text-success' : 'text-danger';
    netClass += ' fw-bold'
    

    return (
        <div className="col-md-4">
            <div id="item3" className="card h-100 shadow-sm">
                <div className="card-header">
                    <h5 className="card-title mb-0 text-primary">Cash Flow</h5>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                        <span>Income</span>
                        <span id="CashFlow-Income" className="text-success">${totalIncome}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <span>Expenses</span>
                        <span id="CashFlow-Expenses" className="text-danger">${totalExpenses}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="fw-bold">Net Flow</span>
                        <span id="CashFlow-Net" className={netClass}>${totalNet}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CashFlow