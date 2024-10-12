const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");

//configure environment variables
dotenv.config();

//create a connection object
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//test the connection
db.connect((err) => {
  //unsuccessful connection
  if (err) {
    console.error("error connecting to the database: ", err);
    return;
  }
  //connection successful
  console.log("Successfully connected to the database");
});

// Question 1:Retrieve all Patients
app.get("/patients", (req, res) => {
  const getPatients = "SELECT * FROM Patients";
  db.query(getPatients, (err, data) => {
    //if i have an error
    if (err) {
      return res.status(400).send("Failed to get patients", err);
    }
    res.status(200).send(data);
  });
});

// Question 2 retrieve all providers
app.get("/providers", (req, res) => {
  const getProviders =
    "SELECT first_name, last_name, provider_specialty FROM Providers";
  db.query(getProviders, (err, data) => {
    // If there's an error
    if (err) {
      return res.status(400).send("Failed to get providers: " + err);
    }
    res.status(200).send(data);
  });
});

// Question 3 Filter Patients by First Name
app.get("/patients/filter", (req, res) => {
  const firstName = req.query.first_name; // Expecting a query parameter
  const getPatientsByFirstName =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM Patients WHERE first_name = ?";

  db.query(getPatientsByFirstName, [firstName], (err, data) => {
    if (err) {
      return res.status(400).send("Failed to filter patients: " + err);
    }
    res.status(200).send(data);
  });
});
// Question 4 retrieve all providers by the specialty
app.get("/providers/specialty", (req, res) => {
  const specialty = req.query.specialty; // Expecting a query parameter
  const getProvidersBySpecialty =
    "SELECT first_name, last_name, provider_specialty FROM Providers WHERE provider_specialty = ?";

  db.query(getProvidersBySpecialty, [specialty], (err, data) => {
    if (err) {
      return res.status(400).send("Failed to filter providers: " + err);
    }
    res.status(200).send(data);
  });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
