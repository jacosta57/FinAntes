function Dashboard() {
    return (
        <>
            <div id="DashboardContainer" class="container-fluid py-4">
                <div class="row g-4 mb-4">
                    <div class="col-md-4">
                        <div id="item1" class="card h-100 shadow-sm">
                            <div class="card-header">
                                <h5 class="card-title mb-0 text-primary">Budget Overview</h5>
                            </div>
                            <div class="card-body d-flex flex-column align-items-center justify-content-center">
                                <canvas id="DoughnutChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div id="item2" class="card h-100 shadow-sm">
                            <div class="card-header">
                                <h5 class="card-title mb-0 text-primary">Monthly Spending</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="BarChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div id="item3" class="card h-100 shadow-sm">
                            <div class="card-header">
                                <h5 class="card-title mb-0 text-primary">Cash Flow</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-3">
                                    <span>Income</span>
                                    <span id="CashFlow-Income" class="text-success">$0</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span>Expenses</span>
                                    <span id="CashFlow-Expenses" class="text-danger">$0</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="fw-bold">Net Flow</span>
                                    <span id="CashFlow-Net" class="text-success fw-bold">+$0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-md-4">
                        <div id="item4" class="card h-100 shadow-sm">
                            <div class="card-header ">
                                <h5 class="card-title mb-0 text-primary">Investment Portfolio</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="LineChart"></canvas>
                                <div class="mt-3">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Total Portfolio</span>
                                        <span id="Investment-Total">$0</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <span>This Month</span>
                                        <span id="Investment-Percent">0%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div id="item5" class="card h-100 shadow-sm">
                            <div class="card-header ">
                                <h5 class="card-title mb-0 text-primary">Financial Goals</h5>
                            </div>
                            <div class="card-body">

                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div id="item6" class="card h-100 shadow-sm">
                            <div class="card-header ">
                                <h5 class="card-title mb-0 text-primary">Upcoming Expenses</h5>
                            </div>
                            <div class="card-body">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;