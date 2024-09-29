// import React, { createContext, useState, useEffect } from 'react';
// import {jwtDecode} from 'jwt-decode'; 

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedUser = jwtDecode(token);
//         console.log('User decoded:', decodedUser); // Debugging
//         setUser(decodedUser);
//       } catch (error) {
//         console.error('Invalid token:', error);
//         setUser(null);
//         localStorage.removeItem('token');
//       }
//     } else {
//       setUser(null);
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem('token', token);
//     const decodedUser = jwtDecode(token);
//     console.log('User logged in:', decodedUser); // Debugging
//     setUser(decodedUser);
//   };

//   const logout = () => {
//     return new Promise((resolve) => {
//         localStorage.removeItem('token');
//         setUser(null);
//         resolve(); // Ensure logout finishes before proceeding
//     });
// };


//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('token');
            setUser(null);
        }
    }
    setLoading(false);
}, []);


  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    return new Promise((resolve) => {
      localStorage.removeItem('token');
      setUser(null); // Clear user state immediately
      resolve(); // Ensure logout finishes before proceeding
    });
  };
  


  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;