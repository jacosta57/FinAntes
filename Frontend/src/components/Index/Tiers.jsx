import React from 'react'
import { Link } from 'react-router-dom';

function Tiers() {
  return (
    <div id="Tiers" className="container py-5 my-5">
        <div className="row g-4">
            <div className="col-md-4">
                <div className="card h-100 w-75">
                    <h2 className="card-header">Demo</h2>
                    <div className="card-body d-flex flex-column align-items-center">
                        <br />
                        <ul>
                            <li>View Sample Dashboard</li>
                            <li>Basic Features Demo</li>
                            <li>Example Reports</li>
                        </ul>

                        <Link to="/demo" className="w-100"><button className="btn btn-outline-light demobtn">Try Demo</button></Link>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card h-100 w-75">
                    <h2 className="card-header">
                        Basic
                    </h2>
                    <h4 className="d-flex justify-content-center my-2">$0</h4>
                    <div className="card-body d-flex flex-column align-items-center">
                        <ul>
                            <li>Full Budget Planning</li>
                            <li>Investment Tracking</li>
                            <li>CSV Import/Export</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card h-100 w-75">
                    <h2 className="card-header">
                        Premium
                    </h2>
                    <h4 className="d-flex justify-content-center my-2">$9.99</h4>
                    <div className="card-body d-flex flex-column align-items-center">
                        <ul>
                            <li>Real-time Market Data</li>
                            <li>Advanced Analytics</li>
                            <li>Custom Themes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Tiers