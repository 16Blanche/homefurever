const jwt = require('jsonwebtoken'); // For handling authentication tokens
require('dotenv').config(); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);


// Middleware to verify if the user is authenticated
// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer '

//     if (token) {
//         jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

// const authenticateJWT = (req, res, next) => {
//     console.log('Authorization header:', req.headers['authorization']);
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         console.log('Authenticated user:', user);
//         next();
//     });
// };

// const authenticateJWT = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
//     console.log('Authorization header:', req.headers['authorization']);
//     console.log('Token:', token);

//     if (!token) {
//         return res.status(403).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error('Token verification failed:', err);
//             return res.status(403).json({ message: 'Invalid token' });
//         }
//         req.user = user;
//         next();
//     });
// };

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token is invalid
            }

            req.user = user; // Attach the decoded user object to request
            console.log('Decoded user:', req.user); // Should now include the id
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
