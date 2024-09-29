import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named export

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token:', error);
        setUser(null); // Clear user state on error
        localStorage.removeItem('token');
      }
    } else {
      setUser(null); // Clear user state if no token found
    }
  }, []); // Empty dependency array for mounting effect only
  

  return { user };
};
