const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy; // <-- ADD THIS
const User = require('../models/User');

// --- Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true 
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        }
        
        // Check if user exists with this email from another provider
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            // Link Google ID to existing account
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        // Create new user
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0].value
        });
        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, false);
    }
}));

// --- GitHub Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    proxy: true,
    scope: ['user:email'] 
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (user) {
            return done(null, user);
        }

        let email = (profile.emails && profile.emails[0].value) || null;
        
        // Check if user exists with this email
        if(email) {
            user = await User.findOne({ email: email });
            if (user) {
                user.githubId = profile.id;
                await user.save();
                return done(null, user);
            }
        }

        // Create new user
        const newUser = new User({
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            email: email, // Can be null
            profileImage: profile.photos[0].value
        });
        await newUser.save();
        return done(null, newUser);
        
    } catch (err) {
        console.error('Error in GitHub Strategy:', err);
        return done(err, false);
    }
}));

// --- Facebook Strategy (NEW) ---
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    proxy: true,
    profileFields: ['id', 'displayName', 'emails', 'photos'] // Request these fields
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });
        if (user) {
            return done(null, user);
        }

        const email = profile.emails && profile.emails[0].value;
        
        // Check if user exists with this email
        if (email) {
            user = await User.findOne({ email: email });
            if (user) {
                user.facebookId = profile.id;
                await user.save();
                return done(null, user);
            }
        }

        // Create new user
        const newUser = new User({
            facebookId: profile.id,
            displayName: profile.displayName,
            email: email,
            profileImage: profile.photos[0].value
        });
        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        console.error('Error in Facebook Strategy:', err);
        return done(err, false);
    }
}));


// --- Passport Session Management ---
passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); 
    } catch (err) {
        done(err, null);
    }
});
