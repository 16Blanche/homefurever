import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";

const NewPet = () => {
    const navigate = useNavigate();
    const [pname, setPname] = useState("");
    const [ptype, setPtype] = useState("");
    const [pgender, setPgender] = useState("");
    const [page, setPage] = useState(0);
    const [pweight, setPweight] = useState(0);
    const [pbreed, setPbreed] = useState("");
    const [pmedicalhistory, setPmedicalhistory] = useState("");
    const [pvaccines, setPvaccines] = useState("");
    const [pimg, setPimg] = useState([]);

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
        if (!pimg) newErrors.pimg = "Please upload an image.";
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
    
        axios.post("http://localhost:8000/api/pet/new", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log("Response:", response.data);
            navigate("/pet/all");
        })
        .catch((err) => {
            console.error("Error during Axios request:", err.response ? err.response.data : err.message);
        });
    };
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPimg(files);
    };
    
    

    return (
        <>
            <div className="box">
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
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onChange={(e) => { setPmedicalhistory(e.target.value) }}
                                            type="text"
                                            placeholder="Medical History"
                                            isInvalid={errors.pmedicalhistory}
                                        />
                                        <Form.Group className="nperror">
                                            <Form.Label>{errors.pmedicalhistory}</Form.Label>
                                        </Form.Group>
                                    </Form.Group>

                                    <Form.Group className="npinptitle">Vaccines</Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onChange={(e) => { setPvaccines(e.target.value) }}
                                            type="text"
                                            placeholder="Vaccines"
                                            isInvalid={errors.pvaccines}
                                        />
                                        <Form.Group className="nperror">
                                            <Form.Label>{errors.pvaccines}</Form.Label>
                                        </Form.Group>
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

export default NewPet;

