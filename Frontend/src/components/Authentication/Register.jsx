import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from 'AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuth } = useAuth();
    
    const getRedirectUrl = () => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('redirect') || '/dashboard';
    };
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        
        setLoading(true);
        try {
            await axios.post('/api/auth/register', { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password, phone: formData.phone });
            await checkAuth();
            navigate(getRedirectUrl());
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={onChange} required />
                    </div>
                    <div className="col">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={onChange} required />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-success w-100 py-2 mb-3" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
                <p className="text-center mb-0">Already have an account? <span className="text-primary" style={{cursor: 'pointer'}} onClick={() => document.querySelector('[data-tab="login"]').click()}>Login</span></p>
            </form>
        </div>
    );
};

export default Register;