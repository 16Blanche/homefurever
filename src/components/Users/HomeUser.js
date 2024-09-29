import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import StartImage from './assets/startimg.png'
import './Homepage';
import NavigationBar from "./PinkNavigationBar";

const HomeUser=()=>{
    return (
        <>
        <div className="startbox1">
            <div className="navbox">
            <NavigationBar/>
            </div>

            <div className="startbox2">
            <div className="gradient">
                <Image require src={TheImage} className="startmainbg"></Image>
                <div className="startbox3">
                    <form action="/login" className="loginbox">
                            <Button className="loginbutton" type="submit">Log in</Button>
                        </form>
                    <Image require src={StartImage} className="startimg"></Image>
                </div>
                
            </div>
        </div>
        </div>
        

        </>

    );
}

export default HomeUser;