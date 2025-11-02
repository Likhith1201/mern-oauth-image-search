import React from 'react';

const SERVER_URL = 'http://localhost:5001';

// --- Icons (Google, GitHub, Facebook) ---
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.8c-.57 2.81-2.4 5.34-5.17 7.09l6.85 6.85c3.99-3.69 6.38-9.18 6.38-15.9z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.85-6.85c-2.15 1.45-4.92 2.3-8.04 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);
const GitHubIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path>
  </svg>
);
const FacebookIcon = () => ( // <-- NEW ICON
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
  </svg>
);
// --- End Icons ---


function LoginPage() {

  const handleLoginClick = (provider) => {
    window.location.href = `${SERVER_URL}/auth/${provider}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
        <p className="text-gray-600 mb-8">Please log in to use the Image Search.</p>
        <div className="space-y-4">
          <button
            onClick={() => handleLoginClick('google')}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          
          <button
            onClick={() => handleLoginClick('github')}
            className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-gray-900 transition duration-300"
          >
            <GitHubIcon />
            Sign in with GitHub
          </button>

          {/* --- NEW BUTTON --- */}
          <button
            onClick={() => handleLoginClick('facebook')}
            className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition duration-300"
          >
            <FacebookIcon />
            Sign in with Facebook
          </button>
          {/* --- END NEW BUTTON --- */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
