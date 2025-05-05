import Budget from 'components/Editor/Budget'
import CashFlow from 'components/Editor/CashFlow'
import Expenses from 'components/Editor/Expenses'
import Goals from 'components/Editor/Goals'
import Investments from 'components/Editor/Investments'
import React, { useState } from 'react'

function Editor() {

    const [activeTab, setActiveTab] = useState('budget')
    const onClickHandler = (e) => setActiveTab(e.target.dataset.tab)

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 col-lg-2 d-md-block sidebar py-3">
                    <div className="list-group list-group-flush">
                        <a className={"list-group-item list-group-item-action " + (activeTab === 'budget' ? 'active' : '')} data-tab="budget" onClick={onClickHandler}>Budget</a>
                        <a className={"list-group-item list-group-item-action " + (activeTab === 'cashflow' ? 'active' : '')} data-tab="cashflow" onClick={onClickHandler}>Cash Flow</a>
                        <a className={"list-group-item list-group-item-action " + (activeTab === 'investments' ? 'active' : '')} data-tab="investments" onClick={onClickHandler}>Investments</a>
                        <a className={"list-group-item list-group-item-action " + (activeTab === 'goals' ? 'active' : '')} data-tab="goals" onClick={onClickHandler}>Financial Goals</a>
                        <a className={"list-group-item list-group-item-action " + (activeTab === 'expenses' ? 'active' : '')} data-tab="expenses" onClick={onClickHandler}>Upcoming Expenses</a>
                    </div>
                </div>

                <div className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4">
                    {activeTab === 'budget' && <Budget />}
                    {activeTab === 'cashflow' && <CashFlow />}
                    {activeTab === 'investments' && <Investments />}
                    {activeTab === 'goals' && <Goals />}
                    {activeTab === 'expenses' && <Expenses />}
                </div>
            </div>
        </div>
    )
}

export default Editor