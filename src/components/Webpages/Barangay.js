import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png';
import './Homepage.css';
import TaskBar from './TaskBar';
import NavigationBar from './NavigationBar';

const Barangay = () => {

    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/barangay/table'); 
    };
    
    return (
        <>
            <div className="box">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="box2">
                    <TaskBar />

                    <div className="box3">
                        <div className="animal-population-container">
                            <h2 className='animal-header'>Animal Population</h2>
                            <div className='barangay-map-container'>
                                <div className="barangay-list">
                                    <p className='barangay-subtitle'>List of Barangays</p>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 1</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 2</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 3</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 4</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 5</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 6</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 7</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 8</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 9</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 10</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 11</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 12</button>
                                </div>
                                <div className="barangay-list-2">
                                    <button className="barangay-item" onClick={handleClick}>Barangay 13</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 14</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 15</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 16</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 17</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 18</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 19</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 20</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 21</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 22</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 23</button>
                                    <button className="barangay-item" onClick={handleClick}>Barangay 24</button>
                                </div>
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.0081402280925!2d120.98201731520982!3d14.56491358982233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca1587cfcb01%3A0x10599e850f5dfc85!2sPasay%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1595391938337!5m2!1sen!2sph"
                                        width="800"
                                        height="665"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        aria-hidden="false"
                                        tabIndex="0"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Barangay;
