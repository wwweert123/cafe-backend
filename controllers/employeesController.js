const Employee = require("../Model/Employee");

// Get all employees or filter by cafe, sorted by days worked
exports.getEmployees = async (req, res) => {
    const { cafe } = req.query;
    try {
        let employees;
        if (cafe) {
            // List employees for the specific cafe
            employees = await Employee.find({ cafe })
                .populate("cafe", "name")
                .lean();
        } else {
            // List all employees
            employees = await Employee.find({}).populate("cafe", "name").lean();
        }

        if (!employees.length) {
            return res.json([]);
        }

        // Calculate days worked for each employee
        for (let employee of employees) {
            const startDate = new Date(employee.start_date);
            const currentDate = new Date();
            employee.days_worked = Math.floor(
                (currentDate - startDate) / (1000 * 60 * 60 * 24)
            );
        }

        // Sort employees by days worked in descending order
        employees.sort((a, b) => b.days_worked - a.days_worked);

        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    const { id, name, email_address, phone_number, gender, cafe, start_date } =
        req.body;
    try {
        // Check if the employee already exists
        const existingEmployee = await Employee.findOne({ id });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        // Create the new employee
        const newEmployee = new Employee({
            id,
            name,
            email_address,
            phone_number,
            gender,
            cafe,
            start_date,
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing employee, including updating their cafe relationship
exports.updateEmployee = async (req, res) => {
    const { id } = req.body;
    try {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { id },
            req.body,
            { new: true } // Returns the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an existing employee
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findOneAndDelete({ id });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
