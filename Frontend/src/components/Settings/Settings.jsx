import React, { useState } from 'react';
import Appearance from './Appearance';
import Profile from './Profile';
import Preferences from './Preferences';
import Tiers from './Tiers';

function Settings() {

    const [activeTab, setActiveTab] = useState('appearance')

    const onClickHandler = (e) => {
        setActiveTab(e.target.dataset.tab)
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 col-lg-2 d-md-block sidebar py-3">
                    <div className="list-group list-group-flush">
                        <a className={"list-group-item list-group-item-action settings-nav-link " + (activeTab === 'appearance' ? 'active' : '')} data-tab="appearance" onClick={onClickHandler}>Appearance</a>
                        <a className={"list-group-item list-group-item-action settings-nav-link " + (activeTab === 'profile' ? 'active' : '')} data-tab="profile" onClick={onClickHandler}>Profile</a>
                        <a className={"list-group-item list-group-item-action settings-nav-link " + (activeTab === 'preferences' ? 'active' : '')} data-tab="preferences" onClick={onClickHandler}>Preferences</a>
                        <a className={"list-group-item list-group-item-action settings-nav-link " + (activeTab === 'tiers' ? 'active' : '')} data-tab="tiers" onClick={onClickHandler}>Tiers</a>
                    </div>
                </div>

                {activeTab === 'appearance' && <Appearance /> }
                {activeTab === 'profile' && <Profile /> }
                {activeTab === 'preferences' && <Preferences /> }
                {activeTab === 'tiers' && <Tiers /> }

            </div>
        </div>
    )
}

export default Settings