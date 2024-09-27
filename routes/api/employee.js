const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");

// GET /employees
router.get("/", employeesController.getEmployees);

// POST /employee
router.post("/", employeesController.createEmployee);

// PUT /employee
router.put("/", employeesController.updateEmployee);

// DELETE /employee/:id
router.delete("/:id", employeesController.deleteEmployee);

module.exports = router;
