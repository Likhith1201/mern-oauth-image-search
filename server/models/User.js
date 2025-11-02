const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        sparse: true, 
        unique: true  
    },
    githubId: {
        type: String,
        sparse: true,
        unique: true
    },
    facebookId: {
        type: String,
        sparse: true,
        unique: true
    },
    
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false, 
        unique: true,
        sparse: true 
    },
    profileImage: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);