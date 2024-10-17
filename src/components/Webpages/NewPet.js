import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import config from '../config';
import CreatableSelect from "react-select/creatable";

const vaccineOptions = [
    { value: "Rabies", label: "Rabies" },
    { value: "Parvovirus", label: "Parvovirus" },
    { value: "Distemper", label: "Distemper" },
    { value: "Adenovirus", label: "Adenovirus" },
    { value: "Leptospirosis", label: "Leptospirosis" },
    { value: "Bordetella", label: "Bordetella" },
    { value: "Parainfluenza", label: "Parainfluenza" },
    { value: "Lyme disease", label: "Lyme disease" },
    { value: "Feline Leukemia", label: "Feline Leukemia" },
    { value: "Calicivirus", label: "Calicivirus" }
  ];


const NewPet = () => {
    const navigate = useNavigate();
    const [pname, setPname] = useState("");
    const [ptype, setPtype] = useState("");
    const [pgender, setPgender] = useState("");
    const [page, setPage] = useState(0);
    const [pweight, setPweight] = useState(0);
    const [pbreed, setPbreed] = useState("");
    const [pmedicalhistory, setPmedicalhistory] = useState([]);
    const [pvaccines, setPvaccines] = useState([]);    
    const [pimg, setPimg] = useState([]);

    const [medicalHistoryInput, setMedicalHistoryInput] = useState(""); 
    const [vaccineInput, setVaccineInput] = useState("");
    const [selectedVaccine, setSelectedVaccine] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!pname || pname.length < 1) newErrors.pname = "Name must be at least 1 character long.";
        if (!ptype) newErrors.ptype = "Please choose a species.";
        if (!pgender) newErrors.pgender = "Please choose a gender.";
        if (!page) newErrors.page = "Pet age is required.";
        if (!pbreed) newErrors.pbreed = "Please specify breed.";
        if (!pweight) newErrors.pweight = "Please specify weight.";
        if (!pmedicalhistory) newErrors.pmedicalhistory = "Please specify medical history.";
        if (!pvaccines) newErrors.pvaccines = "Please specify vaccines.";
        if (pimg.length === 0) newErrors.pimg = "Please upload at least one image."; 
        return newErrors;
    };

    const registerPet = () => {

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("p_name", pname);
        formData.append("p_type", ptype);
        formData.append("p_gender", pgender);
        formData.append("p_age", page);
        formData.append("p_breed", pbreed);
        formData.append("p_weight", pweight);
        formData.append("p_medicalhistory", pmedicalhistory);
        formData.append("p_vaccines", pvaccines);

        pimg.forEach((img) => {
            formData.append("pet_img", img);
        });

        const token = localStorage.getItem('token'); 

        axios.post(`${config.address}/api/pet/new`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log("Response:", response.data);
            window.alert("Successfully added a pet!");
            navigate("/pet/all"); 
        })
        .catch((err) => {
            console.error("Error during Axios request:", err.response ? err.response.data : err.message);
        });
    };

    const handleAddMedicalHistory = () => {
        if (medicalHistoryInput.trim() !== "" && !pmedicalhistory.includes(medicalHistoryInput)) {
            setPmedicalhistory([...pmedicalhistory, medicalHistoryInput]);
            setMedicalHistoryInput("");
        }
    };

    const handleRemoveMedicalHistory = (indexToRemove) => {
        setPmedicalhistory(pmedicalhistory.filter((_, index) => index !== indexToRemove));
    };

    const handleAddVaccine = () => {
        if (selectedVaccine && !pvaccines.includes(selectedVaccine)) {
          setPvaccines([...pvaccines, selectedVaccine]); 
          setSelectedVaccine(""); 
        }
      };

      const handleSelectChange = (newValue) => {
        if (newValue) {
          setSelectedVaccine(newValue.value || newValue);
        }
      };
    
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); 
          handleAddVaccine(); 
        }
      };

      const handleRemoveVaccine = (indexToRemove) => {
        setPvaccines(pvaccines.filter((_, index) => index !== indexToRemove));
      };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPimg(files);
    };
    
    return (
        <>
            <div className="npmainbox">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="box2">
                    <TaskBar />

                    <div className="npbox3">
                        <h1 className="nptitle">ADD A PET</h1>
                        <br />
                        <div className="info">
                            <div className="detailsone">
                                <Form>
                                    <Form.Group className="npinptitle">Name</Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onChange={(e) => { setPname(e.target.value) }}
                                            type="text"
                                            placeholder="Name"
                                            isInvalid={errors.pname}
                                        />
                                        <Form.Group className="nperror">
                                            <Form.Label>{errors.pname}</Form.Label>
                                        </Form.Group>
                                    </Form.Group>

                                    <Form.Group className="npinptitle">Age</Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onChange={(e) => { setPage(e.target.value) }}
                                            type="number"
                                            placeholder="Age"
                                            isInvalid={errors.page}
                                        />
                                        <Form.Group className="nperror">
                                            <Form.Label>{errors.page}</Form.Label>
                                        </Form.Group>
                                    </Form.Group>

                                    <Form.Group className="npinptitle">Gender</Form.Group>
                                    <Form.Group className="npradio">
                                        <Form.Check
                                            type="radio"
                                            label="Male"
                                            name="gender"
                                            value="Male"
                                            checked={pgender === "Male"}
                                            onChange={(e) => { setPgender(e.target.value) }}
                                            isInvalid={errors.pgender}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Female"
                                            name="gender"
                                            value="Female"
                                            checked={pgender === "Female"}
                                            onChange={(e) => { setPgender(e.target.value) }}
                                            isInvalid={errors.pgender}
                                        />
                                    </Form.Group>
                                    <Form.Group className="nperror">
                                        <Form.Label>{errors.pgender}</Form.Label>
                                    </Form.Group>

                                    <Form.Group className="npinpstitle">Species</Form.Group>
                                    <Form.Group className="npradio">
                                        <Form.Check
                                            type="radio"
                                            label="Dog"
                                            name="species"
                                            value="Dog"
                                            checked={ptype === "Dog"}
                                            onChange={(e) => { setPtype(e.target.value) }}
                                            isInvalid={errors.ptype}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Cat"
                                            name="species"
                                            value="Cat"
                                            checked={ptype === "Cat"}
                                            onChange={(e) => { setPtype(e.target.value) }}
                                            isInvalid={errors.ptype}
                                        />
                                    </Form.Group>
                                    <Form.Group className="nperror">
                                        <Form.Label>{errors.ptype}</Form.Label>
                                    </Form.Group>
                                </Form>
                            </div>

                            <br />
                            <div className="detailstwo">
                                <Form >
                                <Form.Group className="npinptitle">Medical History</Form.Group>
                                    <Form.Group className="npinpbtn mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter medical history"
                                            value={medicalHistoryInput}
                                            onChange={(e) => setMedicalHistoryInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" ? (e.preventDefault(), handleAddMedicalHistory()) : null}
                                            isInvalid={errors.pmedicalhistory}
                                        />
                                        <Button variant="primary" onClick={handleAddMedicalHistory}>Add</Button>
                                    </Form.Group>
                                    <Form.Group className="nptags-container">
                                        {pmedicalhistory.map((history, index) => (
                                            <div key={index} className="tag">
                                                <span>{history}</span>
                                                <button type="button" onClick={() => handleRemoveMedicalHistory(index)}>x</button>
                                            </div>
                                        ))}
                                    </Form.Group>


                                    <Form.Group className="npinptitle">Vaccines</Form.Group>
                                    <Form.Group className="npinpbtn mb-3">
                                        <CreatableSelect
                                        options={vaccineOptions} 
                                        onChange={handleSelectChange} 
                                        placeholder="Enter or select a vaccine"
                                        isClearable
                                        styles={customStyles} 
                                        value={selectedVaccine ? { value: selectedVaccine, label: selectedVaccine } : null} 
                                        onKeyDown={handleKeyDown} 
                                        />
                                        <Button variant="primary" onClick={handleAddVaccine}>Add</Button>
                                    </Form.Group>

                                    <Form.Group className="nptags-container">
                                        {pvaccines.map((vaccine, index) => (
                                        <div key={index} className="tag">
                                            <span>{vaccine}</span>
                                            <button type="button" onClick={() => handleRemoveVaccine(index)}>
                                            x
                                            </button>
                                        </div>
                                        ))}
                                    </Form.Group>

                                    <Form.Group className="np2inrow">
                                        <Form.Group className="np2rowinp">
                                            <Form.Group className="npinptitle">Breed</Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        onChange={(e) => { setPbreed(e.target.value) }}
                                                        type="text"
                                                        placeholder="Breed"
                                                        isInvalid={errors.pbreed}
                                                    />
                                                    <Form.Group className="nperror">
                                                        <Form.Label>{errors.pbreed}</Form.Label>
                                                    </Form.Group>
                                                </Form.Group>
                                            </Form.Group>

                                        <Form.Group className="np2rowinp2">
                                            <Form.Group className="npinptitle">Weight (kg)</Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        onChange={(e) => { setPweight(e.target.value) }}
                                                        type="number"
                                                        placeholder="Weight"
                                                        isInvalid={errors.pweight}
                                                    />
                                                    <Form.Group className="nperror">
                                                    <Form.Label>{errors.pweight}</Form.Label>
                                                </Form.Group>
                                            </Form.Group>
                                        </Form.Group>
                                    </Form.Group>

                                    {/* File Input for Image Upload */}
                                    <Form.Group className="npinptitle">Images</Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="file" 
                                            name="pet_img" 
                                            multiple 
                                            onChange={handleFileChange}
                                            isInvalid={errors.pimg}
                                        />
                                        <Form.Group className="nperror">
                                            <Form.Label>{errors.pimg}</Form.Label>
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>

                        <br />
                        <br />

                        <Button onClick={registerPet} className="npbutton">POST</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
const customStyles = {
    control: (base) => ({
      ...base,
      minWidth: '245px', 
      maxWidth: '245px',
    }),
    menu: (base) => ({
      ...base,
      minWidth: '245px',
      maxWidth: '245px', 
    }),
    singleValue: (base) => ({
      ...base,
      minWidth: '245px',
    })
  };

export default NewPet;
