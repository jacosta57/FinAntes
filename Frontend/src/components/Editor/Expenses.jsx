import React, { useState, useEffect } from 'react';
import { useData } from 'DataContext';

function Expenses() {
  const { upcomingExpenses, addUpcomingExpense, updateUpcomingExpense, deleteUpcomingExpense, loading } = useData();
  const [selectedExpenseIndex, setSelectedExpenseIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    isRecurring: false
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  const selectExpense = (index) => {
    const sortedExpenses = [...upcomingExpenses].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const expense = sortedExpenses[index];
    
    if (!expense) return;
    
    setFormData({
      name: expense.name,
      amount: expense.amount,
      dueDate: expense.dueDate,
      isRecurring: expense.isRecurring
    });
    
    setSelectedExpenseIndex(upcomingExpenses.indexOf(expense));
  };

  const handleAddExpense = () => {
    setFormData({
      name: '',
      amount: '',
      dueDate: '',
      isRecurring: false
    });
    
    setSelectedExpenseIndex(null);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    
    const expenseData = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      isRecurring: formData.isRecurring
    };
    
    if (!expenseData.name) {
      alert("Please enter an expense name.");
      return;
    }
    
    if (isNaN(expenseData.amount) || expenseData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    
    if (!expenseData.dueDate) {
      alert("Please enter a due date.");
      return;
    }
    
    setSaving(true);
    try {
      if (selectedExpenseIndex !== null) {
        await updateUpcomingExpense(upcomingExpenses[selectedExpenseIndex]._id, expenseData);
      } else {
        await addUpcomingExpense(expenseData);
      }
      handleAddExpense();
    } catch (error) {
      alert('Error saving expense: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (selectedExpenseIndex === null) return;
    
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setSaving(true);
      try {
        await deleteUpcomingExpense(upcomingExpenses[selectedExpenseIndex]._id);
        handleAddExpense();
      } catch (error) {
        alert('Error deleting expense: ' + error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const sortedExpenses = [...upcomingExpenses].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (loading) return <div className="text-center py-4">Loading expenses data...</div>;

  return (
    <div id="expenses-section" className="finances-content">
      <h3 className="mb-4 text-primary">Upcoming Expenses</h3>
      
      <div className="row g-4">
        <div className="col-md-7">
          <div className="card h-100">
            <div className="card-header">Expense Timeline</div>
            <div className="card-body">
              <div className="list-group">
                {sortedExpenses.length === 0 ? (
                  <div className="list-group-item text-center text-muted">No upcoming expenses added yet.</div>
                ) : (
                  sortedExpenses.map((expense, index) => {
                    const dueDate = new Date(expense.dueDate);
                    const today = new Date();
                    const diffTime = dueDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    let statusClass = "bg-primary";
                    if (diffDays < 0) {
                      statusClass = "bg-danger";
                    } else if (diffDays < 7) {
                      statusClass = "bg-warning";
                    }
                    
                    return (
                      <a href="#" className="list-group-item list-group-item-action" key={expense._id} onClick={(e) => { e.preventDefault(); selectExpense(index); }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">
                              {expense.name} 
                              {expense.isRecurring && <span className="badge ms-2">Recurring</span>}
                            </h6>
                            <small>Due: {formatDate(dueDate)}</small>
                          </div>
                          <div className="text-end">
                            <div>${expense.amount}</div>
                            <small className={`badge ${statusClass}`}>
                              {diffDays < 0 ? 'Overdue' : diffDays === 0 ? 'Today' : `${diffDays} days`}
                            </small>
                          </div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
              <button className="btn btn-primary mt-3 w-100" onClick={handleAddExpense}>Add Expense</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-header">Expense Details</div>
            <div className="card-body">
              <form onSubmit={handleSaveExpense}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Expense Name</label>
                  <input id="name" autoComplete='off' type="text" className="form-control" placeholder="e.g., Rent, Insurance Premium" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input id="amount" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.amount} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input id="dueDate" type="date" className="form-control" value={formData.dueDate} onChange={handleInputChange} />
                </div>
                <div className="mb-3 form-check">
                  <input id="isRecurring" type="checkbox" className="form-check-input" checked={formData.isRecurring} onChange={handleInputChange} />
                  <label htmlFor="isRecurring" className="form-check-label" >Recurring Expense</label>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Expense'}</button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteExpense} disabled={selectedExpenseIndex === null || saving}>Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;