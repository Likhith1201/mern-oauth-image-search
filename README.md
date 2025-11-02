MERN + OAuth Project: Image Search & Multi-Select

This is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application built as per the internship task requirements.

The application allows authenticated users to search for images using the Unsplash API, view a personal search history (saved to MongoDB), and see the top 5 most popular searches across all users.

Features

OAuth Authentication: Secure login via Google, GitHub, and Facebook using Passport.js.

Protected Routes: Only authenticated users can access the search functionality and their personal history.

Image Search: Fetches real-world images from the Unsplash API.

Personal Search History: Every search is saved to a MongoDB searches collection, linked directly to the user's _id.

Top Searches Banner: A public API endpoint that aggregates all searches to display the top 5 most frequent terms.

Multi-Select UI: A client-side React UI to select multiple images from the results grid and track the count.

Project Structure

/mern-image-search
  /client     (React Frontend)
    /src
      /components
        Navbar.js         (Displays user info and logout button)
      /pages
        HomePage.js       (The main application page, protected)
        LoginPage.js      (The public login page)
      App.js              (Main auth controller, routes to Home or Login)
      index.css           (Tailwind CSS imports)
      index.js            (Sets `axios.defaults.withCredentials`)
    postcss.config.js     (Tailwind config)
    tailwind.config.js    (Tailwind config)
  /server     (Node/Express Backend)
    /config
      passport.js       (All OAuth strategies and user (de)serialization)
    /models
      Search.js         (Mongoose schema for search terms + userId)
      User.js           (Mongoose schema for authenticated users)
    /routes
      auth.js           (All auth API endpoints: /google, /github, /me, /logout)
    .env                (Holds all secret API keys)
    server.js           (The main Express server, routes, and middleware)


🛠️ Setup & Installation

Follow these steps to run the project locally.

1. Clone the Repository

git clone [https://github.com/Likhith1201/mern-oauth-image-search.git](https://github.com/Likhith1201/mern-oauth-image-search.git)



2. Backend Setup (/server)

Navigate to the server directory:

cd server


Install all required npm packages:

npm install


Create a .env file in the /server folder. Copy the template below and fill it with your own secret keys.

# MongoDB Atlas Connection String
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

# Unsplash API
UNSPLASH_ACCESS_KEY=YOUR_UNSPLASH_ACCESS_KEY

# Session
SESSION_SECRET=a-very-strong-and-random-secret-key

# App URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5001

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# GitHub OAuth
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

# Facebook OAuth
FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET


3. Frontend Setup (/client)

Navigate to the client directory:

cd client


Install all required npm packages:

npm install


4. Run the Application

You will need two separate terminals:

Terminal 1 (Backend):

cd server
npm start


(Server will be running on http://localhost:5001)

Terminal 2 (Frontend):

cd client
npm start


(App will automatically open at http://localhost:3000)

🚀 API Endpoints (cURL Examples)

Auth Routes

GET /auth/google - Initiates Google OAuth login.

GET /auth/github - Initiates GitHub OAuth login.

GET /auth/facebook - Initiates Facebook OAuth login.

GET /auth/logout - Logs the user out and clears the session.

GET /auth/me - Checks if a user is currently authenticated via their session cookie.

Data Routes

1. Get Top Searches (Public)

# GET /api/top-searches
curl http://localhost:5001/api/top-searches


Returns: ["cars", "dogs", "sky", "nature", "city"]

2. Get User's History (Protected)

(Requires an authenticated session cookie, which you can get from your browser's dev tools)

# GET /api/history
curl --cookie "connect.sid=YOUR_SESSION_COOKIE_VALUE" http://localhost:5001/api/history


Returns: [{"_id":"...","userId":"...","term":"cars","timestamp":"..."}, ...]

3. Perform a Search (Protected)

(Requires an authenticated session cookie)

# POST /api/search
curl -X POST http://localhost:5001/api/search \
     -H "Content-Type: application/json" \
     --cookie "connect.sid=YOUR_SESSION_COOKIE_VALUE" \
     -d '{"term": "water"}'


Returns: [{"id":"...","url":"...","alt":"..."}, ...] (12 image objects from Unsplash)