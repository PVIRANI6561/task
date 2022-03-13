import React from 'react'
import { useState } from 'react';
import Dashboard from './Dashboard'
import Login from './Login';

export default function App() {

    const [auth, setAuth] = useState(false);

    return (
        <React.Fragment>
            {auth ? <Dashboard /> : <Login setAuth={setAuth} />}
        </React.Fragment>
    )
}
