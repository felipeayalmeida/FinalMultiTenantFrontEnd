// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Lists from '../../pages/Lists/Lists';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/lists" element={<Lists/>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
