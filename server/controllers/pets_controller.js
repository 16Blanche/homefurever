const Pet = require('../models/pets_model');
const Archived = require('../models/archivedpets_model');
const Counter = require('../models/counter');
 
const newPet = async (req, res) => {
    const { 
        p_name, p_type, p_gender, p_age, p_breed, 
        p_weight, p_medicalhistory, p_vaccines 
    } = req.body;
    
    const pet_img = req.file ? req.file.buffer : null;

    try {
        if (!pet_img) {
            return res.status(400).json({ error: 'Image upload failed' });
        }

        // Create a new pet instance
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

        // Save the pet to the database
        const savedPet = await pet.save();
        res.status(201).json({ savedPet, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating pet:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
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
    const { p_status } = req.body;

    Pet.findByIdAndUpdate(petId, { p_status }, { new: true })
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