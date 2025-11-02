const router = require('express').Router();
const passport = require('passport');

const CLIENT_URL = process.env.CLIENT_URL;

// --- Google Auth Routes ---
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: CLIENT_URL, 
        failureRedirect: `${CLIENT_URL}/login/failed` 
    })
);

// --- GitHub Auth Routes ---
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', {
        successRedirect: CLIENT_URL,
        failureRedirect: `${CLIENT_URL}/login/failed`
    })
);

// --- Facebook Auth Routes 
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: CLIENT_URL,
        failureRedirect: `${CLIENT_URL}/login/failed`
    })
);


// --- Logout Route ---
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.redirect(CLIENT_URL);
    });
});

// --- Check User Status Route ---
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ user: null, message: 'Not authenticated' });
    }
});

module.exports = router;
