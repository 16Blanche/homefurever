import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'react-bootstrap/Image';
import Homepage from "./Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "./Homepage.css";
import NavigationBar from "./NavigationBar";
import AddPhoto from "./assets/addphoto.png"

const SignUp =()=>{
    
    const navigate = useNavigate();
    const [pimg,setPimg] = useState("");
    const [pusername,setPusername] = useState("");
    const [pemailadd,setPemailadd] = useState("");
    const [pfname,setPfname] = useState("");
    const [plname,setPlname] = useState("");
    const [pmname,setPmname] = useState("");
    const [ppassword,setPpassword] = useState("");
    const [prepassword,setPrepassword] = useState("");
    const [padd,setPadd] = useState("");
    const [pcontactnumber,setPcontactnumber] = useState("");
    const [pgender,setPgender] = useState("");
    const [pbirthdate,setPbirthdate] = useState("");
    const [pvalidID,setPvalidID] = useState("");


    const registerUser=()=>{
        const newUser = {
            p_img:pimg,
            p_username:pusername,
            p_emailadd:pemailadd,
            p_fname:pfname,
            p_lname:plname,
            p_mname:pmname,
            p_password:ppassword,
            p_repassword:prepassword,
            p_add:padd,
            p_contactnumber:pcontactnumber,
            p_gender:pgender,
            p_birthdate: pbirthdate ? pbirthdate.toLocaleDateString("en-GB") : "", // Format birthdate to DD/MM/YYYY
            p_validID:pvalidID
        }
        axios.post("http://52.64.196.154/api/user/new",newUser)
        .then((response)=>{
        console.log(response.data);
        navigate("/home");
    })
    .catch((err)=>{
        console.log(err);
    })
}

    const handleFileChange = (e) => {
        setPvalidID(e.target.files[0]);
    };

    const handleImgChange = (e) => {
        setPimg(e.target.value);
    }

    return(
    <>
    <div className="signupbox">
        <div className="navbox">
            <NavigationBar/>
        </div>
            <div className="signupbox1">
                <h1 className="signuptxt">Sign Up</h1>

                <div className="signupbox2">
                    <div className="signupbox3">
                        
                        <div className="signuserrow">
                            <label htmlFor="fileInput">
                                <Image src={AddPhoto} className="signaddphoto" />
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleImgChange}
/>
                            {/* <button className="signaddphotobtn" type="file">
                                <Image require src={AddPhoto} className="signaddphoto"></Image>
                            </button> */}
                            <div className="signuserdiv">
                                <p className="title">Username</p>
                                <input type="text" className="signinput" placeholder="Enter username" onChange={(e)=>{setPusername(e.target.value)}}/>
                            </div>
                        </div>

                        <p className="title">Email Address</p>
                            <input type="text" className="signinput" placeholder="Enter email address" onChange={(e)=>{setPemailadd(e.target.value)}}/>
                        
                        <div className="signnamerow">
                            <div className="signnamediv">
                                <p className="title">First Name</p>
                                <input type="text" className="signshortinput" placeholder="Enter first name" onChange={(e)=>{setPfname(e.target.value)}}/>
                            </div>
                            <div className="signnamediv">
                            <p className="title">Last Name</p>
                                <input type="text" className="signshortinput" placeholder="Enter last name" onChange={(e)=>{setPlname(e.target.value)}}/>
                            </div>
                            <div className="signmiddiv">
                            <p className="title">M.I.</p>
                                <input type="text" className="signinput" placeholder="M.I" onChange={(e)=>{setPmname(e.target.value)}}/>
                            </div>
                        </div>

                        <div className="pwbox">

                            <div className="pwbox2">
                                <p className="title">Password</p>
                                <input type="password" className="signshortinput" placeholder="Enter password" onChange={(e)=>{setPpassword(e.target.value)}}/>
                            </div>

                            <div className="pwbox2">
                                <p className="title">Re-enter Password</p>
                                <input type="password" className="signshortinput" placeholder="Re-enter password" onChange={(e)=>{setPrepassword(e.target.value)}}/>
                            </div>
                        </div>
                        
                    </div>

                    <div className="signupbox3">
                    <p className="title">Address</p>
                            <input type="text" className="signinput" placeholder="Enter complete address" onChange={(e)=>{setPadd(e.target.value)}}/>
                        <div className="signupbox4">

                            <div className="signupbox5">
                                <p className="title">Contact Number</p>
                                <PhoneInput placeholder="Enter phone number" defaultCountry="PH" className="signshortinput" onChange={setPcontactnumber}/>
                                {/* <input type="text" className="signshortinput" placeholder="Enter your contact number here" onChange={(e)=>{setPcontactnumber(e.target.value)}}/> */}
                            </div>

                            <div className="signupbox5">
                                <p className="title">Birthdate</p>
                                <DatePicker
                                        selected={pbirthdate}
                                        onChange={date => setPbirthdate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="DD/MM/YYYY"
                                        className="signshortinput"
                                    />
                                {/* <input type="text" className="signshortinput" placeholder="Enter your contact number here" onChange={(e)=>{setPbirthdate(e.target.value)}}/> */}
                            </div>
                        </div>
                        
                        <div className="signupbox6">
                            <div className="signupbox8">
                                <div className="signupbox7">
                                    <p className="title">Gender</p>
                                    <div className="gender">
                                        <input type="radio" value="Male" name="gender"onChange={(e)=>{setPgender(e.target.value)}}/>Male
                                        <input type="radio" className="gendertext" value="Female" name="gender"onChange={(e)=>{setPgender(e.target.value)}}/>Female
                                    </div>
                                </div> 
                                <div className="signupbox7">
                                    <p className="title">Valid ID</p>
                                    <div className="validid">
                                    <input type="file" onChange={handleFileChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div>
                        
                        
                        
                    
                    <form action="/home" >
                        <button type="submit" className="submitbtn">Sign Up</button>
                    </form>     
                </div>
                </div>               
            </div>
            
            </div>
        </div>
    </>)
}

export default SignUp;