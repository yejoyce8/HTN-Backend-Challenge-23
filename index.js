import express from "express";
import sqlite3 from "sqlite3";
import fs from "fs";

const port = process.env.PORT || 3000;
const app = express();


// Open the database
const db = new sqlite3.Database('hackers.db');

// read JSON file
const jsonData = fs.readFileSync('./test.json');

// parse the JSON data into an object
let people = JSON.parse(jsonData);

// loop through the people array and insert each person, their skills, and update skill frequencies in database

people.forEach(person => {
  // insert the person
  db.run(`INSERT INTO people (name, company, email, phone) VALUES (?, ?, ?, ?)`,
  [person.name, person.company, person.email, person.phone], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    // get the ID of the last inserted person
    const personId = this.lastID;
    
    // Loop through skills array and insert each skill
    person.skills.forEach((skill) => {
      db.run(`INSERT INTO skills (person_id, skill, rating) VALUES (?, ?, ?)`,
        [personId, skill.skill, skill.rating], function(err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`A row has been inserted into skills with rowid ${this.lastID}`);
          
          // update the skill_frequencies table
          db.run(`INSERT INTO skill_frequencies (skill, frequency) VALUES (?, 1)
            ON CONFLICT (skill) DO UPDATE SET frequency = frequency + 1`,
            [skill.skill], function(err) {
              if (err) {
                return console.log(err.message + `here`);
              }
              console.log(`A row has been inserted into skill_frequencies`);
          });
      });
    });
});
})


/* db.serialize(() => {
  // Insert data from JSON file into database
  jsonData.forEach((data) => {
    // Insert the data into the people table
    db.run(`INSERT INTO people (name, company, email, phone) VALUES (?, ?, ?, ?)`, 
      [data.name, data.company, data.email, data.phone], 
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Inserted row with id ${this.lastID}`);
        }
    });
  });
}); */

db.close();

/* app.use(express.json());

app.post('/users', (req, res) => {
  const { name, email, age } = req.body;

  db.run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    [name, email, age],
    function(err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error inserting data into database');
      } else {
        res.status(201).send(`User with ID ${this.lastID} added to database`);
      }
    });
});

app.listen(port, () => {
  console.log('Server listening on port http://localhost:${port}');
});
 */

/* const port = process.env.PORT || 3000;

const app = express();

// Create a database if none exists
const database = new sqlite3.Database("hackers.db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example REST Express app listening at http://localhost:${port}`);
}); */


