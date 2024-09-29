const mongoose = require("mongoose");

// UUID validation regex for version 4 UUIDs
const uuidValidator =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    logo: {
        type: String, // Optional field, can store logo image URL or path
    },
    location: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true, // Ensures the UUID is unique
        match: uuidValidator, // Basic email validation regex
    },
});

module.exports = mongoose.model("Cafe", cafeSchema, "cafes");
