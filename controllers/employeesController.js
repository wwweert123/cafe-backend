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

// Helper function to generate the employee ID in the format 'UIXXXXXXX'
const generateEmployeeId = () => {
    const randomString = Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase(); // Generates 7 random alphanumeric characters
    return `UI${randomString}`;
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    const { name, email_address, phone_number, gender, cafe } = req.body;

    try {
        let employeeId;
        let isUnique = false;

        // While loop to ensure we generate a unique employee ID
        while (!isUnique) {
            employeeId = generateEmployeeId();
            const existingEmployee = await Employee.findOne({ id: employeeId });

            if (!existingEmployee) {
                isUnique = true; // Exit the loop when a unique ID is generated
            }
        }

        // Create the new employee
        const newEmployee = new Employee({
            id: employeeId, // The unique employee ID generated
            name,
            email_address,
            phone_number,
            gender,
            cafe,
            start_date: new Date(), // Set current date as the start date
        });

        // Save the new employee to the database
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
