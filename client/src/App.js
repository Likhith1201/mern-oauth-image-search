import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start in loading state

  useEffect(() => {
    // This effect runs once when the app loads
    // We check our backend to see if a session cookie exists
    const checkUser = async () => {
      try {
        const res = await axios.get('http://localhost:5001/auth/me');
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // Not authenticated
        console.log('User not logged in');
      }
      setIsLoading(false); // Done loading
    };

    checkUser();
  }, []); 

  // Show a loading spinner while we check auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // --- Auth Logic ---
  return (
    <div className="App">
      {user ? <HomePage user={user} /> : <LoginPage />}
    </div>
  );
}

export default App;

