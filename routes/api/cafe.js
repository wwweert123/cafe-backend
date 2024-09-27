const express = require("express");
const router = express.Router();
const cafesController = require("../../controllers/cafesController");

// GET /cafes
router.get("/", cafesController.getCafes);

// POST /cafe
router.post("/", cafesController.createCafe);

// PUT /cafe
router.put("/", cafesController.updateCafe);

// DELETE /cafe/:id
router.delete("/:id", cafesController.deleteCafe);

module.exports = router;
