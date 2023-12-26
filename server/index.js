require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Configuring multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const filename = file.mimetype.includes("image")
      ? `${file.fieldname}-${Date.now()}.jpg`
      : `${file.fieldname}-${Date.now()}.mp4`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Creating database connection
const dbConn = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER_NAME || "root",
  password: process.env.DB_USER_PASSWORD || "",
  database: process.env.DB_NAME || "instagram",
  port: process.env.DB_PORT || 3306,
});

dbConn.connect(function (err) {
  if (err) {
    console.error("MySQL connection error:", err);
    throw err;
  }
  console.log("Database was connected");

  // Define your routes
  app.get("/", (req, res) => {
    res.send("Hello, this is the root of the application!");
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
