import React from 'react'
import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

//Components
import Dashboard from './Dashboard'
import Root from './Root';

export default function App() {

    const [auth, setAuth] = useState(localStorage.getItem("token"));

    return (
        <React.Fragment>
            {/* {auth ? <Dashboard setAuth={setAuth} /> : <Login setAuth={setAuth} />} */}
            <Routes>
                <Route path="*" element={auth ? <Dashboard setAuth={setAuth} /> : <Root setAuth={setAuth} />} />
            </Routes>
        </React.Fragment>
    )
}