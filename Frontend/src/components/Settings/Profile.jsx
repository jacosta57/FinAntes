import React, { useState } from 'react'

function Profile() {

    const [errors, setErrors] = useState({});
    const [uinfo, setUinfo] = useState(JSON.parse(localStorage.getItem('profile')) || {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
    });
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const validateUinfo = () => {
        const newErrors = {};

        if (!uinfo.firstname.trim()) { newErrors.firstname = 'First name is required'; }
        if (!uinfo.lastname.trim()) { newErrors.lastname = 'Last name is required'; }
        if (!uinfo.email.trim()) { newErrors.email = 'Email is required'; }
        else if (!/\S+@\S+\.\S+/.test(uinfo.email)) { newErrors.email = 'Email is invalid'; }

        if (!uinfo.phone.trim()) { newErrors.phone = 'Phone number is required'; }
        else if (!/^\d{10}$/.test(uinfo.phone)) { newErrors.phone = 'Phone number must be 10 digits'; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const id = e.target.id;
        let value = e.target.value;

        if (id === 'phone') {
            value = value.replace(/[^0-9]/gi, '').substring(0, 10);
        }

        setUinfo({
            ...uinfo,
            [id]: value
        });

        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: ''
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateUinfo()) {
            localStorage.setItem('profile', JSON.stringify(uinfo))
        }
    };

    const handleChangePassword = (e) => {
        const id = e.target.id;
        let value = e.target.value;

        setPassword({
            ...password,
            [id]: value
        });

        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: ''
            });
        }
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();

        if (isValidPassword()) {
            const newUinfo = JSON.parse(localStorage.getItem('profile'));
            newUinfo.password = password.newPassword
            localStorage.setItem('profile', JSON.stringify(newUinfo));
            setPassword({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
            alert('New password set');
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
        if (uinfo.password !== password.currentPassword) {
            newErrors.currentPassword = 'Current password is incorrect';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



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
                                <input type="text" className="form-control" id="firstname" placeholder="Enter your first name" value={uinfo.firstname} onChange={handleChange} />
                                {errors.firstname && <p className="text-danger fs-7 m-0">{errors.firstname}</p>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastname" placeholder="Enter your last name" value={uinfo.lastname} onChange={handleChange} />
                                {errors.lastname && <p className="text-danger fs-7 m-0">{errors.lastname}</p>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" value={uinfo.email} onChange={handleChange} />
                            {errors.email && <p className="text-danger fs-7 m-0">{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" id="phone" placeholder="Enter your phone number" value={uinfo.phone} onChange={handleChange} />
                            {errors.phone && <p className="text-danger fs-7 m-0">{errors.phone}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">Change Password</div>
                <div className="card-body">
                    <form id="passwordForm" onSubmit={handleSubmitPassword}>
                        <div className="mb-3">
                            <label htmlFor="currentPassword" className="form-label">Current Password</label>
                            <input type="password" className="form-control" id="currentPassword" value={password.currentPassword} onChange={handleChangePassword} />
                            {errors.currentPassword && <p className="text-danger fs-7 m-0">{errors.currentPassword}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" value={password.newPassword} onChange={handleChangePassword} />
                            {errors.newPassword && <p className="text-danger fs-7 m-0">{errors.newPassword}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" id="confirmPassword" value={password.confirmPassword} onChange={handleChangePassword} />
                            {errors.confirmPassword && <p className="text-danger fs-7 m-0">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary">Update Password</button>
                    </form>
                </div>
            </div>




        </div>
    )
}

export default Profile