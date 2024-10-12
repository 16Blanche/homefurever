import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Homepage from "../Webpages/Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "./Homepage.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
 
const Shop =()=>{
    const [allItems,setAllItems] =useState([]);
    useEffect(()=>{
        axios.get("http://52.64.196.154/api/store/all")
        .then((response)=>{
            console.log(response.data.theItem);
            setAllItems(response.data.theItem);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])
 
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
        <br/>
            <h1>HOME-FURVER STORE</h1>
            <br/>
            <div className="Pets">
            {allItems.map((element,index)=>{
                return (<p key={index}>
            <Card style={{ width: '12rem' }}>
            <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
            <Card.Body>
                <Card.Title>{element.p_product}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item><p>Price: {("P "+element.p_price)}</p></ListGroup.Item>
                <ListGroup.Item><p>{element.p_details}</p></ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <form action={"/pet/name/"+element._id}>
                    <Button variant="primary" type="submit">Add to cart</Button>
                </form>
            </Card.Body>
            </Card>
            </p>)    
            })}
            </div>
        </div>
    )
}

export default Shop;