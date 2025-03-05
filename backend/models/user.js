const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedMoney: { type: Number, default: 0 }, // Money saved by user
});

module.exports = mongoose.model("User", userSchema);
