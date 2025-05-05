import React, { useState, useEffect } from 'react';

function Budget() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    monthlyBudget: '',
    currentSpending: '',
    alertThreshold: '80'
  });

  useEffect(() => {
    const loadedCategories = JSON.parse(localStorage.getItem("budgetCategories") || "[]");
    setCategories(loadedCategories);
  }, []);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    localStorage.setItem("budgetCategories", JSON.stringify(categories));
  }, [categories, initialLoad]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const selectCategory = (index) => {
    const category = categories[index];
    if (!category) return;

    setSelectedCategoryIndex(index);
    setFormData({
      categoryName: category.name,
      monthlyBudget: category.monthlyBudget,
      currentSpending: category.currentSpending,
      alertThreshold: category.alertThreshold
    });
  };

  const handleAddCategory = () => {
    setFormData({
      categoryName: '',
      monthlyBudget: '',
      currentSpending: '',
      alertThreshold: '80'
    });
    setSelectedCategoryIndex(null);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();

    const categoryData = {
      name: formData.categoryName,
      monthlyBudget: parseFloat(formData.monthlyBudget),
      currentSpending: parseFloat(formData.currentSpending),
      alertThreshold: parseInt(formData.alertThreshold)
    };

    if (!categoryData.name) {
      alert("Please enter a category name.");
      return;
    }

    if (isNaN(categoryData.monthlyBudget) || categoryData.monthlyBudget <= 0) {
      alert("Please enter a valid monthly budget.");
      return;
    }

    if (isNaN(categoryData.currentSpending) || categoryData.currentSpending < 0) {
      categoryData.currentSpending = 0;
    }

    if (isNaN(categoryData.alertThreshold) || categoryData.alertThreshold < 0 || categoryData.alertThreshold > 100) {
      categoryData.alertThreshold = 80;
    }

    const newCategories = [...categories];

    if (selectedCategoryIndex !== null) {
      newCategories[selectedCategoryIndex] = categoryData; // Update existing category
    } else {
      newCategories.push(categoryData); // Add new category
    }

    setCategories(newCategories);

    setFormData({
      categoryName: '',
      monthlyBudget: '',
      currentSpending: '',
      alertThreshold: '80'
    });
    setSelectedCategoryIndex(null);
  };

  const handleDeleteCategory = () => {
    if (selectedCategoryIndex === null) return;

    if (window.confirm("Are you sure you want to delete this category?")) {
      const newCategories = [...categories];
      newCategories.splice(selectedCategoryIndex, 1);
      setCategories(newCategories);

      setFormData({
        categoryName: '',
        monthlyBudget: '',
        currentSpending: '',
        alertThreshold: '80'
      });
      setSelectedCategoryIndex(null);
    }
  };

  return (
    <>
      <h3 className="mb-4 text-primary">Budget Management</h3>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-header">Budget Categories</div>
            <div className="card-body">
              <div className="list-group">
                {categories.length === 0 ? (<div className="list-group-item text-center text-muted">No budget categories yet. Add your first category!</div>) : (
                  categories.map((category, index) => {
                    const progress = Math.round((category.currentSpending / category.monthlyBudget) * 100) || 0;
                    const progressClass = progress > 90 ? "bg-danger" : progress > 70 ? "bg-warning" : "bg-success";

                    return (
                      <a href="#" className="list-group-item list-group-item-action" key={index} onClick={(e) => { e.preventDefault(); selectCategory(index); }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">{category.name}</h6>
                            <small>${category.currentSpending} / ${category.monthlyBudget}</small>
                          </div>
                          <span>{progress}%</span>
                        </div>
                        <div className="progress mt-2" style={{ height: "6px" }}>
                          <div className={`progress-bar ${progressClass}`} role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </a>);
                  })
                )}
              </div>
              <button className="btn btn-primary mt-3 w-100" onClick={handleAddCategory}>Add Category</button>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card h-100">
            <div className="card-header">Category Details</div>
            <div className="card-body">
              <form onSubmit={handleSaveCategory}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <input id="categoryName" type="text" className="form-control" placeholder="e.g., Housing, Food, Transportation" value={formData.categoryName} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="monthlyBudget" className="form-label">Monthly Budget</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input id="monthlyBudget" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.monthlyBudget} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="currentSpending" className="form-label">Current Spending</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input id="currentSpending" type="number" className="form-control" placeholder="0.00" min="0" step="0.01" value={formData.currentSpending} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="alertThreshold" className="form-label">Alert Threshold (%)</label>
                  <input id="alertThreshold" type="number" className="form-control" placeholder="80" min="0" max="100" value={formData.alertThreshold} onChange={handleInputChange} />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">Save Category</button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteCategory} disabled={selectedCategoryIndex === null}>Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Budget;