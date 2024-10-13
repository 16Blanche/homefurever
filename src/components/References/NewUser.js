import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Homepage from "../Webpages/Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "./NavBar.css";
import config from '../config';

const NewUser =()=>{
    const navigate = useNavigate();
    const [pname,setPname] = useState("");
    const [pgender,setPgender] = useState(0);
    const [pdob,setPdob] = useState(0);
    const [paddress,setPaddress] = useState("");
    const [pphonenumber,setPphonenumber] = useState(0);
    const [pemailadd,setPemailadd] = useState("");
    const [ppassword,setPpassword] = useState("");

    const registerUser=()=>{
        const newUser = {
            p_name:pname,
            p_gender:pgender,
            p_dob:pdob,
            p_address:paddress,
            p_phonenumber:pphonenumber,
            p_emailadd:pemailadd,
            p_password:ppassword
        }
        axios.post(`${config.address}/api/user/new`,newUser)
        .then((response)=>{
            console.log(response.data);
            navigate("/option");
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const handleApproveClick = (userId) => {
        // Delete the row with the specified userId
        const updatedUsers = allUsers.filter(user => user._id !== userId);
        setAllUsers(updatedUsers);
    
        // Transfer the data to a different file or endpoint
        transferDataToDifferentFile(userId);
    }
    
    const transferDataToDifferentFile = (userId) => {
        // Example: Send an HTTP request to transfer data
        axios.post('http://52.64.196.154/api/user/transfer', { userId })
            .then((response) => {
                console.log('Data transferred successfully:', response.data);
            })
            .catch((err) => {
                console.error('Error transferring data:', err);
            });
    }

    return(
        <>
            <Navbar className="navbar">
            <Container>
                <Navbar.Brand>Home-furever</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="/store/all">Shop</Nav.Link>
                    <Nav.Link href="/contact">Contact Us</Nav.Link>
                    <Nav.Link href="/chat">Chat</Nav.Link>
                    <Nav.Link href="/account">Account</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
            <h1>CREATE ACCOUNT</h1>
            <hr/>
            <p>Name: <input type="text" onChange={(e)=>{setPname(e.target.value)}}/></p>
            <p>Enter Task Name: <input onChange={(e)=>{setPname(e.target.value)}} type="text"/><p style={{color:"red"}}>{(pname.length<1)?"":""}</p></p>
            <p>Gender: <input type="text" onChange={(e)=>{setPgender(e.target.value)}}/></p>
            <p>Date of Birth: <input type="date" onChange={(e)=>{setPdob(e.target.value)}}/></p>
            <p>Address: <input type="text" onChange={(e)=>{setPaddress(e.target.value)}}/></p>
            <p>Contact Number: <input type="number" onChange={(e)=>{setPphonenumber(e.target.value)}}/></p>
            <hr/>
            <p>Email Address: <input type="text" onChange={(e)=>{setPemailadd(e.target.value)}}/></p>
            <p>Password: <input type="text" onChange={(e)=>{setPpassword(e.target.value)}}/></p>
            <hr/>
            <button onClick={()=>{registerUser()}}>CREATE</button>
        </>
    )
}

export default NewUser;