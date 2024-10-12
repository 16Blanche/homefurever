const Pet = require('../models/pets_model');
const Archived = require('../models/archivedpets_model');
const Counter = require('../models/counter');
const {logActivity} = require('./activitylog_controller');
 
const newPet = async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Files received:", req.files);

    // Log the entire req.user object to understand its structure
    console.log("Decoded user from JWT in newPet function:", req.user);

    // Extract adminId from req.user, using either _id or id property
    const adminId = req.user && (req.user._id || req.user.id);

    // Log the extracted adminId to ensure it's correctly set
    console.log("Admin ID extracted from req.user:", adminId);

    if (!adminId) {
        // Log the failure to extract adminId and return an error response
        console.error('Unauthorized: Admin ID not found in req.user');
        return res.status(401).json({ message: 'Unauthorized: Admin ID not found' });
    }

    // Destructure pet details from the request body
    const { p_name, p_type, p_gender, p_age, p_breed, p_weight, p_medicalhistory, p_vaccines } = req.body;
    const pet_img = req.files ? req.files.map(file => file.buffer) : [];
    console.log("Extracted image buffers:", pet_img);

    try {
        // Validate that at least one image is uploaded
        if (pet_img.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        // Create a new Pet instance and save it to the database
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

        // Log the successful pet creation
        console.log('Pet saved successfully:', savedPet);

        // Log activity using the extracted adminId
        await logActivity(
            adminId, 
            'ADD',
            'Pet',
            savedPet._id, 
            `Added new pet: ${savedPet.p_name}`
        );
        console.log('Activity logged successfully');

        // Return a success response with the saved pet data
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

const updatePetStatus = (req, res) => {
    const petId = req.params.id;
    const { p_status, p_description } = req.body;

    Pet.findByIdAndUpdate(
        petId,
        { 
            p_status: p_status, 
            p_description: p_description 
        },
        { new: true }
    )
    .then((updatedPet) => {
        res.status(200).json(updatedPet);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
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
    const { id } = req.params; // Extract pet ID from request parameters

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

const updatePet = (req, res) => {
    Pet.findOneAndUpdate({_id:req.params.id},req.body, 
        { new: true, runValidators: true })
        .then((updatedPet) => {
            res.json({ theUpdatePet: updatedPet, status: "Successfully updated the pet" })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const restorePetFromArchive = (req, res) => {
    console.log('Received request to restore pet with ID:', req.params.id);
    Archived.findById(req.params.id)
        .then((archivedPet) => {
            if (!archivedPet) {
                console.log('Archived Pet not found with ID:', req.params.id);
                return res.status(404).json({ message: 'Archived Pet not found' });
            }

            console.log('Found Archived Pet:', archivedPet);

            // Create a new document in the Pet collection
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

                    // Delete the document from the ArchivedPet collection
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
        await Counter.resetCounter('pet_id'); // Adjust 'pet_id' based on your counter _id
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
    updatePetStatus
}