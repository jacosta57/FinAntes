import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function Tiers() {
    const [activeModal, setActiveModal] = useState(null);
    const [confirmChecked, setConfirmChecked] = useState(false);
    const navigate = useNavigate();

    const confirmSwitchOnClick = (tier) => {
        alert(`You have switched to the ${tier} version`);

        setConfirmChecked(false);
        setActiveModal(null);
    };

    return (
        <div id="tiers-section" className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
            <h3 className="mb-4 text-primary">Tiers</h3>

            <div className="card mb-4">
                <div className="card-header text-success">Demo FREE</div>
                <div className="card-body">
                    <p className="text-muted mb-3">Features for this tier:</p>
                    <ul className="mb-3">
                        <li>View Sample Dashboard</li>
                        <li>Basic Features Demo</li>
                        <li>Example Reports</li>
                    </ul>
                    <button className="btn btn-success" onClick={() => setActiveModal("demo")}>Switch to Demo</button>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header text-success">Basic FREE</div>
                <div className="card-body">
                    <p className="text-muted mb-3">Features for this tier:</p>
                    <ul className="mb-3">
                        <li>Full Budget Planning</li>
                        <li>Investment Tracking</li>
                        <li>CSV Import/Export</li>

                    </ul>
                    <button className="btn btn-success" onClick={() => setActiveModal("basic")}>Switch to Basic</button>
                </div>
            </div>

            <div className="card">
                <div className="card-header text-success">Premium $9.99</div>
                <div className="card-body">
                    <p className="text-muted mb-3">Features for this tier:</p>
                    <ul className="mb-3">
                        <li>Real-time Market Data</li>
                        <li>Advanced Analytics</li>
                        <li>Custom Themes</li>
                    </ul>
                    <button className="btn btn-success" onClick={() => setActiveModal("premium")}>Switch to Premium</button>
                </div>
            </div>
            <Modal show={activeModal === "demo"} onHide={() => setActiveModal(null)} id="demoModal" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">
                        Confirm Version Switch
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Go to Demo version?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button variant="success" onClick={() => navigate('/demo')}>Switch</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={activeModal === "basic"} onHide={() => setActiveModal(null)} id="basicModal" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">
                        Confirm Version Switch
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Switch to Basic version?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button variant="success" onClick={() => confirmSwitchOnClick('basic')}>Switch</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={activeModal === "premium"} onHide={() => setActiveModal(null)} id="premiumModal" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">
                        Confirm Version Switch
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Switch to Premium version?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button variant="success" onClick={() => confirmSwitchOnClick('premium')}>Switch</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Tiers;