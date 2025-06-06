import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 min-h-0">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
