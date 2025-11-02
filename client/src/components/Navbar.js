import React from 'react';

const SERVER_URL = 'http://localhost:5001';

function Navbar({ user }) {

  const handleLogout = () => {
    // Redirect to the backend logout route
    window.location.href = `${SERVER_URL}/auth/logout`;
  };


  if (!user) {
    return (
      <nav className="p-4 bg-white rounded-lg shadow-md mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">MERN Image Search</h1>
        <div className="text-gray-500">Loading user...</div>
      </nav>
    );
  }
  
  return (
    <nav className="p-4 bg-white rounded-lg shadow-md mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">MERN Image Search</h1>
      
      <div className="flex items-center">
        {user.profileImage && (
          <img 
            src={user.profileImage} 
            alt={user.displayName}
            className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
          />
        )}
        <span className="font-medium text-gray-700 mr-4">
          Welcome, {user.displayName}!
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;