require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust the path if your User model is in a different location

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Create Admin Users
const createAdminUsers = async () => {
  const adminUsers = [
    {
      fullName: "Admin User One",
      idNumber: "1234567890123",
      accountNumber: "111111111",
      password: "password123",
      isAdmin: true,
    },
    {
      fullName: "Admin User Two",
      idNumber: "2345678901234",
      accountNumber: "222222222",
      password: "password123",
      isAdmin: true,
    },
    {
      fullName: "Admin User Three",
      idNumber: "3456789012345",
      accountNumber: "333333333",
      password: "password123",
      isAdmin: true,
    },
  ];

  try {
    for (let userData of adminUsers) {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const user = new User(userData);
      await user.save();
      console.log(`Admin user ${userData.fullName} added.`);
    }
    console.log("All admin users added.");
  } catch (err) {
    console.error(err.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the functions
connectDB().then(createAdminUsers);
