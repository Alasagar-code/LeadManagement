// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login, logout, me } = require("../controllers/authcontroller");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);

module.exports = router;
