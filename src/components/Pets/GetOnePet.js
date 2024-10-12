import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Homepage from "../Webpages/Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "./NavBar.css";

const GetOnePet =()=>{
    const navigate = useNavigate();
    const {pid}=useParams();
    const [thePet,setThePet]=useState({});
    const [petName,setPetname]=useState("");
    const [petq1,setPetq1]=useState("");
    const [petq2,setPetq2]=useState("");
    const [petq3,setPetq3]=useState("");
    const [petq4,setPetq4]=useState("");

    const AnswerHandler =(e)=>{
        e.preventDefault();
        console.log(petq1);
        console.log(petq2);
        console.log(petq3);
        console.log(petq4);
    }

    useEffect(()=>{
        axios.get("http://52.64.196.154/api/pet/"+pid)
        .then((response)=>{
            console.log(response.data);
            setThePet(response.data.thePet);
            setPetname(response.data.thePet.p_name);
        })
        .catch((err)=>{
            console.log(err);
        })    
    },[])
 
const deletePet=(pid)=>{
    const resp = window.confirm("Adopt this pet?");
    if(resp)
    {
        axios.delete("http://52.64.196.154/api/pet/delete/"+pid)
        .then((response)=>{
            console.log(response.data);
            navigate("/adopt");
        })
        .catch((err)=>{
            console.log(err)
        })
    }
}

return(
    <div>
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
        <hr/>
        <h1>{petName}</h1>
        <hr/>
        <p><img width={100} height={100} src={thePet.p_img}/></p>
        <p>Type: {thePet.p_type}</p>
        <p>Gender: {thePet.p_gender}</p>
        <p>Age: {thePet.p_age}</p>
        <p>Weight: {thePet.p_weight}</p>
        <p>Breed: {thePet.p_breed}</p>
        <p>Medical History: {thePet.p_medicalhistory}</p>
        <p>Vaccines: {thePet.p_vaccines}</p>
        <p>Inclusions: {thePet.p_inclusions}</p>
        <hr/>
        <form>
            <p>Describe your living environment: <input type="text" onChange={(e)=>{setPetq1(e.target.value)}}></input></p>
            <p>Do you have experience with pets?: <input type="text" onChange={(e)=>{setPetq2(e.target.value)}}></input></p>
            <p>Pet Care Plan: <input type="text" onChange={(e)=>{setPetq3(e.target.value)}}></input></p>
            <p>Reason for Adopting: <input type="text" onChange={(e)=>{setPetq4(e.target.value)}}></input></p>
            <button onClick={(e)=>{AnswerHandler(e)}}>SUBMIT</button>
        </form>
        <p><button onClick={()=>{deletePet(thePet._id)}}>ADOPT</button></p>
    </div>
    )
}
 
export default GetOnePet;