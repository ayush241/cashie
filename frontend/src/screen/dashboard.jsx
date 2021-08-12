import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.jsx';
import { Route, Switch } from "react-router-dom";
import "./dashboard.css";
import Products from "../components/Products";
import Category from "../components/Category";
import DashboardPanel from '../components/DashboardPanel';
import Transactions from "../components/Transactions";
import Users from '../components/Users';
import UserForm from '../components/userForm';
import ProductForm from '../components/productsForm';
import Report from '../components/Report';
import Account from '../components/Account';
import Setting from '../components/Setting';
import Cookies from 'js-cookie';
import CategoryForm from '../components/CategoryForm';

export default function dashboard(props) {


    return <React.Fragment>
        <div className="first-row">
            <Header />

        </div>
        <div className="content">
            <div className="sidebar-wrap">
                <Sidebar />
            </div>
            <div className="main-area">
                <Switch>
                    <Route exact path={`${props.match.path}/dashboard/setting`} component={Setting} />
                    <Route exact path={`${props.match.path}/dashboard/account`} component={Account} />
                    <Route exact path={`${props.match.path}/category/create`} component={CategoryForm} />
                    <Route exact path={`${props.match.path}/category/update/:id`} component={CategoryForm} />
                    <Route path={`${props.match.path}/dashboard`} component={DashboardPanel} />
                    <Route exact path={`${props.match.path}/users`} component={Users} />
                    <Route exact path={`${props.match.path}/Report`} component={Report} />
                    <Route path={`${props.match.path}/users/update/:id?`} component={UserForm} />
                    <Route exaxt path={`${props.match.path}/users/new`} component={UserForm} />
                    <Route exaxt path={`${props.match.path}/products/newProduct`} component={ProductForm} />

                    <Route exaxt path={`${props.match.path}/products/update/:id?`} component={ProductForm} />
                    <Route exact path={`${props.match.path}/users`} component={Users} />
                    <Route path={`${props.match.path}/products`} component={Products} />
                    <Route path={`${props.match.path}/transactions`} component={Transactions} />
                    <Route path={`${props.match.path}/category`} component={Category} />


                    <Route path={`${props.match.path}/`} component={DashboardPanel} />
                    <Route path={`${props.match.path}/setting`} component={Setting} />
                    <Route path={`${props.match.path}/account`} component={Account} />

                </Switch>
            </div>

        </div>
    </React.Fragment>
}
