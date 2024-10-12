import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-number-input/style.css';
import Image from 'react-bootstrap/Image';
import NavigationBar from "./NavigationBar";
import AddPhoto from "./assets/addphoto.png";
import "./Homepage.css";

const SignUpRef = () => {
    const navigate = useNavigate();
    const [pusername, setPusername] = useState("");
    const [ppassword, setPpassword] = useState("");
    const [prepassword, setPrepassword] = useState("");
    const [pemailadd, setPemailadd] = useState("");
    const [padd, setPadd] = useState("");
    const [pcontactnumber, setPcontactnumber] = useState("");
    const [pgender, setPgender] = useState("");
    const [pbirthdate, setPbirthdate] = useState(null);
    const [pvalidID, setPvalidID] = useState(null); // Use null for the initial state

    const registerUser = () => {
        const formData = new FormData();
        formData.append("p_username", pusername);
        formData.append("p_password", ppassword);
        formData.append("p_repassword", prepassword);
        formData.append("p_emailadd", pemailadd);
        formData.append("p_add", padd);
        formData.append("p_contactnumber", pcontactnumber);
        formData.append("p_gender", pgender);
        formData.append("p_birthdate", pbirthdate ? pbirthdate.toLocaleDateString("en-GB") : "");
        formData.append("p_validID", pvalidID);

        axios.post("http://52.64.196.154/api/user/new", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log(response.data);
            navigate("/option");
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleFileChange = (e) => {
        setPvalidID(e.target.files[0]);
    };

    return (
        <>
            <div className="signupbox">
                <div className="navbox">
                    <NavigationBar />
                </div>
                <div className="signupbox1">
                    <h1 className="signuptxt">Sign Up</h1>
                    <div className="signupbox2">
                        <div className="signupbox3">
                            <div className="signuserrow">
                                <button className="signaddphotobtn">
                                    <Image src={AddPhoto} className="signaddphoto" />
                                </button>
                                <div className="signuserdiv">
                                    <p className="title">Username</p>
                                    <input
                                        type="text"
                                        className="signinput"
                                        placeholder="Enter username"
                                        onChange={(e) => setPusername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <p className="title">Email Address</p>
                            <input
                                type="text"
                                className="signinput"
                                placeholder="Enter email address"
                                onChange={(e) => setPemailadd(e.target.value)}
                            />
                            <div className="signnamerow">
                                <div className="signnamediv">
                                    <p className="title">First Name</p>
                                    <input
                                        type="text"
                                        className="signshortinput"
                                        placeholder="Enter first name"
                                        onChange={(e) => setPusername(e.target.value)}
                                    />
                                </div>
                                <div className="signnamediv">
                                    <p className="title">Last Name</p>
                                    <input
                                        type="text"
                                        className="signshortinput"
                                        placeholder="Enter last name"
                                        onChange={(e) => setPemailadd(e.target.value)}
                                    />
                                </div>
                                <div className="signmiddiv">
                                    <p className="title">M.I.</p>
                                    <input
                                        type="text"
                                        className="signinput"
                                        placeholder="M.I"
                                        onChange={(e) => setPemailadd(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="pwbox">
                                <div className="pwbox2">
                                    <p className="title">Password</p>
                                    <input
                                        type="text"
                                        className="signshortinput"
                                        placeholder="Enter password"
                                        onChange={(e) => setPpassword(e.target.value)}
                                    />
                                </div>
                                <div className="pwbox2">
                                    <p className="title">Re-enter Password</p>
                                    <input
                                        type="text"
                                        className="signshortinput"
                                        placeholder="Re-enter password"
                                        onChange={(e) => setPrepassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <p className="title">Address</p>
                            <input
                                type="text"
                                className="signinput"
                                placeholder="Enter complete address"
                                onChange={(e) => setPadd(e.target.value)}
                            />
                        </div>
                        <div className="signupbox3">
                            <div className="signupbox4">
                                <div className="signupbox5">
                                    <p className="title">Contact Number</p>
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        defaultCountry="PH"
                                        value={pcontactnumber}
                                        onChange={setPcontactnumber}
                                        className="signshortinput"
                                    />
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
                                </div>
                            </div>
                            <p className="title">Gender</p>
                            <div className="gender">
                                <input
                                    type="radio"
                                    value="Male"
                                    name="gender"
                                    onChange={(e) => setPgender(e.target.value)}
                                />Male
                                <input
                                    type="radio"
                                    className="gendertext"
                                    value="Female"
                                    name="gender"
                                    onChange={(e) => setPgender(e.target.value)}
                                />Female
                            </div>
                            <p className="title">Valid ID</p>
                            <input
                                type="file"
                                className="signinput"
                                onChange={handleFileChange}
                            />
                            <div>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    registerUser();
                                }}>
                                    <button type="submit" className="submitbtn">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpRef;
