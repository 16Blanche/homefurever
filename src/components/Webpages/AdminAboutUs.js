import React from "react";
import Image from 'react-bootstrap/Image';
import NavigationBar from "./NavigationBar";
import aboutus1 from "./assets/aboutus1.png"
import aboutus2 from "./assets/aboutus2.png"
import aboutus3 from "./assets/aboutus3.png"
const AdminAboutUs = () => {
    return (
        <div className="adaboutusbox">
            <div className="navbox">
                <NavigationBar />
            </div>

                <div className="adaboutusbox3">
                    <div className="adaboutusbox4">
                        <p>
                            <span style={{ color: '#ff68c2' }}>About</span> 
                            <span style={{ color: '#545454' }}> Us</span>
                        </p>
                        <div className="adaboutusbox5">
                            <h1>Connect with us</h1>
                            <p>Facebook: Pasay City Veterinary Office</p>
                            <p>Contact Number: 12345679</p>
                        </div>
                    </div>
                    <div className="adaboutusbox6">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>                        
                        <div className="adaboutusbox7">
                            <Image src={aboutus1} className="adaboutusbox7Img"/>
                            <Image src={aboutus2} className="adaboutusbox7Img"/>
                            <Image src={aboutus3} className="adaboutusbox7Img"/>
                        </div>
                    </div>

                </div>

        </div>
    );
};

export default AdminAboutUs;

