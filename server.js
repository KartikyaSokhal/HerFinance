const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Your MySQL password
    database: "herfinance"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password and insert into database
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
                 [username, email, hashedPassword], 
                 (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Signup failed" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
