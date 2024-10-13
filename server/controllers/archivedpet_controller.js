const ArchivedPet = require('../models/archivedpets_model');
const Pet = require('../models/pets_model');

const deletePetByIdAndTransferData = (req, res) => {
    console.log('Received request to delete pet with ID:', req.params.id);
    const archiveReason = req.params.archiveReason;

    Pet.findByIdAndDelete(req.params.id)
        .then((deletedPet) => {
            if (!deletedPet) {
                console.log('Pet not found with ID:', req.params.id);
                return res.status(404).json({ message: 'Pet not found' });
            }

            console.log('Deleted Pet:', deletedPet);

            // Create a new ArchivedPet instance with the data from deletedPet
            const archivedPet = new ArchivedPet({
                ap_id: deletedPet.p_id,
                ap_name: deletedPet.p_name,
                ap_img: deletedPet.pet_img,
                ap_type: deletedPet.p_type,
                ap_gender: deletedPet.p_gender,
                ap_age: deletedPet.p_age,
                ap_weight: deletedPet.p_weight,
                ap_breed: deletedPet.p_breed,
                ap_medicalhistory: deletedPet.p_medicalhistory,
                ap_vaccines: deletedPet.p_vaccines,
                ap_reason: archiveReason
            });

            console.log('Creating ArchivedPet document:', archivedPet);

            archivedPet.save()
                .then((savedArchivedPet) => {
                    console.log('Archived Pet saved successfully:', savedArchivedPet);
                    res.json({ message: 'Pet deleted and data transferred successfully', deletedPet, savedArchivedPet });
                })
                .catch((err) => {
                    console.error('Error saving ArchivedPet:', err);
                    res.status(500).json({ message: 'Error transferring data', error: err });
                });
        })
        .catch((err) => {
            console.error('Error deleting pet:', err);
            res.status(500).json({ message: 'Error deleting pet', error: err });
        });
};



const findAllArchived = (req, res) => {
    ArchivedPet.find()
        .then((allTheArchived) => {
            res.json({ apets: allTheArchived });
        }) 
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};

const findArchivedByName = (req, res) => {
    ArchivedPet.findOne({ap_name :req.params.apname})
        .then((theArchived) => {
            res.json({ theArchived })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const updateArchivedPet = (req, res) => {
    Pet.findOneAndUpdate({ap_name:req.params.apname},req.body, 
        { new: true, runValidators: true })
        .then((updatedPet) => {
            res.json({ theUpdatePet: updatedPet, status: "Successfully updated the pet" })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports = {
    deletePetByIdAndTransferData,
    findAllArchived,
    findArchivedByName,
    updateArchivedPet
};