import React, { useState } from 'react'

function Preferences() {

    const importFile = document.getElementById("importFile");
    const confirmDeleteCheckbox = document.getElementById("confirmDelete");
    const confirmClearBtn = document.getElementById("confirmClearBtn");


    const importOnChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                const keys = Object.keys(localStorage);

                keys.forEach((key) => {
                    localStorage.removeItem(key);
                });

                Object.keys(data).forEach((key) => {
                    if (key === "theme" || key === "color") {
                        localStorage.setItem(key, data[key]);
                    } else {
                        localStorage.setItem(key, JSON.stringify(data[key]));
                    }
                });

                alert("Data imported successfully!");
                location.reload();
            } catch (error) {
                alert("Error importing data: " + error.message);
            }
        };

        reader.readAsText(file);
    };

    const exportOnclick = () => {
        const data = {};

        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            try {
                data[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                data[key] = localStorage.getItem(key);
            }
        });

        // Create downloadable file
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri =
            "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

        const exportFileDefaultName = "finantes-data.json";

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    // Clear data functionality
    if (confirmDeleteCheckbox && confirmClearBtn) {
        confirmDeleteCheckbox.addEventListener("change", () => {
            confirmClearBtn.disabled = !confirmDeleteCheckbox.checked;
        });

        confirmClearBtn.addEventListener("click", () => {
            const preserveKeys = ["theme", "colorScheme", "profile"];

            const keys = Object.keys(localStorage);

            keys.forEach((key) => {
                if (!preserveKeys.includes(key)) {
                    localStorage.removeItem(key);
                }
            });

            const modal = bootstrap.Modal.getInstance(
                document.getElementById("clearDataModal")
            );
            modal.hide();

            alert("All data has been cleared successfully.");

            confirmDeleteCheckbox.checked = false;
            confirmClearBtn.disabled = true;
        });
    }

    return (
        <div id="preferences-section" className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
            <h3 className="mb-4 text-primary">Preferences</h3>

            <div className="card mb-4">
                <div className="card-header">Currency Settings</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="defaultCurrency" className="form-label">Default Currency</label>
                        <select className="form-select" id="defaultCurrency">
                            <option value="USD" defaultValue>USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="CAD">CAD ($)</option>
                        </select>
                    </div>
                    <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="showCurrencySymbol" defaultChecked />
                        <label className="form-check-label" htmlFor="showCurrencySymbol">Show currency symbol</label>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">Data Management</div>
                <div className="card-body">
                    <div className="mb-4">
                        <h5 className="mb-3">Export Data</h5>
                        <p className="text-muted mb-3">Download your financial data for backup or analysis</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary" id="exportJSON" onClick={exportOnclick}>Export as JSON</button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="mb-3">Import Data</h5>
                        <p className="text-muted mb-3">Upload your financial data from a file</p>
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="importFile" accept=".json" onChange={importOnChange} />
                            <button className="btn btn-primary" id="importBtn" >Import</button>
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
                    <p className="text-muted mb-3"><strong>This action cannot be undone.</strong> We recommend exporting your data
                        before clearing.</p>
                    <button className="btn btn-danger" id="clearDataBtn" data-bs-toggle="modal"
                        data-bs-target="#clearDataModal">Clear All Data</button>
                </div>
            </div>

            <div className="modal fade" id="clearDataModal" tabIndex="-1" aria-labelledby="clearDataModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-danger" id="clearDataModalLabel">Confirm Data Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you absolutely sure you want to delete all your financial data?</p>
                            <p><strong>This action cannot be undone.</strong></p>
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" id="confirmDelete" />
                                <label className="form-check-label" htmlFor="confirmDelete">
                                    I understand that all my data will be permanently deleted
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" id="confirmClearBtn" disabled>Delete All Data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Preferences