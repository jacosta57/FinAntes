import { useData } from 'DataContext';

function CashFlow() {
    const { incomeSources, regularExpenses, loading, error, symbol } = useData();

    if (loading) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Loading...</div></div></div>;
    if (error) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Error: {error}</div></div></div>;

    let totalIncome = 0;
    incomeSources.forEach(source => { totalIncome += source.amount });
    totalIncome = totalIncome.toFixed(2);

    let totalExpenses = 0;
    regularExpenses.forEach(source => { totalExpenses += source.amount });
    totalExpenses = totalExpenses.toFixed(2);

    const totalNet = (totalIncome - totalExpenses).toFixed(2);
    let netClass = totalNet > 0 ? 'text-success' : 'text-danger';
    netClass += ' fw-bold';

    return (
        <div className="col-md-4">
            <div id="item3" className="card h-100 shadow-sm">
                <div className="card-header">
                    <h5 className="card-title mb-0 text-primary">Cash Flow</h5>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                        <span>Income</span>
                        <span id="CashFlow-Income" className="text-success">{symbol}{totalIncome}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <span>Expenses</span>
                        <span id="CashFlow-Expenses" className="text-danger">{symbol}{totalExpenses}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="fw-bold">Net Flow</span>
                        <span id="CashFlow-Net" className={netClass}>{symbol}{totalNet}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CashFlow