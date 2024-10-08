const Cafe = require("../Model/Cafe");
const Employee = require("../Model/Employee");
const { v4: uuidv4 } = require("uuid");

// Get all cafes, or filter by location, sorted by number of employees
exports.getCafes = async (req, res) => {
    const { location } = req.query;
    try {
        let cafes;
        if (location) {
            // Find cafes in the specified location
            cafes = await Cafe.find({ location }).lean();
        } else {
            // List all cafes
            cafes = await Cafe.find({}).lean();
        }

        if (!cafes.length) {
            return res.json([]);
        }

        // Calculate number of employees for each cafe
        for (let cafe of cafes) {
            cafe.employees = await Employee.countDocuments({ cafe: cafe._id });
        }

        // Sort cafes by number of employees in descending order
        cafes.sort((a, b) => b.employees - a.employees);

        res.json(cafes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new cafe
exports.createCafe = async (req, res) => {
    const { name, description, logo, location } = req.body;
    try {
        const newCafe = new Cafe({
            name,
            description,
            logo,
            location,
            id: uuidv4(),
        });

        await newCafe.save();
        res.status(201).json(newCafe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing cafe
exports.updateCafe = async (req, res) => {
    const { id } = req.body;
    try {
        const updatedCafe = await Cafe.findOneAndUpdate(
            { id },
            req.body,
            { new: true } // Returns the updated document
        );

        // TODO: need update employee cafe field (?)

        if (!updatedCafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        res.json(updatedCafe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an existing cafe and its employees
exports.deleteCafe = async (req, res) => {
    const { id } = req.params;
    try {
        const cafe = await Cafe.findOneAndDelete({ id });

        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        // Delete all employees associated with this cafe
        await Employee.deleteMany({ cafe: cafe._id });

        res.json({ message: "Cafe and its employees deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
