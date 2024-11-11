require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");
const cors = require("cors");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// SSL Configuration
const sslOptions = {
  key: fs.readFileSync("server.key"), // Path to the private key
  cert: fs.readFileSync("server.cert"), // Path to the certificate
};

// Start HTTPS Server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
