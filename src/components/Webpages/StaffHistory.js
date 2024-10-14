import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TaskBar from './TaskBar';
import NavigationBar from './NavigationBar';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import config from '../config';

const StaffHistory = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]); // To store the filtered logs
  const [searchTerm, setSearchTerm] = useState(''); // To track search input
  const [selectedAction, setSelectedAction] = useState(''); // For action filtering
  const [startDate, setStartDate] = useState(null); // Start date for date range filter
  const [endDate, setEndDate] = useState(null); // Initialize end date to null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await axios.get(`${config.address}/api/logs/all`);
        if (response.data && Array.isArray(response.data)) {
          setActivityLogs(response.data);
          setFilteredLogs(response.data); // Set both the main and filtered logs initially
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };
    fetchActivityLogs();
  }, []);

  // Filtering logic based on search, action, and date range
  useEffect(() => {
    let logs = [...activityLogs];

    // Search Filter
    if (searchTerm) {
      logs = logs.filter(log => 
          (log.adminId?.a_username && log.adminId.a_username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }  

    if (selectedAction) {
      logs = logs.filter(log => log.action === selectedAction);
    }

    // Date Range Filter
    const currentDate = new Date(); // To use as default for filtering
    if (startDate || endDate) {
      logs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return (
          (!startDate || logDate >= startDate) &&
          (!endDate || logDate <= (endDate || currentDate))
        );
      });
    }

    setFilteredLogs(logs); // Update the filtered logs
  }, [searchTerm, selectedAction, startDate, endDate, activityLogs]);

  const columns = [
    {
      name: 'ID',
      selector: row => row.log_id || 'N/A',
      sortable: true,
      width: '120px'
    },
    {
      name: 'Username',
      selector: row => row.adminId?.a_username || 'N/A',
      sortable: true,
      width: '200px'
    },
    {
      name: 'Date',
      selector: row => new Date(row.timestamp).toLocaleDateString() || 'N/A',
      sortable: true,
      width: '200px'
    },
    {
      name: 'Time',
      selector: row => new Date(row.timestamp).toLocaleTimeString() || 'N/A',
      sortable: true,
      width: '200px'
    },
    {
      name: 'Action',
      selector: row => row.action || 'N/A',
      sortable: true,
      width: '200px'
    },
    {
      name: 'Entity Name',
      selector: row => row.entityName,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Description',
      selector: row => row.description || 'N/A',
      sortable: true,
    },
  ];

  return (
    <>
      <div className="sabox">
        <div className="navbox">
          <NavigationBar />
        </div>

        <div className="sabox2">
          <TaskBar />

          <div className="sabox3">
            <div className="sabox4">
              <h1>ADMIN ACTIVITY</h1>

              {/* Search Bar */}
              <div className="sasearch">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  paginationPerPage={13}
                  paginationRowsPerPageOptions={[5, 10, 13]}
                  highlightOnHover
                />
              </div>

              {/* Action Filter */}
              <div className="saaction">
                <Form.Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                  <option value="">All Actions</option>
                  <option value="ADD">ADD</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </Form.Select>
              </div>

              {/* Date Range Picker */}
              <div className="sadate">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="sapicker"
                />
                <DatePicker
                  selected={endDate} // It will initially be null (not showing)
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate} // Ensures end date is after start date
                  placeholderText="End Date"
                  className="sapicker"
                />
              </div>
            </div>

            {/* DataTable */}
            <div className="satable">
              <DataTable
                columns={columns}
                data={filteredLogs}
                paginationPerPage={13}
                paginationRowsPerPageOptions={[5, 10, 13]}
                pagination
                highlightOnHover
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffHistory;
