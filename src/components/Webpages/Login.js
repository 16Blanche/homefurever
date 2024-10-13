import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import Homepage from "./Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "./Homepage.css";
import LogoImg from "./assets/logo.png"
import PinkNavigationBar from "./PinkNavigationBar";
import { jwtDecode } from 'jwt-decode';
import StartNavBar from "./StartNavBar";
import config from '../config';

const Login =()=>{
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('pending'); // Track user type: pending or verified
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${config.address}/api/user/login`, {
            username,
            password
          });
          const token = response.data.accessToken;
          localStorage.setItem('token', token); // Save the token to localStorage
          
          // Decode and store user info
          const decodedToken = jwtDecode(token);
          const userRole = decodedToken.role;
      
          if (userRole === 'pending' || userRole === 'verified') {
            navigate('/browse/pets');
          } else if (userRole === 'admin' || userRole === 'super-admin') {
            navigate('/home');
          } else if (userRole === 'pending-admin') {
            navigate('/admin/welcome');
          }
          
        } catch (err) {
          console.error(err);
          setError('Invalid username or password');
        }
      };
      
      

    return(
    <>
    <div className="mainloginbox">
        <div className="navbox">
            <StartNavBar/>
            <div className="loginbox1">
                <div className="loginbox2">
                    <Image className="loginlogo"require src={LogoImg}></Image>
                    <h1 className="logintxt">Login</h1>
                    <p className="logtitle">Username</p>
                        <input type="text" className="loginput" placeholder="Enter your username" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                        <div className="logerrordiv">
                            {error && <p className="log-error-message">{error}</p>}
                        </div>
                    <p className="logtitle">Password</p>
                        <input type="password" className="loginput" placeholder="Enter your password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                        <div className="logerrordiv">
                            {error && <p className="log-error-message">{error}</p>}
                        </div>
                    <div className="signlink">
                    <p>Don't have an account?</p>
                    <Link to="/signup" > Sign up </Link>
                    </div>

                    <form action="/home" onSubmit={handleLogin}>
                        <button type="submit" className="loginbtn">Log in</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>)
}

export default Login;