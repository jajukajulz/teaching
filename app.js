const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose(); // “.verbose()” method allows you to have more information in case of a problem.

// Creating the Express server
const app = express();

//Creating the Express router
const router = express.Router();

//serve static files in express
app.use(express.static(path.join(__dirname, "public"))); //then e.g. this will work http://localhost:3000/images/firefox-icon.png

// Connection to the SQlite database
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});

// Creating user table (userID, Name, Surname)
const sql_create = `CREATE TABLE IF NOT EXISTS User (
  User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name VARCHAR(100) NOT NULL,
  Surname VARCHAR(100) NOT NULL
);`;
db.run(sql_create, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'User' table");

  // Database seeding
  const sql_insert = `INSERT INTO User (User_ID, Name, Surname) VALUES
  (1, 'John', 'Doe'),
  (2, 'Bill', 'Gates');`;
  db.run(sql_insert, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 2 users");
  });
});

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/index.html"));
  //__dirname : It will resolve to your project folder.
});

router.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
