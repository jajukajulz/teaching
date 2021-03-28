const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose(); // “.verbose()” method allows you to have more information in case of a problem.

// Creating the Express server
const app = express();

//Set view engine to ejs
app.set("view engine", "ejs");

//Creating the Express router
const router = express.Router();

// Configure middleware
app.use(express.static(path.join(__dirname, "public"))); //serve static files in express then e.g. this will work http://localhost:3000/images/firefox-icon.png
app.use(express.urlencoded({ extended: false })); // use the middleware “express.urlencoded()” so that request.body retrieves the posted values

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
  const sql_insert = `INSERT INTO User (Name, Surname) VALUES
  ('John', 'Doe'),
  ('Bill', 'Gates');`;
  db.run(sql_insert, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 2 users");
  });
});

// GET /
router.get("/", function (req, res) {
  res.render(__dirname + "/views/index.ejs", { status: "No status" }); //__dirname resolves to your project folder.

  //The sendfile method, on the other hand, simply sends a given file to the client, regardless of the type and contents of the file.
  //render allows processing of variables but requires use of a templating engine e.g. name
  //  res.sendFile(
  //    path.join(__dirname + "/views/index.html")
  //  );
});

// GET /about
router.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

// POST /
router.post("/", function (req, res) {
  const user = [req.body.fname, req.body.lname];
  console.log("Submitted name: " + req.body.fname);
  console.log("Submitted surname: " + req.body.lname);
  const sql = "INSERT INTO User (Name, Surname) VALUES (?,?)";
  db.run(sql, user, (err) => {
    // if (err) ...
    res.render(__dirname + "/views/index.ejs", { status: "Saved to DB" });
    //res.redirect("/");
  });
});

//add the router
app.use("/", router);

// Starting the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});
