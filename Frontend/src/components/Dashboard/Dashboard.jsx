import Budget from "./Budget";
import CashFlow from "./CashFlow";
import Spending from "./Spending";
import Portfolio from './Portfolio';
import Goals from './Goals';
import Expenses from "./Expenses";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, PointElement, LineElement} from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, PointElement, LineElement);
let textColor = localStorage.getItem('theme') === 'light' ? '000' : 'FFF';

ChartJS.defaults.color = textColor;

function Dashboard() {
    return (
        <>
            <div id="DashboardContainer" className="container-fluid py-4">
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