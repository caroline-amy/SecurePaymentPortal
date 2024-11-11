const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// Register Route with RegEx Validation
router.post(
  "/register",
  [
    check("fullName")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Full name must contain only letters and spaces."),
    check("idNumber")
      .matches(/^\d{13}$/)
      .withMessage("ID number must be exactly 13 digits."),
    check("accountNumber")
      .isNumeric()
      .withMessage("Account number must be numeric."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, idNumber, accountNumber, password } = req.body;

    try {
      let user = await User.findOne({ idNumber });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        fullName,
        idNumber,
        accountNumber,
        password: hashedPassword,
        isAdmin: false, // Default to non-admin, adjust as needed
      });
      await newUser.save();
      res.json({ msg: "User registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login Route with Validation
router.post(
  "/login",
  [
    check("idNumber")
      .matches(/^\d{13}$/)
      .withMessage("ID number must be exactly 13 digits."),
    check("password")
      .exists()
      .withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { idNumber, password } = req.body;

    try {
      let user = await User.findOne({ idNumber });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

