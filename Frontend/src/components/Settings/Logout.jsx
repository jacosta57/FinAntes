import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'AuthContext';

function Logout() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        navigate('/');
        return;
      }
      throw new Error()
    } catch (error) {
      console.error('Logout error:', error);
      alert('There was an error logging out. Please try again.');
    }
    setShowModal(false);
  };

  return (
    <div id="logout-section" className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
      <h3 className="mb-4 text-primary">Logout</h3>

      <div className="card mb-4">
        <div className="card-header">Session Management</div>
        <div className="card-body">
          <div className="mb-4">
            <h5 className="mb-3">End Current Session</h5>
            <p className="text-muted mb-3">
              Logging out will end your current session and return you to the home page.
              You'll need to sign in again to access your financial data.
            </p>
            <button
              className="btn btn-danger"
              onClick={() => setShowModal(true)}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Account Security</div>
        <div className="card-body">
          <p className="text-muted mb-3">Security recommendations:</p>
          <ul className="mb-3">
            <li>Always logout when using shared devices</li>
            <li>Enable two-factor authentication for additional security</li>
            <li>Regularly update your password</li>
            <li>Check your account for any suspicious activity</li>
          </ul>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to log out of your FinAntes account?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Logout;