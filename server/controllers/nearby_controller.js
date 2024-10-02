const Nearby = require('../models/service_model'); // Make sure this path is correct

const createNearbyService = async (req, res) => {
    // Log the request body and uploaded file for debugging
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const { ns_name, ns_address, ns_type } = req.body; // Extracting from req.body
    const ns_image = req.file ? req.file.buffer : null; // Handle image upload

    try {
        // Validate inputs
        if (!ns_name || !ns_address || !ns_type || !ns_image) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a new nearby service instance
        const service = new Nearby({
            ns_name,     // Match the schema
            ns_address,  // Match the schema
            ns_image,    // Match the schema
            ns_type      // Match the schema
        });

        // Save the service to the database
        const savedService = await service.save();
        res.status(201).json({ savedService, status: "Service successfully inserted" });
    } catch (err) {
        console.error("Error creating nearby service:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

// Export the controller
module.exports = { createNearbyService };
