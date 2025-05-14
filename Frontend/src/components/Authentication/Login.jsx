import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from 'AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser, checkAuth } = useAuth();
    
    const getRedirectUrl = () => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('redirect') || '/dashboard';
    };
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/api/auth/login', { email: formData.email, password: formData.password });
            await checkAuth();
            navigate(getRedirectUrl());
        } catch (err) {
            console.error('Login error details:', { message: err.message, status: err.response?.status, statusText: err.response?.statusText, data: err.response?.data, headers: err.response?.headers });
            
            if (err.response) {
                if (err.response.status === 404) setError('User not found. Please check your email.');
                else if (err.response.status === 401) setError('Incorrect password. Please try again.');
                else if (err.response.status === 500) setError(`Server error: ${err.response.data || 'Unknown error'}`);
                else setError(`Login failed: ${err.response.data || err.message}`);
            } else if (err.request) setError('No response from server. Please check your connection.');
            else setError(`Request error: ${err.message}`);
            
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={onChange} required />
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
                </div>
                <button type="submit" className="btn btn-success w-100 py-2 mb-3" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                <Link to="/demo" className="btn btn-outline-primary w-100">Try Demo Instead</Link>
            </form>
        </div>
    );
};

export default Login;