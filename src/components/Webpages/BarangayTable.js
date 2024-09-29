import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png';
import './Homepage.css';
import TaskBar from './TaskBar';
import NavigationBar from './NavigationBar';
import axios from 'axios';

const BarangayTable = () => {
  const [barangays, setBarangays] = useState([]);
  const [show, setShow] = useState(false);

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [formData, setFormData] = useState({
    b_barangay: '',
    b_ownername: '',
    b_petname: '',
    b_pettype: '',
    b_petgender: '',
    b_petage: '',
    b_color: '',
    b_address: ''
  });

  const navigate = useNavigate();

useEffect(() => {
  axios.get('http://localhost:8000/api/barangay/all')
    .then(response => {
      console.log('API Response:', response.data); // Log the response data
      setBarangays(response.data.theInfo); // Update to use the correct property
    })
    .catch(error => console.error('Error fetching data:', error));
}, []);

  

  const handleClick = () => {
    navigate('/barangay/table');
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/barangay/new', formData)
      .then(response => {
        setBarangays(prevBarangays => [...prevBarangays, response.data.savedBarangay]);
        handleClose();
      })
      .catch(error => console.error('Error adding new row:', error));
  };

  return (
    <>
      <div className="box">
        <div className="navbox">
          <NavigationBar />
        </div>

        <div className="box2">
          <TaskBar />

          <div className="ulbox3">
            <div className="ulbox4">

                  <h2 className='userlist'>Barangay 1</h2>
                  <input type="text" className="petsearch" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
                  <Button onClick={handleShow} className="barangay-add-btn">
                    <p className='bt-add-text'>+ Add Row</p>
                    </Button>
                </div>
                <table className="barangay-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Owner Name</th>
                      <th>Address/Barangay/Zone</th>
                      <th>Pet Name</th>
                      <th>Species</th>
                      <th>Age</th>
                      <th>Sex</th>
                      <th>Color</th>
                      <th>Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barangays.map(barangay => (
                      <tr key={barangay.b_id}>
                        <td>{barangay.b_id}</td>
                        <td>{barangay.b_ownername}</td>
                        <td>{barangay.b_address}</td>
                        <td>{barangay.b_petname}</td>
                        <td>{barangay.b_pettype}</td>
                        <td>{barangay.b_petage}</td>
                        <td>{barangay.b_petgender}</td>
                        <td>{barangay.b_color}</td>
                        <td>{new Date(barangay.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>



      {/* Modal for adding a new row */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='b-new-box'>
            <Form.Group className='b-new-det1'>
              <Form.Group className='b-new-group'>
                <Form.Group controlId="b_barangay" className="b-brgy-grp">
                  <Form.Label>Barangay</Form.Label>
                  <Form.Control
                    type="number"
                    name="b_barangay"
                    value={formData.b_barangay}
                    onChange={handleChange}
                    min="1"
                    max="201"  // Limit to range 1-201
                    required
                    className='b-brgy-inp'
                  />
                </Form.Group>
                <Form.Group controlId="b_pettype" className="b-type-grp">
                  <Form.Label>Pet Type</Form.Label>
                  <Form.Select
                  name="b_pettype"
                  value={formData.b_pettype}
                  onChange={handleChange}
                  required
                  className='b-type-inp'
                  >
                  <option value="">Pet Type</option> {/* Placeholder */}
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  </Form.Select>
                </Form.Group>
              </Form.Group>
                <Form.Group controlId="b_ownername" >
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="b_ownername"
                    value={formData.b_ownername}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              <Form.Group controlId="b_petname" >
                <Form.Label>Pet Name</Form.Label>
                <Form.Control
                  type="text"
                  name="b_petname"
                  value={formData.b_petname}
                  onChange={handleChange}
                />

            </Form.Group>
          </Form.Group>

            <Form.Group className='b-new-det1'>
             <Form.Group className='b-new-group'>
              <Form.Group controlId="b-type-grp">
                <Form.Label>Pet Gender</Form.Label>
                <Form.Select
                  name="b_petgender"
                  value={formData.b_petgender}
                  onChange={handleChange}
                  className="b-gender-inp"
                  required
                >
                  <option value="">Select</option> {/* Placeholder */}
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="b_petage" className='b-type-grp'>
                <Form.Label>Pet Age</Form.Label>
                <Form.Control
                  type="number"
                  name="b_petage"
                  value={formData.b_petage}
                  onChange={handleChange}
                  className='b-age-inp'
                />
              </Form.Group>
            </Form.Group> 

              <Form.Group controlId="b_color" >
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="b_color"
                value={formData.b_color}
                onChange={handleChange}
              />
              </Form.Group>
              <Form.Group controlId="b_address" >
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="b_address"
                value={formData.b_address}
                onChange={handleChange}
              />
              </Form.Group>
            </Form.Group>

            </Form.Group>
            <Button variant="primary" type="submit" className='b-submit-btn'>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BarangayTable;
