import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    zipCode: "",
    email: ""
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [cardError, setCardError] = useState("");
  const [zipError, setZipError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // This handles the credit card formating
    if (name === "cardNumber") {
      //value.replace(/\D/g, "") --> removes any non-digit characters
      //.slice --> sets the max to 16 digits
      const raw = value.replace(/\D/g, "").slice(0, 16); // max 16 digits
      //(\d{4}) --> selects every 4 digits
      //(?=\d) --> will check to see if there is at least one digit ahead
      //"$1-" --> Takes the 4 digits and puts a dash at the end
      const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1-");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    
    else if (name === "zipCode") {
      //value.replace(/\D/g, "") --> removes any non-digit characters
      const zip = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev) => ({ ...prev, [name]: zip }));
    } 
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { firstName, lastName, cardNumber, zipCode } = formData;
    const cardDigits = cardNumber.replace(/\D/g, "");

    const isCardValid = cardDigits.length === 15 || cardDigits.length === 16;
    const isZipValid = zipCode.length === 5;

    if (!isCardValid && cardDigits.length > 0) {
      setCardError("Credit card must be 15 or 16 digits.");
    } 
    else {
      setCardError("");
    }

    if (!isZipValid && zipCode.length > 0)
    {
      setZipError("Invalid. Requires 5 digits");
    }
    else{
      setZipError("");
    }


    const isValid =
      firstName.trim() &&
      lastName.trim() &&
      isCardValid &&
      isZipValid;
      

    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form submitted:", formData);
      setShowModal(true);
    }
  };

  const confirmPurchaseOnClick = () => {
    alert("Purchase Successful!");
    setShowModal(false);
    navigate("/Dashboard")
  };

  return (
    <div className="d-flex justify-content-center align-items-start vh-100 bg-light pt-3">
      <div className="card p-3 shadow" style={{ width: "40rem" }}>
        <div className="card-body">
          <h4 className="card-title mb-3">Payment Information</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} maxLength="50" required/>
            </div>
            <div className="mb-2">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} maxLength="75" required/>
            </div>
            <div className="mb-2">
              <label className="form-label">Credit Card Number</label>
              <input
                type="text"
                name="cardNumber"
                className="form-control"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
              {cardError && (
                <small className="text-danger">{cardError}</small>
              )}
            </div>
            <div className="mb-2">
              <label className="form-label">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                className="form-control"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
              {zipError && (
                <small className="text-danger">{zipError}</small>
              )}
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={!isFormValid}
            >
              Submit Payment
            </button>
          </form>

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-success">
                Confirm Version Switch
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Switch to Premium version?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={confirmPurchaseOnClick}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
