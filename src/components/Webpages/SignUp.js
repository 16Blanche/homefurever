import axios from "axios"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./Homepage.css";
import AddPhoto from "./assets/addphoto.png";
import StartNavBar from "./StartNavBar";
import config from '../config';

const SignUp = () => {
    const navigate = useNavigate();
    const [pimg, setPimg] = useState("");
    const [pusername, setPusername] = useState("");
    const [pemailadd, setPemailadd] = useState("");
    const [pfname, setPfname] = useState("");
    const [plname, setPlname] = useState("");
    const [pmname, setPmname] = useState("");
    const [ppassword, setPpassword] = useState("");
    const [prepassword, setPrepassword] = useState("");
    const [padd, setPadd] = useState("");
    const [pcontactnumber, setPcontactnumber] = useState("");
    const [pgender, setPgender] = useState("");
    const [pbirthdate, setPbirthdate] = useState("");
    const [pvalidID, setPvalidID] = useState(null);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false); 
    const [privacyAccepted, setPrivacyAccepted] = useState(false); 

    const validate = () => {
        const newErrors = {};
        if (!pusername || pusername.length < 3) newErrors.pusername = "Username must be at least 3 characters long.";
        if (!pemailadd || !/\S+@\S+\.\S+/.test(pemailadd)) newErrors.pemailadd = "Email address is invalid.";
        if (!pfname) newErrors.pfname = "First name is required.";
        if (!plname) newErrors.plname = "Last name is required.";
        if (!ppassword || ppassword.length < 6) newErrors.ppassword = "Password must be at least 6 characters long.";
        if (ppassword !== prepassword) newErrors.prepassword = "Passwords do not match.";
        if (!padd) newErrors.padd = "Address is required.";
        if (!pcontactnumber || !/^\+?[1-9]\d{1,14}$/.test(pcontactnumber)) newErrors.pcontactnumber = "Contact number is invalid.";
        if (!pbirthdate) newErrors.pbirthdate = "Birthdate is required.";
        if (!pgender) newErrors.pgender = "Gender is required.";
        if (!pvalidID) newErrors.pvalidID = "Valid ID is required.";
        return newErrors;
    };

    const handleOpenModal = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setShowModal(true); 
    };

    const handleAcceptAndSubmit = () => {
        if (!privacyAccepted) return; 

        const newUser = {
            pending_id: undefined,
            p_img: pimg,
            p_username: pusername,
            p_emailadd: pemailadd,
            p_fname: pfname,
            p_lname: plname,
            p_mname: pmname,
            p_password: ppassword,
            p_repassword: prepassword,
            p_add: padd,
            p_contactnumber: pcontactnumber,
            p_gender: pgender,
            p_birthdate: pbirthdate ? pbirthdate.toLocaleDateString("en-GB") : "",
            p_validID: pvalidID
        };

        const formData = new FormData();
        Object.keys(newUser).forEach(key => {
            if (newUser[key] instanceof File) {
                formData.append(key, newUser[key]);
            } else {
                formData.append(key, newUser[key]);
            }
        });

        axios.post(`${config.address}/api/user/new`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log(response.data);
            const emailData = {
                to: pemailadd,
                subject: 'Account Application Status',
                text: `Good Day,${pfname}!\n\nThank you for signing up with us!\n\nPlease note that your account is currently pending verification. Our admin team will review your credentials shortly. In the meantime, you are welcome to browse through the wonderful pets available on our platform.\n\nIf you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nPasay Animal Shelter`,
            };

            return axios.post(`${config.address}/api/send-email`, emailData);
        })
        .then(() => {
            setShowModal(false);
            window.alert("Sign up successful! You may now log in to your account.");
            navigate("/login");
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleFileChange = (e) => {
        setPvalidID(e.target.files[0]);
    };

    const handleImgChange = (e) => {
        setPimg(e.target.files[0]);
    };

    return (
        <div className="signupbox">
            <StartNavBar/>
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
                            <div className="signuserdiv">
                                <p className="title">Username</p>
                                <input type="text" className="signinput" placeholder="Enter username" onChange={(e) => { setPusername(e.target.value) }} />
                                <div className="signerror">
                                    {errors.pusername && <p className="error">{errors.pusername}</p>}
                                </div>
                            </div>
                        </div>

                        <p className="title">Email Address</p>
                        <input type="text" className="signinput" placeholder="Enter email address" onChange={(e) => { setPemailadd(e.target.value) }} />
                        <div className="signerror">
                            {errors.pemailadd && <p className="error">{errors.pemailadd}</p>}
                        </div>

                        <div className="signnamerow">
                            <div className="signnamediv">
                                <p className="title">First Name</p>
                                <input type="text" className="signshortinput" placeholder="Enter first name" onChange={(e) => { setPfname(e.target.value) }} />
                                <div className="signerror">
                                    {errors.pfname && <p className="error">{errors.pfname}</p>}
                                </div>
                            </div>
                            <div className="signnamediv">
                                <p className="title">Last Name</p>
                                <input type="text" className="signshortinput" placeholder="Enter last name" onChange={(e) => { setPlname(e.target.value) }} />
                                <div className="signerror">
                                    {errors.plname && <p className="error">{errors.plname}</p>}
                                </div>
                            </div>
                            <div className="signmiddiv">
                                <p className="title">M.I.</p>
                                <input type="text" className="signinput" placeholder="M.I" onChange={(e) => { setPmname(e.target.value) }} />
                            </div>
                        </div>

                        <div className="pwbox">
                            <div className="pwbox2">
                                <p className="title">Password</p>
                                <input type="password" className="signshortinput" placeholder="Enter password" onChange={(e) => { setPpassword(e.target.value) }} />
                                <div className="signerror">
                                    {errors.ppassword && <p className="error">{errors.ppassword}</p>}
                                </div>
                            </div>

                            <div className="pwbox2">
                                <p className="title">Re-enter Password</p>
                                <input type="password" className="signshortinput" placeholder="Re-enter password" onChange={(e) => { setPrepassword(e.target.value) }} />
                                <div className="signerror">
                                    {errors.prepassword && <p className="error">{errors.prepassword}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="signupbox3">
                        <p className="title">Address</p>
                        <input type="text" className="signinput" placeholder="Enter complete address" onChange={(e) => { setPadd(e.target.value) }} />
                        <div className="signerror">
                            {errors.padd && <p className="error">{errors.padd}</p>}
                        </div>
                        <div className="signupbox4">
                            <div className="signupbox5">
                                <p className="title">Contact Number</p>
                                <PhoneInput placeholder="Enter phone number" defaultCountry="PH" className="signshortinput" onChange={setPcontactnumber} />
                                <div className="signerror">
                                    {errors.pcontactnumber && <p className="error">{errors.pcontactnumber}</p>}
                                </div>
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
                                <div className="signerror">
                                    {errors.pbirthdate && <p className="error">{errors.pbirthdate}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="signupbox6">
                            <div className="signupbox8">
                                <div className="signupbox7">
                                    <p className="title">Gender</p>
                                    <div className="gender">
                                        <input type="radio" value="Male" name="gender" onChange={(e) => { setPgender(e.target.value) }} />Male
                                        <input type="radio" className="gendertext" value="Female" name="gender" onChange={(e) => { setPgender(e.target.value) }} />Female
                                    </div>
                                    <div className="signerror">
                                        {errors.pgender && <p className="error">{errors.pgender}</p>}
                                    </div>
                                </div>
                                <div className="signupbox7">
                                    <p className="title">Valid ID</p>
                                    <div className="validid">
                                        <input type="file" onChange={handleFileChange} />
                                    </div>
                                    <div className="signerror">
                                        {errors.pvalidID && <p className="error">{errors.pvalidID}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="signindiv">
                            <Button type="submit" className="signinbtn" onClick={handleOpenModal}>Sign Up</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Data Privacy */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Data Privacy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your privacy is important to us. This statement outlines how we collect, use, and protect your information when you sign up for our service.</p>
                    <p>Here's a summary of how we handle your information:</p>
                    <h4>What We Collect:</h4>
                    <ul>
                        <li>Basic info like name, email, phone, and address.</li>
                        <li>Additional details about your preferences and usage of our app.</li>
                    </ul>
                    <h4>How We Use It:</h4>
                    <ul>
                        <li>To manage your account and deliver our services.</li>
                        <li>To personalize your experience and send relevant updates.</li>
                        <li>To analyze trends and improve our app.</li>
                    </ul>
                    <h4>Security & Sharing:</h4>
                    <ul>
                        <li>We keep your data secure and don't sell it to third parties.</li>
                        <li>Trusted partners may access your info to support our services.</li>
                    </ul>
                    <h4>Your Rights:</h4>
                    <ul>
                        <li>You can access, correct, or delete your data anytime.</li>
                    </ul>
                    <h4>Contact Us:</h4>
                    <ul>
                        <li>For questions or concerns, reach out to us.</li>
                    </ul>
                    <p>By signing up, you acknowledge our privacy practices.</p>
                    <Form.Check 
                        type="checkbox"
                        label="I accept the Data Privacy Policy"
                        checked={privacyAccepted}
                        onChange={() => setPrivacyAccepted(!privacyAccepted)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAcceptAndSubmit} disabled={!privacyAccepted}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SignUp;
