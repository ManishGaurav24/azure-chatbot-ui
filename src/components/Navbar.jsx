import React, { useState } from 'react';
import { MessageCircle, User, LogOut, Plus, Menu } from 'lucide-react';
import Sidebar from './Sidebar'; // Import the Sidebar component

const Navbar = ({ username, userId, onLogout }) => {
    // Add state for sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
                <div className="text-gray-600 hover:text-gray-800 ">
                    <Menu 
                        size={20} 
                        className="cursor-pointer"
                        onClick={toggleSidebar} // Add click handler
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <MessageCircle className="text-blue-600" />
                    <h1 className="text-lg font-semibold">Document Assistant</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                        <User size={16} />
                        <span>{username}</span>
                    </div>
                    <button onClick={onLogout} className="text-red-600 hover:text-red-800 flex items-center space-x-1 cursor-pointer">
                        <LogOut size={16} />
                        <span className="">Logout</span>
                    </button>
                </div>
            </nav>
            
            {/* Add the Sidebar component */}
            <Sidebar userId={userId} isOpen={sidebarOpen} onClose={closeSidebar} />
        </>
    );
};

export default Navbar;