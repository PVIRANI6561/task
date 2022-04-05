import React from 'react'
import { useState } from 'react';
import Dashboard from './Dashboard'
import Login from './Login';

export default function App() {

    const [auth, setAuth] = useState(localStorage.getItem("token"));

    return (
        <React.Fragment>
            {auth ? <Dashboard setAuth={setAuth} /> : <Login setAuth={setAuth} />}
        </React.Fragment>
    )
}