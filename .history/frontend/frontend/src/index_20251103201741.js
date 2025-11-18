//frontend/src/main.jsx`

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './routes/Register.jsx';
import Login from './routes/Login.jsx';
import Dashboard from './routes/Dashboard.jsx';


createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Routes>
<Route path="/" element={<Login/>} />
<Route path="/register" element={<Register/>} />
<Route path="/dashboard" element={<Dashboard/>} />
</Routes>
</BrowserRouter>
);