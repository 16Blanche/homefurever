import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";

const StaffHistory = () => {
    const navigate = useNavigate();
 

    return (
        <>
            <div className="box">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="box2">
                    <TaskBar />

                    <div className="npbox3">
 
                    </div>
                </div>
            </div>
        </>
    );
}

export default StaffHistory;

