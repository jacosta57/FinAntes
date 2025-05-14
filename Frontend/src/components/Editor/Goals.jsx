import React, { useState } from 'react';
import { useData } from 'DataContext';

function Goals() {
  const { financialGoals, addGoal, updateGoal, deleteGoal, loading, symbol } = useData();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  });
  const [saving, setSaving] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const selectGoal = (index) => {
    const goal = financialGoals[index];
    
    if (!goal) return;
    
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate
    });
    
    setSelectedGoalIndex(index);
  };

  const handleAddGoal = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: ''
    });
    
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    setFormData(prev => ({
      ...prev,
      targetDate: oneYearFromNow.toISOString().split('T')[0]
    }));
    
    setSelectedGoalIndex(null);
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    
    const goalData = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate
    };

    if (!goalData.name) {
      alert("Please enter a goal name.");
      return;
    }

    if (isNaN(goalData.targetAmount) || goalData.targetAmount <= 0) {
      alert("Please enter a valid target amount.");
      return;
    }

    if (isNaN(goalData.currentAmount) || goalData.currentAmount < 0) {
      goalData.currentAmount = 0;
    }

    if (!goalData.targetDate) {
      alert("Please enter a target date.");
      return;
    }

    setSaving(true);
    try {
      if (selectedGoalIndex !== null) {
        await updateGoal(financialGoals[selectedGoalIndex]._id, goalData);
      } else {
        await addGoal(goalData);
      }

      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: ''
      });
      setSelectedGoalIndex(null);
    } catch (error) {
      alert('Error saving goal: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (selectedGoalIndex === null) return;

    if (window.confirm("Are you sure you want to delete this goal?")) {
      setSaving(true);
      try {
        await deleteGoal(financialGoals[selectedGoalIndex]._id);

        setFormData({
          name: '',
          targetAmount: '',
          currentAmount: '',
          targetDate: ''
        });
        setSelectedGoalIndex(null);
      } catch (error) {
        alert('Error deleting goal: ' + error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading goals data...</div>;

  return (
    <div id="goals-section" className="finances-content">
      <h3 className="mb-4 text-primary">Financial Goals</h3>
      
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Your Goals</div>
            <div className="card-body">
              <div className="list-group">
                {financialGoals.length === 0 ? (
                  <div className="list-group-item text-center text-muted">No financial goals added yet.</div>
                ) : (
                  financialGoals.map((goal, index) => {
                    const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0;
                    
                    return (
                      <a href="#" className="list-group-item list-group-item-action" key={goal._id} onClick={(e) => { e.preventDefault(); selectGoal(index); }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">{goal.name}</h6>
                            <small className="text-muted">Target: {symbol}{goal.targetAmount} by {formatDate(goal.targetDate)}</small>
                          </div>
                          <span>{progress}%</span>
                        </div>
                        <div className="progress mt-2" style={{ height: "6px" }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
              <button className="btn btn-success mt-3 w-100" onClick={handleAddGoal}>Add Goal</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Goal Details</div>
            <div className="card-body">
              <form onSubmit={handleSaveGoal}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Goal Name</label>
                  <input id="name" autoComplete='off' type="text" className="form-control" placeholder="e.g., Emergency Fund, Vacation, New Car" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="targetAmount" className="form-label">Target Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">{symbol}</span>
                    <input id="targetAmount" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.targetAmount} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="currentAmount" className="form-label">Current Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">{symbol}</span>
                    <input id="currentAmount" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.currentAmount} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="targetDate" className="form-label">Target Date</label>
                  <input id="targetDate" type="date" className="form-control" value={formData.targetDate} onChange={handleInputChange} />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : 'Save Goal'}</button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteGoal} disabled={selectedGoalIndex === null || saving}>Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;