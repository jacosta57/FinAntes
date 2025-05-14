import Budget from "components/Demo/Budget";
import CashFlow from "components/Demo/CashFlow";
import Spending from "components/Demo/Spending";
import Portfolio from 'components/Demo/Portfolio';
import Goals from 'components/Demo/Goals';
import Expenses from "components/Demo/Expenses";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, PointElement, LineElement } from 'chart.js';

function Dashboard() {
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'light' ? '#000000' : '#FFFFFF';

    ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, PointElement, LineElement);
    ChartJS.defaults.color = textColor;

    return (
        <>
            <div className="container-fluid py-4">
                <div className="row g-4 mb-4">
                    <Budget />
                    <Spending />
                    <CashFlow />
                </div>
                <div className="row g-4">
                    <Portfolio />
                    <Goals />
                    <Expenses />
                </div>
            </div>
        </>
    )
}

export default Dashboard;