import React, { useState, useEffect } from 'react';

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [selectedInvestmentIndex, setSelectedInvestmentIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock',
    currentValue: '',
    purchaseValue: '',
    shares: ''
  });
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    totalReturn: 0,
    totalReturnPercent: 0
  });

  useEffect(() => {
    const loadedInvestments = JSON.parse(localStorage.getItem("investments") || "[]");
    setInvestments(loadedInvestments);
  }, []);

  useEffect(() => {
    updatePortfolioSummary();
  }, [investments]);

  const updatePortfolioSummary = () => {
    if (investments.length === 0) {
      setPortfolioSummary({
        totalValue: 0,
        totalReturn: 0,
        totalReturnPercent: 0
      });
      return;
    }

    let totalCurrentValue = 0;
    let totalOriginalValue = 0;

    investments.forEach(investment => {
      const shares = parseFloat(investment.shares) || 1;
      const currentValuePerShare = parseFloat(investment.currentValue);
      const purchaseValuePerShare = parseFloat(investment.purchaseValue);

      const totalInvestmentValue = shares * currentValuePerShare;
      const totalPurchaseValue = shares * purchaseValuePerShare;

      totalCurrentValue += totalInvestmentValue;
      totalOriginalValue += totalPurchaseValue;
    });

    const totalReturn = totalCurrentValue - totalOriginalValue;
    const totalReturnPercent = totalOriginalValue > 0 ?
      (totalReturn / totalOriginalValue * 100).toFixed(2) : "0.00";

    setPortfolioSummary({
      totalValue: totalCurrentValue,
      totalReturn: totalReturn,
      totalReturnPercent: totalReturnPercent
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const selectInvestment = (index) => {
    const investment = investments[index];

    if (!investment) return;

    setFormData({
      name: investment.name,
      type: investment.type,
      currentValue: investment.currentValue,
      purchaseValue: investment.purchaseValue,
      shares: investment.shares
    });

    setSelectedInvestmentIndex(index);
  };

  const handleAddInvestment = () => {
    setFormData({
      name: '',
      type: 'stock',
      currentValue: '',
      purchaseValue: '',
      shares: ''
    });

    setSelectedInvestmentIndex(null);
  };

  const handleSaveInvestment = (e) => {
    e.preventDefault();

    const investmentData = {
      name: formData.name,
      type: formData.type,
      currentValue: parseFloat(formData.currentValue),
      purchaseValue: parseFloat(formData.purchaseValue),
      shares: parseFloat(formData.shares)
    };

    if (!investmentData.name) {
      alert("Please enter an investment name.");
      return;
    }

    if (isNaN(investmentData.currentValue) || investmentData.currentValue <= 0) {
      alert("Please enter a valid current value.");
      return;
    }

    if (isNaN(investmentData.purchaseValue) || investmentData.purchaseValue <= 0) {
      alert("Please enter a valid purchase value.");
      return;
    }

    const newInvestments = [...investments];

    if (selectedInvestmentIndex !== null) {
      newInvestments[selectedInvestmentIndex] = investmentData;
    } else {
      newInvestments.push(investmentData);
    }

    setInvestments(newInvestments);
    localStorage.setItem("investments", JSON.stringify(newInvestments));

    handleAddInvestment();
  };

  const handleDeleteInvestment = () => {
    if (selectedInvestmentIndex === null) return;

    if (window.confirm("Are you sure you want to delete this investment?")) {
      const newInvestments = [...investments];
      newInvestments.splice(selectedInvestmentIndex, 1);

      setInvestments(newInvestments);
      localStorage.setItem("investments", JSON.stringify(newInvestments));

      handleAddInvestment();
    }
  };

  return (
    <>
      <h3 className="mb-4 text-primary">Investment Portfolio</h3>

      <div className="row g-4">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header">Portfolio Summary</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-muted">Total Value</span>
                    <span className="fs-4 fw-bold">${portfolioSummary.totalValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-muted">Total Return</span>
                    <span className={`fs-4 ${portfolioSummary.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
                      {portfolioSummary.totalReturn >= 0 ? '+' : '-'}${Math.abs(portfolioSummary.totalReturn).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-muted">Return %</span>
                    <span className={`fs-4 ${portfolioSummary.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
                      {portfolioSummary.totalReturn >= 0 ? '+' : '-'}{Math.abs(portfolioSummary.totalReturnPercent)}%
                    </span>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-muted">Total Investments</span>
                    <span className="fs-4">{investments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card h-100">
            <div className="card-header">Investments</div>
            <div className="card-body">
              <div className="list-group">
                {investments.length === 0 ? (
                  <div className="list-group-item text-center text-muted">No investments added yet.</div>
                ) : (
                  investments.map((investment, index) => {
                    const shares = parseFloat(investment.shares) || 1;
                    const currentValuePerShare = parseFloat(investment.currentValue);
                    const purchaseValuePerShare = parseFloat(investment.purchaseValue);

                    const totalInvestmentValue = shares * currentValuePerShare;
                    const totalPurchaseValue = shares * purchaseValuePerShare;

                    const returnAmount = totalInvestmentValue - totalPurchaseValue;
                    const returnPercent = totalPurchaseValue > 0 ?
                      (returnAmount / totalPurchaseValue * 100).toFixed(2) : "0.00";
                    const returnClass = returnAmount >= 0 ? "text-success" : "text-danger";

                    return (
                      <a href="#" className="list-group-item list-group-item-action" key={index} onClick={(e) => { e.preventDefault(); selectInvestment(index); }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">{investment.name}</h6>
                            <small className="text-muted">{investment.type} - {shares} shares @ ${currentValuePerShare.toFixed(2)}</small>
                          </div>
                          <div className="text-end">
                            <div>${totalInvestmentValue.toFixed(2)}</div>
                            <small className={returnClass}>{returnAmount >= 0 ? '+' : ''}{returnPercent}%</small>
                          </div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
              <button className="btn btn-primary mt-3 w-100" onClick={handleAddInvestment}>Add Investment</button>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-header">Investment Details</div>
            <div className="card-body">
              <form onSubmit={handleSaveInvestment}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name/Symbol</label>
                  <input id="name" autoComplete='off' type="text" className="form-control" placeholder="e.g., AAPL, Bitcoin, 401k" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Type</label>
                  <select id="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                    <option value="stock">Stock</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="etf">ETF</option>
                    <option value="mutual">Mutual Fund</option>
                    <option value="retirement">Retirement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="shares" className="form-label">Number of Shares/Units</label>
                  <input id="shares" type="number" className="form-control" placeholder="0" min="0" step="any" value={formData.shares} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="currentValue" className="form-label">Current Value</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input id="currentValue" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.currentValue} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="purchaseValue" className="form-label">Purchase Value</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input id="purchaseValue" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.purchaseValue} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">Save Investment</button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteInvestment} disabled={selectedInvestmentIndex === null}>Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Investments;