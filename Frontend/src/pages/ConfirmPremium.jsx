import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/images/confirmationBg.jpg';

function ConfirmPremium() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light pt-5"
    style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
         }}
    
    
    >
        
        <div className="text-center p-5 rounded shadow bg-white" style={{ width: "40rem" }}>
            <h2 className="text-success mb-3">Purchase Confirmed!</h2>
            <p className="fs-5">Enjoy your Premium benefits!</p>
            <Button variant="success" onClick={handleBackToDashboard} className="mt-3">
                Go to Dashboard
            </Button>
        </div>
    </div>
  );
}

export default ConfirmPremium;
