require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const axios = require('axios');       
const session = require('express-session'); 
const passport = require('passport');       

// --- Models ---
const Search = require('./models/Search'); 
const User = require('./models/User');     

// --- Passport Config ---
require('./config/passport');

// --- Route Imports ---
const authRoutes = require('./routes/auth'); 

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true               
}));
app.use(express.json());

// --- Session Setup ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true, 
    }
}));

// --- Passport Setup ---
app.use(passport.initialize()); 
app.use(passport.session());    

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- Auth Middleware ---
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is logged in, continue
    }
    res.status(401).json({ message: 'User not authenticated' });
};


// --- Auth Routes ---
app.use('/auth', authRoutes); 

// --- API Routes (Now Protected) ---

// This route is public
app.get('/api/top-searches', async (req, res) => {
    console.log('GET /api/top-searches hit');
    try {
        const topSearches = await Search.aggregate([
            { $group: { _id: '$term', count: { $sum: 1 } } }, 
            { $sort: { count: -1 } },                         
            { $limit: 5 }                                    
        ]);
        res.json(topSearches.map(s => s._id));
    } catch (err) {
        console.error('Error fetching top searches:', err);
        res.status(500).json({ message: 'Error fetching top searches' });
    }
});

// This route is now PROTECTED
app.post('/api/search', isAuthenticated, async (req, res) => { 
    const { term } = req.body;
    const userId = req.user.id; 
    
    console.log(`POST /api/search hit by user ${userId} for term: "${term}"`);

    if (!term) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    try {
        const newSearch = new Search({ 
            term: term,
            userId: userId 
        });
        await newSearch.save();
        console.log('Search term saved to DB.');
        
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${term}&per_page=12`;
        const unsplashResponse = await axios.get(unsplashUrl, {
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
        });
        
        const images = unsplashResponse.data.results.map(img => ({
            id: img.id,
            url: img.urls.regular, 
            alt: img.alt_description
        }));
        res.json(images);

    } catch (err) {
        console.error('Error processing search:', err.message);
        res.status(500).json({ message: 'Error processing search' });
    }
});

app.get('/api/history', isAuthenticated, async (req, res) => { 
    const userId = req.user.id; 
    console.log(`GET /api/history hit for user ${userId}`);
    
    try {
        // Find by userId to get PERSONAL history
        const history = await Search.find({ userId: userId }) // <-- CHANGED
            .sort({ timestamp: -1 })
            .limit(20);
            
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ message: 'Error fetching history' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});