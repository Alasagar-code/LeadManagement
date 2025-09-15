// src/routes/leads.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createlead, getleads, getlead, updatelead, deletelead } = require("../controllers/leadcontroller");

router.use(auth);

router.post("/", createlead);
router.get("/", getleads);
router.get("/:id", getlead);
router.put("/:id", updatelead);
router.delete("/:id", deletelead);

module.exports = router;
