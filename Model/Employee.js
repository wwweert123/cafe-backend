const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        match: /^UI[A-Za-z0-9]{7}$/, // Ensures the format 'UIXXXXXXX'
    },
    name: {
        type: String,
        required: true,
    },
    email_address: {
        type: String,
        required: true,
        match: /.+\@.+\..+/, // Basic email validation regex
    },
    phone_number: {
        type: String,
        required: true,
        match: /^[89][0-9]{7}$/, // Ensures the phone number starts with 8 or 9 and is 8 digits long
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"], // Ensures the value is either 'Male' or 'Female'
    },
    cafe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cafe", // References the Cafe model
        required: true,
    },
    start_date: {
        type: Date,
        required: true, // Adds the start date when the employee begins working at the cafe
    },
});

module.exports = mongoose.model("Employee", employeeSchema);
