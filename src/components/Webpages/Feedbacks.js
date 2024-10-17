import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRatings from 'react-star-ratings'; 
import './Homepage.css';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import config from '../config';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`${config.address}/api/feedback`); 
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <div className="fbmainbox">
            <div className="navbox">
                <NavigationBar />
            </div>
            <div className="box2">
                <TaskBar />
                <div className="fbbox3">
                    <div className="fbbox4">
                        <h2 className="fbtitle">FEEDBACKS</h2>
                        <p className="fbsubtitle">Reviews and Ratings</p>
                        <div className="feedbackbox">
                            {feedbacks.map((feedback, index) => (
                                <div key={index} className="fbcontainer">
                                    <div className="fbline1">
                                        <p className="fbusername">{feedback.adopterUsername}</p>
                                        <StarRatings
                                            rating={feedback.feedbackRating}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="20px"
                                            starSpacing="2px"
                                            className="fbstars"
                                        />
                                    </div>
                                    <p className="fbcontent">{feedback.feedbackText}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedbacks;
