import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5001/api';

function HomePage({ user }) { 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  
  const [topSearches, setTopSearches] = useState([]); 
  const [userHistory, setUserHistory] = useState([]);   
  
  const [selectedImages, setSelectedImages] = useState(new Set()); 
  const [isLoading, setIsLoading] = useState(false);

  // --- Helper Functions to Fetch Data ---
  const fetchTopSearches = async () => {
    try {
      const res = await axios.get(`${API_URL}/top-searches`);
      setTopSearches(res.data);
    } catch (err) {
      console.error('Error fetching top searches:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setUserHistory(res.data); 
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.reload(); 
      }
      console.error('Error fetching history:', err);
    }
  };

  // --- useEffect: Fetch initial data ---
  useEffect(() => {
    fetchTopSearches();
    fetchHistory();
  }, []); 
  
  // --- Event Handlers ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setSearchResults([]); 

    try {
      const res = await axios.post(`${API_URL}/search`, { term: searchTerm });
      
      setSearchResults(res.data);
      setLastSearchTerm(searchTerm);
      
      fetchHistory();
      fetchTopSearches();
      
      setSearchTerm(''); 
      setIsLoading(false);
      setSelectedImages(new Set());
    } catch (err) {
      console.error('Error during search:', err);
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  // --- Render (The UI) ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto">
        
        <header className="p-6 bg-white rounded-lg shadow-md mb-6">
          
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Top Searches:</h3>
            <div className="flex flex-wrap gap-2">
              {topSearches.length > 0 ? (
                topSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1 bg-white text-blue-600 rounded-full border border-blue-300 text-sm font-medium hover:bg-blue-50"
                  >
                    {term}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No top searches yet.</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for images..."
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </header>

        <div className="flex flex-col md:flex-row gap-6">

          <main className="flex-grow w-full md:w-3/4">
            
            {(lastSearchTerm || isLoading) && (
              <div className="p-4 bg-white rounded-lg shadow-md mb-6">
                {isLoading && (
                  <p className="text-lg font-semibold text-gray-700">Loading results...</p>
                )}
                
                {lastSearchTerm && !isLoading && (
                  <p className="text-lg font-semibold text-gray-700">
                    You searched for "{lastSearchTerm}" — {searchResults.length} results.
                  </p>
                )}

                <p className="text-md font-medium text-blue-600 mt-1">
                  Selected: {selectedImages.size} images
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  isSelected={selectedImages.has(image.id)}
                  onToggleSelect={() => handleToggleSelect(image.id)}
                />
              ))}
            </div>
            
            {!isLoading && searchResults.length === 0 && !lastSearchTerm && (
              <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">Search for something to see results here.</p>
              </div>
            )}
          </main>

          <aside className="w-full md:w-1/4 flex-shrink-0">
            <div className="p-5 bg-white rounded-lg shadow-md sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Your History</h2>
              {userHistory.length === 0 ? (
                <p className="text-sm text-gray-500">Your search history will appear here.</p>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {userHistory.map((item) => (
                    <li key={item._id} className="text-sm">
                      <span className="font-medium text-gray-700">{item.term}</span>
                      <span className="block text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ image, isSelected, onToggleSelect }) {
  return (
    <div 
      onClick={onToggleSelect}
      className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer border-4 ${isSelected ? 'border-blue-500' : 'border-transparent'} transition-all duration-200 group`}
    >
      <img src={image.url} alt={image.alt} className="w-full h-48 object-cover" />
      
      <div className={`absolute top-2 right-2 h-5 w-5 rounded border-2 bg-white flex items-center justify-center
                      ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400 group-hover:border-blue-400'}`}>
        {isSelected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      
      <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}`}></div>
    </div>
  );
}

export default HomePage;
