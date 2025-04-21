import React from 'react'

function Goals() {

    const financialGoals = JSON.parse(localStorage.getItem("financialGoals"));
    let goalsElement = <p className="text-center text-muted mb-3">No financial goals added yet.</p>

    if (financialGoals && financialGoals.length > 0) {
        financialGoals.forEach(goal => {
            // Calculate progress percentage
            const progressPercent = (goal.currentAmount / goal.targetAmount * 100).toFixed(0);

            // Calculate time remaining
            const targetDate = new Date(goal.targetDate);
            const today = new Date();
            const timeRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)); // days

            // Format goal information
            goalsElement = (
                <div className= 'mb-3'>
                    <div className="d-flex justify-content-between mb-1">
                        <span>{goal.name}</span>
                        <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{width: progressPercent + "%"}}
                            aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">{progressPercent}%</div>
                    </div>
                    <div className="text-end mt-1">
                        <small>{timeRemaining > 0 ? timeRemaining + ' days remaining' : 'Target date passed'}</small>
                    </div>
                </div>
            );
        });
    }


    return (
        <div className="col-md-4">
            <div id="item5" className="card h-100 shadow-sm">
                <div className="card-header ">
                    <h5 className="card-title mb-0 text-primary">Financial Goals</h5>
                </div>
                <div className="card-body">
                    {goalsElement}
                </div>
            </div>
        </div>
    )
}

export default Goals