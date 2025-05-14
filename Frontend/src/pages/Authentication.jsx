import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from 'components/Authentication/Login';
import Register from 'components/Authentication/Register';
import { useAuth } from 'AuthContext';

const Authentication = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const { user, checkAuth } = useAuth();

    useEffect(() => { if (document.cookies) { checkAuth() } }, []);

    useEffect(() => {
        if (user) {
            const queryParams = new URLSearchParams(location.search);
            const redirectTo = queryParams.get('redirect') || '/dashboard';
            navigate(redirectTo);
        }
    }, [user, navigate, location]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tabParam = queryParams.get('tab');

        if (tabParam === 'login' || tabParam === 'register') setActiveTab(tabParam);
    }, [location.search]);

    const onClickHandler = (e) => {
        const tab = e.target.dataset.tab;
        setActiveTab(tab);

        const queryParams = new URLSearchParams(location.search);
        queryParams.set('tab', tab);
        navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="auth-container">
                        <div className="auth-tabs">
                            <div className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} data-tab="login" onClick={onClickHandler}>Login</div>
                            <div className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} data-tab="register" onClick={onClickHandler}>Register</div>
                        </div>
                        <div className="auth-content">
                            {activeTab === 'login' ? <Login /> : <Register />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Authentication;