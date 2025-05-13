import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'
import { useData } from 'DataContext';

function Preferences() {
    const { incomeSources, budgetCategories, investments, financialGoals, regularExpenses, upcomingExpenses, userProfile, updateUserProfile, fetchData, deleteIncome, deleteBudget, deleteInvestment, deleteGoal, deleteRegularExpense, deleteUpcomingExpense } = useData();
    const [showModal, setShowModal] = useState(false);
    const [confirmChecked, setConfirmChecked] = useState(false);
    const [saving, setSaving] = useState(false);

    const importOnChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setSaving(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.theme || data.color) {
                    await updateUserProfile({ ...userProfile, theme: data.theme || userProfile.theme, color: data.color || userProfile.color });
                }
                
                alert("Settings imported successfully!");
                
                await fetchData();
            } catch (error) { 
                alert("Error importing data: " + error.message) 
            } finally {
                setSaving(false);
            }
        };
        reader.readAsText(file);
    };

    const exportOnClick = async () => {
        setSaving(true);
        try {
            const exportData = {
                theme: userProfile?.theme,
                color: userProfile?.color,
                userProfile: userProfile,
                incomeSources: incomeSources,
                budgetCategories: budgetCategories,
                investments: investments,
                financialGoals: financialGoals,
                regularExpenses: regularExpenses,
                upcomingExpenses: upcomingExpenses
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

            const exportFileDefaultName = `finantes-backup-${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            alert("Error exporting data: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const confirmClearOnClick = async () => {
        setSaving(true);
        try {
            const deletePromises = [];
            
            incomeSources.forEach(income => deletePromises.push(deleteIncome(income._id)));
            budgetCategories.forEach(budget => deletePromises.push(deleteBudget(budget._id)));
            investments.forEach(investment => deletePromises.push(deleteInvestment(investment._id)));
            financialGoals.forEach(goal => deletePromises.push(deleteGoal(goal._id)));
            regularExpenses.forEach(expense => deletePromises.push(deleteRegularExpense(expense._id)));
            upcomingExpenses.forEach(expense => deletePromises.push(deleteUpcomingExpense(expense._id)));
            
            await Promise.all(deletePromises);
            
            alert("All financial data has been cleared successfully.");

            setConfirmChecked(false);
            setShowModal(false);
            
            await fetchData();
        } catch (error) {
            alert("Error clearing data: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCurrencyChange = async (e) => {
        setSaving(true);
        try {
            await updateUserProfile({ ...userProfile, currency: e.target.value });
        } catch (error) {
            alert("Error updating currency: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCurrencySymbolToggle = async (e) => {
        setSaving(true);
        try {
            await updateUserProfile({ ...userProfile, showCurrencySymbol: e.target.checked });
        } catch (error) {
            alert("Error updating currency symbol preference: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div id="preferences-section" className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
            <h3 className="mb-4 text-primary">Preferences</h3>

            <div className="card mb-4">
                <div className="card-header">Currency Settings</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="defaultCurrency" className="form-label">Default Currency</label>
                        <select className="form-select" id="defaultCurrency" value={userProfile?.currency || 'USD'} onChange={handleCurrencyChange} disabled={saving}>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="CAD">CAD ($)</option>
                        </select>
                    </div>
                    <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="showCurrencySymbol" checked={userProfile?.showCurrencySymbol !== false} onChange={handleCurrencySymbolToggle} disabled={saving} />
                        <label className="form-check-label" htmlFor="showCurrencySymbol">Show currency symbol</label>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">Data Management</div>
                <div className="card-body">
                    <div className="mb-4">
                        <h5 className="mb-3">Export Data</h5>
                        <p className="text-muted mb-3">Download all your financial data and settings for backup</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary" id="exportJSON" onClick={exportOnClick} disabled={saving}>
                                {saving ? 'Exporting...' : 'Export All Data'}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="mb-3">Import Data</h5>
                        <p className="text-muted mb-3">Upload your settings from a backup file</p>
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="importFile" accept=".json" onChange={importOnChange} disabled={saving} />
                            <button className="btn btn-primary" id="importBtn" disabled={saving}>Import</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header text-danger">Clear All Data</div>
                <div className="card-body">
                    <p className="text-muted mb-3">This will permanently delete all your financial data, including:</p>
                    <ul className="mb-3">
                        <li>Budget information</li>
                        <li>Transaction history</li>
                        <li>Financial goals</li>
                        <li>Investment data</li>
                        <li>Custom categories</li>
                    </ul>
                    <p className="text-muted mb-3"><strong>This action cannot be undone.</strong> We recommend exporting your data before clearing.</p>
                    <button className="btn btn-danger" onClick={() => setShowModal(true)} disabled={saving}>Clear All Data</button>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} id="clearDataModal" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">
                        Confirm Data Deletion
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you absolutely sure you want to delete all your financial data?</p>
                    <p><strong>This action cannot be undone.</strong></p>
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="confirmDelete" checked={confirmChecked} onChange={(e) => setConfirmChecked(e.target.checked)} />
                        <label className="form-check-label" htmlFor="confirmDelete"> I understand that all my data will be permanently deleted</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmClearOnClick} disabled={!confirmChecked || saving}>
                        {saving ? 'Deleting...' : 'Delete All Data'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Preferences