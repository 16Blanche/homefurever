const Pet = require('../models/pets_model');
const Adoption = require('../models/adoption_model');
const Verified = require('../models/verified_model');
const Feedback = require('../models/feedback_model');

const submitAdoptionForm = async (req, res) => {
    console.log('Submit adoption form called');
    console.log('Decoded user:', req.user);
    console.log('Form data:', req.body);

    try {
        const {
            pet_id,
            home_type,
            years_resided,
            adults_in_household,
            children_in_household,
            allergic_to_pets,
            household_description,
            occupation,
        } = req.body;

        const pet = await Pet.findById(pet_id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const user = await Verified.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const adoptionForm = new Adoption({
            v_id: user._id,
            p_id: pet._id,
            full_name: `${user.v_lname} ${user.v_fname} ${user.v_mname ? user.v_mname : ''}`.trim(),
            occupation: occupation || '',
            address: user.v_add || '',
            email: user.v_emailadd,
            contact_number: user.v_contactnumber,
            home_type,
            years_resided,
            adults_in_household,
            children_in_household,
            allergic_to_pets,
            household_description,
            pet_name: pet.p_name,
            pet_type: pet.p_type,
            pet_age: pet.p_age,
            pet_gender: pet.p_gender,
        });
        const savedForm = await adoptionForm.save();
        res.status(201).json({ message: 'Adoption form submitted successfully', a_id: savedForm.a_id, form: savedForm });
    } catch (err) {
        console.error('Error submitting form:', err);
        res.status(500).json({ message: 'Error submitting form', error: err.message });
    }
};


// Admin approves an adoption application (status -> 'active')
const approveAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.id;
        const { visitDate, visitTime } = req.body;

        // Find the adoption form by ID and update the status to 'active'
        const adoption = await Adoption.findByIdAndUpdate(adoptionId, {
            status: 'accepted',
            visitDate,
            visitTime
        }, { new: true });
        
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption form not found' });
        }

        res.status(200).json({ message: 'Adoption approved and visit scheduled', adoption });
    } catch (err) {
        res.status(500).json({ message: 'Error approving adoption', error: err.message });
    }
};

const declineAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.id;
        const { rejection_reason } = req.body;

        const adoption = await Adoption.findByIdAndUpdate(adoptionId, { 
            status: 'rejected',
            rejection_reason 
        }, { new: true });
        
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption form not found' });
        }

        res.status(200).json({ message: 'Adoption declined', adoption });
    } catch (err) {
        res.status(500).json({ message: 'Error declining adoption', error: err.message });
    }
};



// Get all pending adoption applications
const getPendingAdoptions = async (req, res) => {
    try {
        // Populate the v_id and p_id to retrieve associated user and pet details
        const pendingAdoptions = await Adoption.find({ status: 'pending' })
            .populate('v_id', 'v_fname v_lname v_mname v_add v_emailadd v_contactnumber v_username v_gender v_birthdate v_img') // Select relevant fields from 'Verified'
            .populate('p_id', 'pet_img p_name p_type p_age p_gender p_breed'); // Select relevant fields from 'Pet'

        res.status(200).json(pendingAdoptions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pending adoptions', error: err.message });
    }
};


// Get all active adoption applications
const getActiveAdoptions = async (req, res) => {
    try {
        const activeAdoptions = await Adoption.find({ status: 'accepted' })
            .populate('v_id', 'v_fname v_lname v_mname v_add v_emailadd v_contactnumber v_username v_gender v_birthdate v_img') // Select relevant fields from 'Verified'
            .populate('p_id', 'pet_img p_name p_type p_age p_gender p_breed'); // Select relevant fields from 'Pet'
        res.status(200).json(activeAdoptions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pending adoptions', error: err.message });
    }
};

const getDeclinedAdoptions = async (req, res) => {
    try {
        const declinedAdoptions = await Adoption.find({ status: 'rejected' });
        res.status(200).json(declinedAdoptions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching declined adoptions', error: err.message });
    }
};

// Mark adoption as complete and update pet's status to 'adopted'
const completeAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.id;
        
        // Find the adoption by ID
        const adoption = await Adoption.findById(adoptionId);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
        }

        // Mark the adoption as complete
        adoption.status = 'complete';
        await adoption.save();

        // Update the pet's status to 'adopted'
        const pet = await Pet.findByIdAndUpdate(adoption.p_id, { p_status: 'adopted' }, { new: true });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json({ message: 'Adoption marked as complete and pet status updated to adopted', adoption, pet });
    } catch (err) {
        res.status(500).json({ message: 'Error completing adoption', error: err.message });
    }
};


// Mark adoption as failed
const failAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.id;
        const { reason } = req.body;
        const adoption = await Adoption.findByIdAndUpdate(adoptionId, { status: 'failed', failedReason: reason }, { new: true });

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
        }

        res.status(200).json({ message: 'Adoption marked as failed', adoption });
    } catch (err) {
        res.status(500).json({ message: 'Error marking adoption as failed', error: err.message });
    }
};

const getPastAdoptions = async (req, res) => {
    try {
        const pastAdoptions = await Adoption.find({ status: { $in: ['failed', 'rejected', 'complete'] } })
            .populate('v_id', 'v_fname v_lname v_mname v_add v_emailadd v_contactnumber v_username v_gender v_birthdate v_img')
            .populate('p_id', 'pet_img p_name p_type p_age p_gender p_breed');
        res.status(200).json(pastAdoptions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching completed adoptions', error: err.message });
    }
};


const submitFeedback = async (req, res) => {
    const { adoptionId, rating, feedbackText } = req.body;

    if (!adoptionId || !rating) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }

    try {
        const adoption = await Adoption.findByIdAndUpdate(
            adoptionId,
            { feedbackRating: rating, feedbackText: feedbackText },
            { new: true }
        );

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
        }

        return res.status(200).json({ message: 'Feedback submitted successfully', adoption });
    } catch (err) {
        console.error('Error submitting feedback:', err);
        return res.status(500).json({ message: 'Error submitting feedback', error: err.message });
    }
};

const checkFeedbackExists = async (req, res) => {
    const { adoptionId } = req.params;

    if (!adoptionId) {
        return res.status(400).json({ message: 'Invalid adoptionId parameter' });
    }

    try {
        console.log('Checking feedback for adoptionId:', adoptionId);
        const adoption = await Adoption.findOne({
            _id: adoptionId,
            'feedbackRating': { $exists: true, $ne: null },
            'feedbackText': { $exists: true, $ne: null }
        });

        console.log('Adoption found:', adoption);
        return res.status(200).json({ exists: !!adoption });
    } catch (err) {
        console.error('Error checking feedback:', err);
        return res.status(500).json({ message: 'Error checking feedback', error: err.message });
    }
};

const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Adoption.find({
            feedbackRating: { $exists: true },
            feedbackText: { $exists: true }
        })
        .populate({
            path: 'v_id',
            select: 'v_username', 
        })
        .select('feedbackRating feedbackText v_id'); 

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedbacks found' });
        }

        const feedbackData = feedbacks.map(feedback => ({
            feedbackRating: feedback.feedbackRating,
            feedbackText: feedback.feedbackText,
            adopterUsername: feedback.v_id ? feedback.v_id.v_username : 'Unknown', 
        }));


        res.status(200).json(feedbackData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    submitAdoptionForm,
    approveAdoption,
    declineAdoption,
    getPendingAdoptions,
    getActiveAdoptions,
    getDeclinedAdoptions,
    completeAdoption,
    failAdoption,
    submitFeedback,
    checkFeedbackExists,
    getAllFeedbacks,
    getPastAdoptions

};
