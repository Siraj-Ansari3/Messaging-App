import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'
import { useFirebase } from '../Firebase';
const Navbar = ({ onSearch }) => {
    const firebase = useFirebase();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        onSearch(event.target.value); // Pass the search query to the parent component
    };

    const handleAddContact = () => {
        navigate('/addcontact');
    };

    return (
        <div className="h-16 bg-gray-800 text-white flex items-center px-6 shadow-md navbar-slide-in">
            <div className="w-full flex items-center justify-between">
                {/* Text aligned to the far left */}
                <div className="flex-none">
                    <h1 className="text-xl font-bold transition-transform duration-300 hover:scale-105">My App</h1>
                </div>
                {/* Search bar centered */}
                <div className="flex-grow flex items-center justify-center mx-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search contacts..."
                        className="p-2 rounded border border-gray-300 text-black w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 shadow-md hover:shadow-lg"
                    />
                </div>
                {/* Buttons aligned to the far right */}
                <div className="flex-none flex items-center space-x-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                        onClick={handleAddContact}
                    >
                        Add New Contact
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                        onClick={() => firebase.logOut()} 
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
