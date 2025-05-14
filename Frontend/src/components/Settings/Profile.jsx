import { useState, useEffect } from 'react'
import { useData } from 'DataContext'

function Profile() {
    const { userProfile, updateUserProfile, updatePassword, loading } = useData();
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [uinfo, setUinfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [password, setPassword] = useState({
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (userProfile) {
            setUinfo({
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                email: userProfile.email || '',
                phone: userProfile.phone || '',
            });
        }
    }, [userProfile]);

    const validateUinfo = () => {
        const newErrors = {};

        if (!uinfo.firstName.trim()) { newErrors.firstName = 'First name is required'; }
        if (!uinfo.lastName.trim()) { newErrors.lastName = 'Last name is required'; }
        if (!uinfo.email.trim()) { newErrors.email = 'Email is required'; }
        else if (!/\S+@\S+\.\S+/.test(uinfo.email)) { newErrors.email = 'Email is invalid'; }

        if (!uinfo.phone.trim()) { newErrors.phone = 'Phone number is required'; }
        else if (!/^\d{10}$/.test(uinfo.phone)) { newErrors.phone = 'Phone number must be 10 digits'; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id === 'firstname' ? 'firstName' : id === 'lastname' ? 'lastName' : id;
        
        if (id === 'phone') {
            const phoneValue = value.replace(/[^0-9]/gi, '').substring(0, 10);
            setUinfo({ ...uinfo, [fieldName]: phoneValue });
        } else {
            setUinfo({ ...uinfo, [fieldName]: value });
        }
        
        if (errors[fieldName]) { 
            setErrors({ ...errors, [fieldName]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateUinfo()) { 
            setSaving(true);
            try {
                await updateUserProfile(uinfo);
                alert("Personal information has been updated!");
            } catch (error) {
                alert("Error updating profile: " + error.message);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleChangePassword = (e) => {
        const { id, value } = e.target;
        setPassword({ ...password, [id]: value });
        if (errors[id]) { setErrors({ ...errors, [id]: '' }) }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (isValidPassword()) {
            setSavingPassword(true);
            try {
                await updatePassword(password);
                setPassword({
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                alert('New password set');
            } catch (error) {
                if (error.response?.status === 401) {
                    setErrors({ password: 'Current password is incorrect' });
                } else {
                    alert('Error updating password: ' + error.message);
                }
            } finally {
                setSavingPassword(false);
            }
        }
    };

    const isValidPassword = () => {
        const newErrors = {};

        if (password.newPassword !== password.confirmPassword) { 
            newErrors.confirmPassword = 'New password and confirmation must match';
        }
        if (
            password.newPassword.length < 8 ||
            !/[A-Z]/.test(password.newPassword) ||
            !/[a-z]/.test(password.newPassword) ||
            !/[0-9]/.test(password.newPassword)
        ) { 
            newErrors.newPassword = 'Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number.';
        }
        if (!password.password) { 
            newErrors.password = 'Current password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (loading || !userProfile) return <div className="text-center py-4">Loading profile data...</div>;

    return (
        <div id="profile-section" className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
            <h3 className="mb-4 text-primary">Profile Settings</h3>

            <div className="card mb-4">
                <div className="card-header">Personal Information</div>
                <div className="card-body">
                    <form id="profileForm" onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstname" name="firstname" autoComplete="given-name" placeholder="Enter your first name" value={uinfo.firstName} onChange={handleChange} />
                                {errors.firstName && <p className="text-danger fs-7 m-0">{errors.firstName}</p>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastname" name="lastname" autoComplete="family-name" placeholder="Enter your last name" value={uinfo.lastName} onChange={handleChange} />
                                {errors.lastName && <p className="text-danger fs-7 m-0">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="email" name="email" autoComplete="email" placeholder="Enter your email" value={uinfo.email} onChange={handleChange} disabled/>
                            {errors.email && <p className="text-danger fs-7 m-0">{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" id="phone" name="phone" autoComplete="tel" placeholder="Enter your phone number" value={uinfo.phone} onChange={handleChange} />
                            {errors.phone && <p className="text-danger fs-7 m-0">{errors.phone}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">Change Password</div>
                <div className="card-body">
                    <form id="passwordForm" onSubmit={handleSubmitPassword}>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Current Password</label>
                            <input type="password" className="form-control" id="password" name="password" autoComplete="current-password" value={password.password} onChange={handleChangePassword} />
                            {errors.password && <p className="text-danger fs-7 m-0">{errors.password}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" name="newPassword" autoComplete="new-password" value={password.newPassword} onChange={handleChangePassword} />
                            {errors.newPassword && <p className="text-danger fs-7 m-0">{errors.newPassword}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={password.confirmPassword} onChange={handleChangePassword} />
                            {errors.confirmPassword && <p className="text-danger fs-7 m-0">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={savingPassword}>{savingPassword ? 'Updating...' : 'Update Password'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile