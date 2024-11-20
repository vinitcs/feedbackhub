import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminProtectedRoute = () => {
     let isAdminLogin = false;
     return isAdminLogin ? <Outlet /> : <Navigate to="/" />;

}

