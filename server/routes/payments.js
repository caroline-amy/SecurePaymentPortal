const express = require("express");
const { check, validationResult } = require("express-validator");
const Payment = require("../models/Payment"); // Create a Payment model
const router = express.Router();

// Endpoint to handle customer payments
router.post(
  "/",
  [
    check("amount", "Amount is required and must be a number").isNumeric(),
    check("currency", "Currency is required and must be a 3-letter code")
      .matches(/^[A-Z]{3}$/)
      .withMessage("Currency should be a 3-letter code (e.g., USD, EUR)"),
    check("provider", "Provider is required").isString(),
    check("accountInfo", "Account Information should be alphanumeric")
      .isAlphanumeric()
      .withMessage("Account information should contain only letters and numbers"),
    check("swiftCode", "SWIFT Code should be 8 or 11 characters")
      .matches(/^[A-Z0-9]{8,11}$/)
      .withMessage("SWIFT code should be 8 or 11 alphanumeric characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, provider, accountInfo, swiftCode } = req.body;

    try {
      // Create and save new payment
      const newPayment = new Payment({
        amount,
        currency,
        provider,
        accountInfo,
        swiftCode,
        status: "Pending", // Default status for new payments
      });

      await newPayment.save();
      res.json({ msg: "Payment submitted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Route to fetch all pending payments for employees
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Pending" });
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err.message);
    res.status(500).send("Server error");
  }
});

// Endpoint to verify a payment
router.put("/:id/verify", async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) return res.status(404).json({ msg: "Payment not found" });
  
      payment.status = "Verified";
      await payment.save();
      res.json({ msg: "Payment verified successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  

module.exports = router;
