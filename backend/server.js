const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));

const express = require("express");
const app = express();
require("dotenv").config();
require("./db"); // Ensure MongoDB is connected

app.use(express.json()); // Parse JSON request body

// Import routes
const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
