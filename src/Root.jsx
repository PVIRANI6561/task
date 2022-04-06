import React from 'react'
import Login from './Login';
import RegisterUser from './RegisterUser'
import { Routes, Route, Link } from "react-router-dom";

export default function Root(props) {
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Login setAuth={props.setAuth} />} />
                <Route path="/register" element={<RegisterUser />} />
            </Routes>
        </React.Fragment>
    )
}
