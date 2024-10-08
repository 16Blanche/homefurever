import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Homepage.css';
import TaskBar from './TaskBar';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

const BarangayTable = () => {
  const [barangays, setBarangays] = useState([]);
  const [show, setShow] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredBarangays, setFilteredBarangays] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [importError, setImportError] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState(''); 
  const [editError, setEditError] = useState(null);
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
        setBarangays(response.data.theInfo);
        setFilteredBarangays(response.data.theInfo);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCellClick = (row, columnName) => {
    setEditingCell({ rowId: row._id, columnName });
    setEditValue(row[columnName]);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };
  
  const handleEditSave = (row) => {
    if (!editingCell) return;
  
    // Validation: Check if the edit value is empty
    if (editValue.trim() === '') {
      setEditError('This field cannot be blank'); // Set validation error
      return; // Prevent saving the empty value
    }
  
    setEditError(null); // Clear validation error if any
  
    if (editValue !== row[editingCell.columnName]) {
      const updatedBarangays = barangays.map((barangay) =>
        barangay._id === row._id ? { ...barangay, [editingCell.columnName]: editValue } : barangay
      );
  
      setBarangays(updatedBarangays);
      setFilteredBarangays(updatedBarangays);
  
      axios
        .put(`http://localhost:8000/api/barangay/update/${row._id}`, { [editingCell.columnName]: editValue })
        .then((response) => {
          console.log('PUT request successful. Response from backend:', response.data);
  
          const updatedBarangay = response.data.updatedBarangay;
          setBarangays((prevBarangays) =>
            prevBarangays.map((barangay) => (barangay._id === row._id ? updatedBarangay : barangay))
          );
          setFilteredBarangays((prevBarangays) =>
            prevBarangays.map((barangay) => (barangay._id === row._id ? updatedBarangay : barangay))
          );
        })
        .catch((error) => {
          console.error('Error updating data with axios.put:', error);
        });
    }
  
    setEditingCell(null);
  };
    
  const EditableCell = ({ row, columnName }) => {
    const isEditing = editingCell?.rowId === row._id && editingCell?.columnName === columnName;
  
    if (isEditing && columnName === 'b_petgender') {
      return (
        <select
          value={editValue}
          onChange={handleEditChange}
          onBlur={() => handleEditSave(row)}
          autoFocus
          style={{ width: '100%' }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      );
    }
  
    return isEditing ? (
      <div>
        <input
          type="text"
          value={editValue}
          onChange={handleEditChange}
          onBlur={() => handleEditSave(row)}
          autoFocus
          style={{ width: '100%' }}
        />
        {editError && <div style={{ color: 'red', marginTop: '5px' }}>{editError}</div>}
      </div>
    ) : (
      <span
        onClick={() => handleCellClick(row, columnName)}
        style={{ cursor: 'pointer' }}
      >
        {row[columnName]}
      </span>
    );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/barangay/new', formData)
      .then(response => {
        setBarangays(prevBarangays => [...prevBarangays, response.data.savedBarangay]);
        setFilteredBarangays(prevBarangays => [...prevBarangays, response.data.savedBarangay]);
        window.alert("Row successfully added.");
        handleClose();
      })
      .catch(error => console.error('Error adding new row:', error));
  };

  const columns = [
    { name: 'ID', selector: row => row.b_id, sortable: true, width: '70px' },
    { name: 'Barangay', selector: row => <EditableCell row={row} columnName="b_barangay" />, sortable: true, width: '120px' },
    { name: 'Owner Name', selector: row => <EditableCell row={row} columnName="b_ownername" />, sortable: true, grow: 2 },
    { name: 'Address/Barangay/Zone', selector: row => <EditableCell row={row} columnName="b_address" />, sortable: true, grow: 3 },
    { name: 'Pet Name', selector: row => <EditableCell row={row} columnName="b_petname" />, sortable: true, width: '150px' },
    { name: 'Species', selector: row => <EditableCell row={row} columnName="b_pettype" />, sortable: true, width: '120px' },
    { name: 'Age', selector: row => <EditableCell row={row} columnName="b_petage" />, sortable: true, width: '100px' },
    { name: 'Sex', selector: row => <EditableCell row={row} columnName="b_petgender" />, sortable: true, width: '100px' },
    { name: 'Color', selector: row => <EditableCell row={row} columnName="b_color" />, sortable: true, width: '150px' },
    {
      name: 'Date Added',
      selector: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
      sortable: true,
      width: '150px',
    },
  ];

  useEffect(() => {
    if (filterText === '') {
      setFilteredBarangays(barangays);
    } else {
      const filteredData = barangays.filter(item => item.b_barangay.toString() === filterText);
      setFilteredBarangays(filteredData);
    }
  }, [filterText, barangays]);

  const handleCloseImportModal = () => setShowImportModal(false);
  const handleShowImportModal = () => setShowImportModal(true);
  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const requiredHeaders = ['Barangay', 'Owner Name', 'Address/Barangay/Zone', 'Pet Name', 'Species', 'Age', 'Sex', 'Color'];

      const fileHeaders = Object.keys(worksheet[0] || {});

      const headersMatch = requiredHeaders.every(header => fileHeaders.includes(header));

      if (!headersMatch) {
        setImportError(`Excel format is incorrect. Please ensure headers are: ${requiredHeaders.join(', ')}.`);
        setFileData([]);
        return;
      }
      const incompleteRows = worksheet.filter(row =>
        requiredHeaders.some(header => row[header] === undefined || row[header] === '' || row[header] === null)
      );

      if (incompleteRows.length > 0) {
        setImportError(`The Excel file has incomplete data. Please ensure all fields are filled.`);
        setFileData([]);
        return;
      }

      setFileData(worksheet);
      setImportError('');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmitImportedData = () => {
    fileData.forEach((row) => {
      const formattedRow = {
        b_barangay: row['Barangay'],
        b_ownername: row['Owner Name'],
        b_petname: row['Pet Name'],
        b_pettype: row['Species'],
        b_petgender: row['Sex'],
        b_petage: row['Age'],
        b_color: row['Color'],
        b_address: row['Address/Barangay/Zone'],
      };

      axios.post('http://localhost:8000/api/barangay/new', formattedRow)
        .then(response => {
          setBarangays(prevBarangays => [...prevBarangays, response.data.savedBarangay]);
          setFilteredBarangays(prevBarangays => [...prevBarangays, response.data.savedBarangay]);
        })
        .catch(error => console.error('Error saving imported data to database:', error));
    });

    setFileData([]);
    window.alert("File successfully imported.");
    handleCloseImportModal();
    alert('Data successfully imported and saved to the database!');
  };
  
  const handleExport = () => {
    const exportData = filteredBarangays.map(item => ({
      'ID': item.b_id,                         
      'Barangay': item.b_barangay,               
      'Owner Name': item.b_ownername,            
      'Address/Barangay/Zone': item.b_address,  
      'Pet Name': item.b_petname,               
      'Species': item.b_pettype,                
      'Age': item.b_petage,                   
      'Sex': item.b_petgender,                
      'Color': item.b_color,                  
      'Date Added': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Barangays');

    XLSX.writeFile(workbook, 'BarangaysData.xlsx');
  };

  return (
    <>
      <div className="barangay-box">
        <div className="navbox">
          <NavigationBar />
        </div>

        <div className="box2">
          <TaskBar />

          <div className="ulbox3">
            <div className="ulbox4">
              <h2 className='barangay-header'>BARANGAY ANIMAL RECORD</h2>
              <p className='barangay-listp'>Barangay: </p>
              <input
                type="text"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className='barangay-search-bar'
              />
              <Button onClick={handleShow} className="barangay-add-btn">
                <p className='bt-add-text'>+ Add Row</p>
              </Button>
              <Button onClick={handleShowImportModal} className="barangay-add-btn">
                <p className='bt-add-text'>+ Import Data</p>
              </Button>
              <Button onClick={handleExport} className="barangay-add-btn">
                <p className='bt-add-text'>Export to Excel</p>
              </Button>
            </div>
            <div className="barangay-table">
              <DataTable
                columns={columns}
                data={filteredBarangays}
                paginationPerPage={13}
                paginationRowsPerPageOptions={[5, 10, 13]}
                pagination
                highlightOnHover
                responsive
                fixedHeader
                striped
              />
            </div>
          </div>
        </div>
      </div>

            {/* Import Modal */}
            <Modal show={showImportModal} onHide={handleCloseImportModal}>
        <Modal.Header closeButton>
          <Modal.Title>Import Data from Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Excel File</Form.Label>
              <Form.Control type="file" accept=".xlsx, .xls" onChange={handleImport} />
            </Form.Group>
            {importError && <div style={{ color: 'red', marginTop: '10px' }}>{importError}</div>}


          </Form>
        </Modal.Body>
        <Modal.Footer>
            {/* Show a Submit button if fileData is valid */}
            {fileData.length > 0 && (
              <Button
                variant="primary"
                onClick={handleSubmitImportedData}
                style={{ marginTop: '20px' }}
              >
                Submit Imported Data
              </Button>
            )}
        </Modal.Footer>
      </Modal>

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
                  required
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
                  required
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
                required
              />
              </Form.Group>
              <Form.Group controlId="b_address" >
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="b_address"
                value={formData.b_address}
                onChange={handleChange}
                required
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
