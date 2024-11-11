const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  accountInfo: { type: String, required: true },
  swiftCode: { type: String, required: true },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
