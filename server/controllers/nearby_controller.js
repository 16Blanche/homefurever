const Nearby = require('../models/service_model');

const createNearbyService = async (req, res) => {

    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const { ns_name, ns_address, ns_type, ns_pin } = req.body;
    const ns_image = req.file ? req.file.buffer : null;

    try {
        if (!ns_name || !ns_address || !ns_type || !ns_image) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const service = new Nearby({
            ns_name,
            ns_address,
            ns_image,
            ns_type,
            ns_pin
        });

        const savedService = await service.save();
        res.status(201).json({ savedService, status: "Service successfully inserted" });
    } catch (err) {
        console.error("Error creating nearby service:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

const getAllNearbyServices = async (req, res) => {
    try {
        const services = await Nearby.find();
        res.status(200).json(services);
    } catch (err) {
        console.error('Error fetching nearby services:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

const getNearbyServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Nearby.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (err) {
        console.error('Error fetching nearby service by ID:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

const editNearbyService = async (req, res) => {
    const { id } = req.params;
    const { ns_name, ns_address, ns_type, ns_pin } = req.body;
    const ns_image = req.file ? req.file.buffer : null;

    try {
        const service = await Nearby.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        service.ns_name = ns_name || service.ns_name;
        service.ns_address = ns_address || service.ns_address;
        service.ns_type = ns_type || service.ns_type;
        service.ns_pin = ns_pin || service.ns_pin;
        if (ns_image) {
            service.ns_image = ns_image; // Update image if a new one is provided
        }

        const updatedService = await service.save();
        res.status(200).json({ updatedService, status: 'Service successfully updated' });
    } catch (err) {
        console.error('Error editing nearby service:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

const deleteNearbyService = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Nearby.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json({ message: 'Service successfully deleted' });
    } catch (err) {
        console.error('Error deleting nearby service:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

module.exports = { createNearbyService,
    getAllNearbyServices,
    getNearbyServiceById,
    editNearbyService,
    deleteNearbyService
 };
