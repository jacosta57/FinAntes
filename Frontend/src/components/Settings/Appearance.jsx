import { useState, useEffect } from 'react'
import { useData } from 'DataContext'

function Appearance() {
    const { userProfile, updateUserProfile, loading } = useData();
    const [saving, setSaving] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(userProfile?.theme || 'light');
    const [currentColor, setCurrentColor] = useState(userProfile?.color || 'blue');

    useEffect(() => {
        if (userProfile) {
            setCurrentTheme(userProfile.theme || 'light');
            setCurrentColor(userProfile.color || 'blue');
        }
    }, [userProfile]);

    async function changeTheme(e) {
        const newTheme = e.target.value;
        setCurrentTheme(newTheme);
        setSaving(true);
        try {
            await updateUserProfile({ ...userProfile, theme: newTheme });
        } catch (error) {
            alert('Error updating theme: ' + error.message);
            setCurrentTheme(userProfile.theme);
        } finally {
            setSaving(false);
        }
    }

    async function changeColor(e) {
        const newColor = e.target.value;
        setCurrentColor(newColor);
        setSaving(true);
        try {
            await updateUserProfile({ ...userProfile, color: newColor });
        } catch (error) {
            alert('Error updating color: ' + error.message);
            setCurrentColor(userProfile.color);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="text-center py-4">Loading preferences...</div>;

    return (
        <div className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
            <h3 className="mb-4 text-primary">Theme Settings</h3>

            <div className="card mb-4">
                <div className="card-header">Theme Mode</div>
                <div className="card-body">
                    <div className="btn-group" role="group">
                        <div className="btn-group" role="group">
                            <input type="radio" className="btn-check" name="theme" id="lightMode" value="light" checked={currentTheme === 'light'} onChange={changeTheme} disabled={saving} />
                            <label className="btn btn-outline-primary" htmlFor="lightMode">Light</label>

                            <input type="radio" className="btn-check" name="theme" id="darkMode" value="dark" checked={currentTheme === 'dark'} onChange={changeTheme} disabled={saving} />
                            <label className="btn btn-outline-primary" htmlFor="darkMode">Dark</label>
                        </div>

                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">Color Scheme</div>
                <div className="card-body">
                    <div className="d-flex gap-3 flex-wrap">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="color" id="blueScheme" value='blue' checked={currentColor === 'blue'} onChange={changeColor} disabled={saving} />
                            <label className="form-check-label" htmlFor="blueScheme">
                                <div className="color-swatch rounded-circle" style={{ width: 30 + 'px', height: 30 + 'px', backgroundColor: '#2962FF' }}></div>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="color" id="greenScheme" value='green' checked={currentColor === 'green'} onChange={changeColor} disabled={saving} />
                            <label className="form-check-label" htmlFor="greenScheme">
                                <div className="color-swatch rounded-circle" style={{ width: 30 + 'px', height: 30 + 'px', backgroundColor: '#00C853' }}></div>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="color" id="purpleScheme" value='purple' checked={currentColor === 'purple'} onChange={changeColor} disabled={saving} />
                            <label className="form-check-label" htmlFor="purpleScheme">
                                <div className="color-swatch rounded-circle" style={{ width: 30 + 'px', height: 30 + 'px', backgroundColor: '#6200EA' }}></div>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="color" id="orangeScheme" value='orange' checked={currentColor === 'orange'} onChange={changeColor} disabled={saving} />
                            <label className="form-check-label" htmlFor="orangeScheme">
                                <div className="color-swatch rounded-circle" style={{ width: 30 + 'px', height: 30 + 'px', backgroundColor: '#FF6D00' }}></div>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="color" id="tealScheme" value='teal' checked={currentColor === 'teal'} onChange={changeColor} disabled={saving} />
                            <label className="form-check-label" htmlFor="tealScheme">
                                <div className="color-swatch rounded-circle" style={{ width: 30 + 'px', height: 30 + 'px', backgroundColor: '#00BFA5' }}></div>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="color" id="redScheme" value='red' checked={currentColor === 'red'} onChange={changeColor} disabled={saving} />
                            <label className="form-check-label" htmlFor="redScheme">
                                <div className="color-swatch rounded-circle" style={{ width: 30 + 'px', height: 30 + 'px', backgroundColor: '#D50000' }}></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <span>Custom Theme</span>
                    <span className="badge bg-success">Premium</span>
                </div>
                <div className="card-body">
                    <p className="text-muted">Upload your custom CSS theme file.</p>
                    <div className="input-group mb-3">
                        <input type="file" className="form-control" id="customTheme" />
                        <button className="btn btn-primary" type="button">Upload</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Appearance