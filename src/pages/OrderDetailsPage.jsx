import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import OrderDetails from '../components/dashboard/OrderDetails';

const OrderDetailsPage = () => {
    return (
        <DashboardProvider>
            <div className="min-h-screen bg-gray-50">
                <OrderDetails />
            </div>
        </DashboardProvider>
    );
};

export default OrderDetailsPage;
