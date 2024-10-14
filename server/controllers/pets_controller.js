const Pet = require('../models/pets_model');
const Archived = require('../models/archivedpets_model');
const Counter = require('../models/counter');
const {logActivity} = require('./activitylog_controller');
 
const newPet = async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Files received:", req.files);
    console.log("Decoded user from JWT in newPet function:", req.user);

    const adminId = req.user && (req.user._id || req.user.id);
    console.log("Admin ID extracted from req.user:", adminId);

    if (!adminId) {
        console.error('Unauthorized: Admin ID not found in req.user');
        return res.status(401).json({ message: 'Unauthorized: Admin ID not found' });
    }

    const { p_name, p_type, p_gender, p_age, p_breed, p_weight, p_medicalhistory, p_vaccines } = req.body;

    const pet_img = req.files ? req.files.map(file => `/uploads/images/${file.filename}`) : [];
    console.log("Extracted image paths:", pet_img);

    try {

        if (pet_img.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const pet = new Pet({
            p_name,
            p_type,
            p_gender,
            p_age,
            p_breed,
            p_weight,
            p_medicalhistory,
            p_vaccines,
            pet_img 
        });

        const savedPet = await pet.save();
        console.log('Pet saved successfully:', savedPet);

        await logActivity(
            adminId, 
            'ADD',
            'Pet',
            savedPet._id, 
            p_name, 
            `Added new pet`
        );
        console.log('Activity logged successfully');
        res.status(201).json({ savedPet, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating pet:", err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};


const findAllPet = (req, res) => {
    Pet.find()
        .then((allDaPet) => {
            res.json({ thePet: allDaPet })
        }) 
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const findPetsForAdoption = (req, res) => {
    Pet.find({ p_status: 'For Adoption' })
        .then((allDaPet) => {
            res.json({ thePet: allDaPet });
        }) 
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err });
        });
};

const updatePetStatus = async (req, res) => {
    const petId = req.params.id;
    const { p_status, p_description } = req.body;

    try {
        console.log("Decoded user from JWT in updatePetStatus function:", req.user);

        if (!p_status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const adminId = req.user && (req.user._id || req.user.id);
        if (!adminId) {
            console.error('Unauthorized: Admin ID not found in req.user');
            return res.status(401).json({ message: 'Unauthorized: Admin ID not found' });
        }

        pet.p_status = p_status;
        pet.p_description = p_description;

        const updatedPet = await pet.save();

        const message = p_status === 'For Adoption'
            ? `Posted  for adoption`
            : p_status === 'None'
                ? `Removed  adoption post`
                : `Updated status of ${updatedPet.p_name}`;

        await logActivity(
            adminId,
            'UPDATE',
            'Pet',
            updatedPet._id,
            updatedPet.p_name,
            message 
        );

        console.log('Activity logged successfully for pet status update:', message);

        res.status(200).json(updatedPet);
    } catch (err) {
        console.error("Error updating pet status:", err);
        res.status(500).json({ message: 'Error updating pet status', error: err.message });
    }
};
 
const findPetByName = (req, res) => {
    Pet.findOne({p_name:req.params.pname})
        .then((thePet) => {
            res.json({ thePet })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const findPetByType = (req, res) => {
    Pet.find({p_type:req.params.ptype})
        .then((thePet) => {
            res.json({ thePet })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const findPetByGender = (req, res) => {
    Pet.find({p_gender:req.params.pgender})
       .then((thepetdb) => {
            res.json({ thePet: thepetdb })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const findPetByBreed = (req, res) => {
    Pet.find({p_breed:req.params.pbreed})
    .then((thepetdb) => {
            res.json({ thePet: thepetdb })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const findPetById = (req, res) => {
    const { id } = req.params; 

    Pet.findById(id)
        .then((thePet) => {
            if (!thePet) {
                return res.status(404).json({ message: 'Pet not found' });
            }
            res.json({ thePet });
        })
        .catch((err) => {
            console.error('Error finding pet by ID:', err);
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};

 
const findPetByIdDelete = (req, res) => {
   Pet.findByIdAndDelete({_id:req.params.pid})
        .then((deletedPet) => {
            res.json({ deletedPet, message: "Congratulations! Pet has been adopted." })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
};

const updatePet = async (req, res) => {
    try {
        console.log("Decoded user from JWT in updatePet function:", req.user);
        
        const originalPet = await Pet.findById(req.params.id);
        if (!originalPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const adminId = req.user && (req.user._id || req.user.id);
        if (!adminId) {
            console.error('Unauthorized: Admin ID not found in req.user');
            return res.status(401).json({ message: 'Unauthorized: Admin ID not found' });
        }

        const updatedPet = await Pet.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const fieldMap = {
            p_name: 'Name',
            p_type: 'Type',
            p_gender: 'Gender',
            p_age: 'Age',
            p_breed: 'Breed',
            p_weight: 'Weight',
            p_medicalhistory: 'Medical History',
            p_vaccines: 'Vaccines',
            pet_img: 'Image',
        };

        const updatedFields = Object.keys(req.body).filter(field => {
            if (Array.isArray(originalPet[field]) && Array.isArray(updatedPet[field])) {
                return !arraysEqual(originalPet[field], updatedPet[field]);
            }
            return originalPet[field] !== updatedPet[field]; 
        }).map(field => fieldMap[field]);

        const changesDescription = updatedFields.join(', ');

        await logActivity(
            adminId,
            'UPDATE',
            'Pet',
            updatedPet._id,
            updatedPet.p_name,
            changesDescription
        );
        console.log('Activity logged successfully for pet update');

        res.json({ theUpdatePet: updatedPet, status: "Successfully updated the pet" });
    } catch (err) {
        console.error("Error updating pet:", err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

const archivePet = async (req, res) => {
    try {
        console.log("Decoded user from JWT in archivePet function:", req.user);
        
        const petId = req.params.id;
        const archiveReason = req.body.reason; 

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const adminId = req.user && (req.user._id || req.user.id);
        if (!adminId) {
            console.error('Unauthorized: Admin ID not found in req.user');
            return res.status(401).json({ message: 'Unauthorized: Admin ID not found' });
        }

        pet.p_status = archiveReason || 'Archived'; 

        const updatedPet = await pet.save();

        await logActivity(
            adminId,
            'ARCHIVE',
            'Pet',
            updatedPet._id,
            updatedPet.p_name, 
            `Archived with reason: ${updatedPet.p_status}`
        );

        console.log('Activity logged successfully for pet archiving');

        res.json({ theArchivedPet: updatedPet, status: "Successfully archived the pet" });
    } catch (err) {
        console.error("Error archiving pet:", err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};




const restorePetFromArchive = (req, res) => {
    console.log('Received request to restore pet with ID:', req.params.id);
    Archived.findById(req.params.id)
        .then((archivedPet) => {
            if (!archivedPet) {
                console.log('Archived Pet not found with ID:', req.params.id);
                return res.status(404).json({ message: 'Archived Pet not found' });
            }

            console.log('Found Archived Pet:', archivedPet);

            const restoredPet = new Pet({
                p_name: archivedPet.ap_name,
                p_img: archivedPet.ap_img,
                p_type: archivedPet.ap_type,
                p_gender: archivedPet.ap_gender,
                p_age: archivedPet.ap_age,
                p_weight: archivedPet.ap_weight,
                p_breed: archivedPet.ap_breed,
                p_medicalhistory: archivedPet.ap_medicalhistory,
                p_vaccines: archivedPet.ap_vaccines
            });

            console.log('Creating Pet document:', restoredPet);

            restoredPet.save()
                .then((restoredPet) => {
                    console.log('Restored Pet saved successfully:', restoredPet);

                    Archived.findByIdAndDelete(req.params.id)
                        .then(() => {
                            console.log('Archived Pet deleted successfully');
                            res.json({ message: 'Pet restored successfully', restoredPet });
                        })
                        .catch((err) => {
                            console.error('Error deleting Archived Pet:', err);
                            res.status(500).json({ message: 'Error deleting archived pet', error: err });
                        });
                })
                .catch((err) => {
                    console.error('Error saving restored Pet:', err);
                    res.status(500).json({ message: 'Error restoring pet', error: err });
                });
        })
        .catch((err) => {
            console.error('Error finding archived pet:', err);
            res.status(500).json({ message: 'Error finding archived pet', error: err });
        });
};

const resetCounter = async (req, res) => {
    try {
        await Counter.resetCounter('pet_id'); 
        res.status(200).json({ message: 'Pet counter reset successfully.' });
    } catch (err) {
        console.error('Error resetting pet counter:', err);
        res.status(500).json({ error: 'Unable to reset pet counter.' });
    }
};

module.exports = {
    newPet,
    findAllPet,
    findPetByName,
    findPetByType,
    findPetByGender,
    findPetByBreed,
    findPetById,
    findPetByIdDelete,
    updatePet,
    restorePetFromArchive,
    resetCounter,
    findPetsForAdoption,
    updatePetStatus,
    archivePet
}