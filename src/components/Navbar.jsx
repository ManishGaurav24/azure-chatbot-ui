import React from 'react';
import { MessageCircle, User, LogOut, Plus, Menu } from 'lucide-react';

const Navbar = ({ username, onLogout }) => (
    <nav className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
        <div className="text-gray-600 hover:text-gray-800 ">
            <Menu size={20} />
        </div>
        <div className="flex items-center space-x-2">
            <MessageCircle className="text-blue-600" />
            <h1 className="text-lg font-semibold">Document Assistant</h1>
        </div>
        <div className="flex items-center space-x-4">
            {/* <button onClick={onNewChat} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1">
        <Plus size={16} />
        <span>New</span>
      </button> */}
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
);

export default Navbar;
