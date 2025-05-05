import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className="container2 w-100 h-100 px-5 justify-content-center align-items-center">
            <h2 className="text-center py-1 text-white">All your finacial planning needs in one place</h2>
            <div className="container-fluid ms-5">
                <div className="row justify-content-between ms-5">
                    <div className="col">
                        <Link to="/creditCards"><button className="btn btn-outline-light">Browse Credit Cards</button></Link>
                    </div>
                    <div className="col">
                        <Link to="/settings"><button className="btn btn-outline-light">Get Started Free</button></Link>
                    </div>
                    <div className="col">
                        <Link to="/authors"><button className="btn btn-outline-light">About Us</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero