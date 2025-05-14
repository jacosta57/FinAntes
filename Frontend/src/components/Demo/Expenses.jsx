import { useState, useEffect } from "react";

// Constant data moved outside component to prevent recreation on each render
const upcomingExpenses = [
    { name: 'Rent', amount: 1500, dueDate: '2025-05-25', isRecurring: true },
    { name: 'Credit Card Payment', amount: 300, dueDate: '2025-05-20', isRecurring: true },
    { name: 'Insurance Premium', amount: 250, dueDate: '2025-05-15', isRecurring: false },
    { name: 'Phone Bill', amount: 80, dueDate: '2025-05-18', isRecurring: true },
    { name: 'Internet Bill', amount: 100, dueDate: '2025-05-22', isRecurring: true }
];

function Expenses() {
    const loading = false;
    const error = null;
    const symbol = '$';
    
    const [sortedExpenses, setSortedExpenses] = useState([]);

    useEffect(() => {
        const sorted = [...upcomingExpenses].sort((a, b) => { return new Date(a.dueDate) - new Date(b.dueDate); });
        setSortedExpenses(sorted);
    }, []); // Empty dependency array since upcomingExpenses is now constant

    if (loading) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Loading...</div></div></div>;
    if (error) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Error: {error}</div></div></div>;

    let expenseElement = <p className="text-center text-muted">No upcoming expenses to display.</p>

    return (
        <div className="col-md-4">
            <div id="item6" className="card h-100 shadow-sm">
                <div className="card-header ">
                    <h5 className="card-title mb-0 text-primary">Upcoming Expenses</h5>
                </div>
                <div className="card-body">
                    {sortedExpenses.length === 0 ? expenseElement : sortedExpenses.map((expense, index) => {
                        let expenseElementClassName = "mb-3 p-2 border-bottom";

                        const dueDate = new Date(expense.dueDate);
                        const today = new Date();
                        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

                        let urgencyClass = "text-success";
                        if (daysUntilDue <= 0) { urgencyClass = "text-danger" }
                        else if (daysUntilDue <= 7) { urgencyClass = "text-warning" }

                        const userTimezoneOffset = dueDate.getTimezoneOffset() * 60000;
                        const adjustedDate = new Date(dueDate.getTime() + userTimezoneOffset);
                        const formattedDate = adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                        let recurringBadge = "badge rounded-pill "
                        recurringBadge += expense.isRecurring ? 'bg-info' : 'bg-secondary';

                        return (
                            <div className={expenseElementClassName} key={index}>
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold">{expense.name}</span>
                                    <span className={recurringBadge}>
                                        {expense.isRecurring ? 'Recurring' : 'One-time'}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <span>{symbol}{expense.amount.toLocaleString()}</span>
                                    <span className={urgencyClass}>Due: {formattedDate}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Expenses