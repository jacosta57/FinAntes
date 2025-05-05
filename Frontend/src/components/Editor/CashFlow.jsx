import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function CashFlow() {
  const [incomeSources, setIncomeSources] = useState([]);
  const [regularExpenses, setRegularExpenses] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedIncomeIndex, setSelectedIncomeIndex] = useState(null);
  const [selectedExpenseIndex, setSelectedExpenseIndex] = useState(null);
  const [incomeForm, setIncomeForm] = useState({
    name: '',
    amount: '',
    frequency: 'Monthly'
  });
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    amount: '',
    frequency: 'Monthly'
  });
  const [cashFlowSummary, setCashFlowSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0
  });

  useEffect(() => {
    const loadedIncomeSources = JSON.parse(localStorage.getItem("incomeSources") || "[]");
    const loadedRegularExpenses = JSON.parse(localStorage.getItem("regularExpenses") || "[]");
    setIncomeSources(loadedIncomeSources);
    setRegularExpenses(loadedRegularExpenses);
  }, []);

  useEffect(() => {
    updateCashFlowSummary();
  }, [incomeSources, regularExpenses]);

  const updateCashFlowSummary = () => {
    const totalIncome = incomeSources.reduce((sum, source) => {
      const amount = parseFloat(source.amount);
      if (isNaN(amount)) return sum;
      
      switch(source.frequency) {
        case 'Weekly': return sum + (amount * 4);
        case 'Bi-weekly': return sum + (amount * 2);
        case 'Annually': return sum + (amount / 12);
        default: return sum + amount; 
      }
    }, 0);
    
    const totalExpenses = regularExpenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount);
      if (isNaN(amount)) return sum;
      
      switch(expense.frequency) {
        case 'Weekly': return sum + (amount * 4);
        case 'Bi-weekly': return sum + (amount * 2);
        case 'Annually': return sum + (amount / 12);
        default: return sum + amount;
      }
    }, 0);
    
    const netCashFlow = totalIncome - totalExpenses;
    
    setCashFlowSummary({
      totalIncome,
      totalExpenses,
      netCashFlow
    });
  };

  const handleAddIncome = () => {
    setIncomeForm({
      name: '',
      amount: '',
      frequency: 'Monthly'
    });
    setSelectedIncomeIndex(null);
    setShowIncomeModal(true);
  };

  const handleIncomeClick = (index) => {
    const source = incomeSources[index];
    setIncomeForm({
      name: source.name,
      amount: source.amount,
      frequency: source.frequency
    });
    setSelectedIncomeIndex(index);
    setShowIncomeModal(true);
  };

  const handleIncomeInputChange = (e) => {
    const { id, value } = e.target;
    setIncomeForm({
      ...incomeForm,
      [id.replace('income', '').toLowerCase()]: value
    });
  };

  const handleSaveIncome = () => {
    const { name, amount, frequency } = incomeForm;
    
    if (!name) {
      alert('Please enter an income source name.');
      return;
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    const newSources = [...incomeSources];
    
    if (selectedIncomeIndex !== null) {
      newSources[selectedIncomeIndex] = { name, amount: parseFloat(amount), frequency };
    } else {
      newSources.push({ name, amount: parseFloat(amount), frequency });
    }
    
    setIncomeSources(newSources);
    localStorage.setItem('incomeSources', JSON.stringify(newSources));
    setShowIncomeModal(false);
  };

  const handleDeleteIncome = () => {
    if (window.confirm('Are you sure you want to delete this income source?')) {
      const newSources = [...incomeSources];
      newSources.splice(selectedIncomeIndex, 1);
      setIncomeSources(newSources);
      localStorage.setItem('incomeSources', JSON.stringify(newSources));
      setShowIncomeModal(false);
    }
  };

  const handleAddExpense = () => {
    setExpenseForm({
      name: '',
      amount: '',
      frequency: 'Monthly'
    });
    setSelectedExpenseIndex(null);
    setShowExpenseModal(true);
  };

  const handleExpenseClick = (index) => {
    const expense = regularExpenses[index];
    setExpenseForm({
      name: expense.name,
      amount: expense.amount,
      frequency: expense.frequency
    });
    setSelectedExpenseIndex(index);
    setShowExpenseModal(true);
  };

  const handleExpenseInputChange = (e) => {
    const { id, value } = e.target;
    setExpenseForm({
      ...expenseForm,
      [id.replace('regularExpense', '').replace('expense', '').toLowerCase()]: value
    });
  };

  const handleSaveExpense = () => {
    const { name, amount, frequency } = expenseForm;
    
    if (!name) {
      alert('Please enter an expense name.');
      return;
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    const newExpenses = [...regularExpenses];
    
    if (selectedExpenseIndex !== null) {
      newExpenses[selectedExpenseIndex] = { name, amount: parseFloat(amount), frequency };
    } else {
      newExpenses.push({ name, amount: parseFloat(amount), frequency });
    }
    
    setRegularExpenses(newExpenses);
    localStorage.setItem('regularExpenses', JSON.stringify(newExpenses));
    setShowExpenseModal(false);
  };

  const handleDeleteExpense = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const newExpenses = [...regularExpenses];
      newExpenses.splice(selectedExpenseIndex, 1);
      setRegularExpenses(newExpenses);
      localStorage.setItem('regularExpenses', JSON.stringify(newExpenses));
      setShowExpenseModal(false);
    }
  };

  return (
    <div id="cashflow-section" className="finances-content">
      <h3 className="mb-4 text-primary">Cash Flow Management</h3>
      
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Income Sources</div>
            <div className="card-body">
              <div className="list-group mb-3">
                {incomeSources.length === 0 ? (
                  <div className="list-group-item text-center text-muted">No income sources added yet.</div>
                ) : (
                  incomeSources.map((source, index) => (
                    <a href="#" className="list-group-item list-group-item-action" key={index} onClick={(e) => { e.preventDefault(); handleIncomeClick(index); }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{source.name}</h6>
                          <small className="text-muted">{source.frequency}</small>
                        </div>
                        <span className="text-success">${source.amount}</span>
                      </div>
                    </a>
                  ))
                )}
              </div>
              <button className="btn btn-success w-100" onClick={handleAddIncome}>Add Income Source</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Regular Expenses</div>
            <div className="card-body">
              <div className="list-group mb-3">
                {regularExpenses.length === 0 ? (
                  <div className="list-group-item text-center text-muted">No regular expenses added yet.</div>
                ) : (
                  regularExpenses.map((expense, index) => (
                    <a href="#" className="list-group-item list-group-item-action" key={index} onClick={(e) => { e.preventDefault(); handleExpenseClick(index); }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{expense.name}</h6>
                          <small className="text-muted">{expense.frequency}</small>
                        </div>
                        <span className="text-danger">${expense.amount}</span>
                      </div>
                    </a>
                  ))
                )}
              </div>
              <button className="btn btn-danger w-100" onClick={handleAddExpense}>Add Expense</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">Cash Flow Summary</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Income:</span>
                <span className="text-success">${cashFlowSummary.totalIncome.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Expenses:</span>
                <span className="text-danger">${cashFlowSummary.totalExpenses.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between mb-2 fw-bold">
                <span>Net Cash Flow:</span>
                <span className={cashFlowSummary.netCashFlow > 0 ? "text-success" : cashFlowSummary.netCashFlow < 0 ? "text-danger" : ""}>
                  ${cashFlowSummary.netCashFlow.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Income Modal */}
      <Modal show={showIncomeModal} onHide={() => setShowIncomeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedIncomeIndex !== null ? 'Edit Income Source' : 'Add Income Source'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="incomeSourceForm">
            <div className="mb-3">
              <label htmlFor="incomeName" className="form-label">Income Source Name</label>
              <input id="incomeName" type="text" className="form-control" placeholder="e.g., Salary, Freelance, Investments" value={incomeForm.name} onChange={handleIncomeInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="incomeAmount" className="form-label">Amount</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input id="incomeAmount" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={incomeForm.amount} onChange={handleIncomeInputChange} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="incomeFrequency" className="form-label">Frequency</label>
              <select id="incomeFrequency" className="form-select" value={incomeForm.frequency} onChange={handleIncomeInputChange}>
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Weekly">Weekly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIncomeModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveIncome}>Save Income</Button>
          {selectedIncomeIndex !== null && <Button variant="danger" onClick={handleDeleteIncome}>Delete</Button>}
        </Modal.Footer>
      </Modal>

      {/* Expense Modal */}
      <Modal show={showExpenseModal} onHide={() => setShowExpenseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedExpenseIndex !== null ? 'Edit Regular Expense' : 'Add Regular Expense'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="regularExpenseForm">
            <div className="mb-3">
              <label htmlFor="regularExpenseName" className="form-label">Expense Name</label>
              <input id="regularExpenseName" type="text" className="form-control" placeholder="e.g., Rent, Utilities, Subscription" value={expenseForm.name} onChange={handleExpenseInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="regularExpenseAmount" className="form-label">Amount</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input id="regularExpenseAmount" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={expenseForm.amount} onChange={handleExpenseInputChange} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="expenseFrequency" className="form-label">Frequency</label>
              <select id="expenseFrequency" className="form-select" value={expenseForm.frequency} onChange={handleExpenseInputChange}>
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Weekly">Weekly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveExpense}>Save Expense</Button>
          {selectedExpenseIndex !== null && <Button variant="danger" onClick={handleDeleteExpense}>Delete</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CashFlow;