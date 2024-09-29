// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';

// const ProtectedRoute = ({ children, roles }) => {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && roles.length > 0 && !roles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };


// export default ProtectedRoute;

import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode'; 

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, setUser } = useContext(AuthContext); // Access AuthContext values
  const location = useLocation(); // To redirect back to the attempted URL if needed
  const [isCheckingToken, setIsCheckingToken] = useState(true); // Handle token check state separately

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        
        // Check if the token is expired
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token'); // Clear expired token
          setUser(null); // Clear user in AuthContext
        } else {
          setUser(decoded); // Set user if token is still valid
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null); // No token, clear user state
    }
    
    setIsCheckingToken(false); // Stop checking token after the process is complete
  }, [setUser]);

  // If the user is not authenticated, redirect to login
  if (!user && !loading && !isCheckingToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is logged in but does not have the correct role, redirect to their respective home
  if (user && roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' || user.role === 'super-admin' ? '/home' : '/browse/pets'} replace />;
  }

  // Show loading state while token verification is in progress
  if (loading || isCheckingToken) {
    return <div>Loading...</div>; // Can be replaced with a spinner or other UI feedback
  }

  // Render the protected content if user is authenticated and has the right role
  return children;
};

export default ProtectedRoute;

