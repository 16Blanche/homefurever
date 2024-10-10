const jwt = require('jsonwebtoken'); // For handling authentication tokens
require('dotenv').config(); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token is invalid
            }
        
            console.log('Decoded user from JWT:', user); // Add this to inspect the decoded user
            req.user = user; // Attach the decoded user object to request
            next();
        });        
    } else {
        res.sendStatus(401); // Unauthorized if token is missing
    }
};

// Middleware to check for admin or super-admin role
const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
        return res.sendStatus(403);
    }
    next();
};

// Middleware to check for super-admin role
const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super-admin') {
        return res.sendStatus(403);
    }
    next();
};

// Middleware to check for verified user role
const isVerifiedUser = (req, res, next) => {
    if (req.user.role !== 'verified' && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
        return res.sendStatus(403);
    }
    next();
};

// Middleware to check for pending user role
const isPendingUser = (req, res, next) => {
    if (req.user.role !== 'pending') {
        return res.sendStatus(403);
    }
    next();
};

module.exports = {
    authenticateJWT,
    isAdminOrSuperAdmin,
    isSuperAdmin,
    isVerifiedUser,
    isPendingUser

};
