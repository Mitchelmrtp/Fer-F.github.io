import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardProvider } from '../context/DashboardContext';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const DashboardPage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Acceso Restringido
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Debes iniciar sesión para acceder al dashboard.
                    </p>
                    <a
                        href="/login"
                        className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
                    >
                        Iniciar Sesión
                    </a>
                </div>
            </div>
        );
    }

    return (
        <DashboardProvider>
            <div className="min-h-screen bg-gray-50">
                {user.tipo === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
            </div>
        </DashboardProvider>
    );
};

export default DashboardPage;
