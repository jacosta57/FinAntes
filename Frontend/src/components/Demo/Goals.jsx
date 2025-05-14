function Goals() {
    const financialGoals = [
        { 
            _id: 'goal1',
            name: 'Emergency Fund', 
            currentAmount: 5000, 
            targetAmount: 10000, 
            targetDate: '2025-12-31' 
        },
        { 
            _id: 'goal2',
            name: 'Vacation', 
            currentAmount: 2500, 
            targetAmount: 5000, 
            targetDate: '2025-07-01' 
        },
        { 
            _id: 'goal3',
            name: 'New Car', 
            currentAmount: 8000, 
            targetAmount: 25000, 
            targetDate: '2026-06-30' 
        }
    ];
    
    const loading = false;
    const error = null;
    const symbol = '$';

    if (loading) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center">Loading...</div></div></div>;
    if (error) return <div className="col-md-4"><div className="card h-100 shadow-sm"><div className="card-body d-flex justify-content-center align-items-center"><div className="text-center"><p className="text-danger">Error loading goals data</p><small className="text-muted">{error}</small></div></div></div></div>;

    let goalsElement = <p className="text-center text-muted mb-3">No financial goals added yet.</p>

    return (
        <div className="col-md-4">
            <div id="item5" className="card h-100 shadow-sm">
                <div className="card-header ">
                    <h5 className="card-title mb-0 text-primary">Financial Goals</h5>
                </div>
                <div className="card-body">
                    {(financialGoals.length === 0) ? goalsElement : financialGoals.map((goal, index) => {
                        const progressPercent = (goal.currentAmount / goal.targetAmount * 100).toFixed(0);

                        const targetDate = new Date(goal.targetDate);
                        const today = new Date();
                        const timeRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

                        const monthsRemaining = Math.max(0,
                            (targetDate.getFullYear() - today.getFullYear()) * 12 +
                            (targetDate.getMonth() - today.getMonth())
                        );
                        const amountNeeded = goal.targetAmount - goal.currentAmount;
                        const monthlyContribution = monthsRemaining > 0 ?
                            (amountNeeded / monthsRemaining).toFixed(2) : 0;

                        return (
                            <div className='mb-3' key={goal._id || index}>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>{goal.name}</span>
                                    <span>{symbol}{goal.currentAmount.toLocaleString()} / {symbol}{goal.targetAmount.toLocaleString()}</span>
                                </div>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: progressPercent + "%" }} aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">{progressPercent}%</div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">
                                        {monthlyContribution > 0 ? `${symbol}${monthlyContribution}/month needed` : 'Goal reached!'}
                                    </small>
                                    <small className="text-muted">
                                        {timeRemaining > 0 ? timeRemaining + ' days remaining' : 'Target date passed'}
                                    </small>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Goals