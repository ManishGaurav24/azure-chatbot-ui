import React from 'react';
import { MessageCircle, User, LogOut } from 'lucide-react';

const Navbar = ({ username, onLogout }) => {
    return (
        <nav className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <img
                    src="https://www.exavalu.com/wp-content/themes/quincy/sds/assets/img/logo.png"
                    alt="Logo"
                    className="h-8 w-auto"
                />
            </div>
            <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-600" />
                <h1 className="text-lg font-semibold">Document Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                    <User size={16} />
                    <span>{username ? username.split('@')[0] : 'User'}</span>
                </div>
                <button
                    onClick={onLogout}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-1 cursor-pointer"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
