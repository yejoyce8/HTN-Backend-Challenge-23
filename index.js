import express from "express";
import sqlite3 from "sqlite3";
import fs from "fs";

const port = process.env.PORT || 3000;
const app = express();


// Open the database
const db = new sqlite3.Database('hackers.db');

// read JSON file
const jsonData = fs.readFileSync('./data.json');

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
    //console.log(`A row has been inserted with rowid ${this.lastID}`);
    // get the ID of the last inserted person
    const personId = this.lastID;
    
    // Loop through skills array and insert each skill
    person.skills.forEach((skill) => {
      db.run(`INSERT INTO skills (person_id, skill, rating) VALUES (?, ?, ?)`,
        [personId, skill.skill, skill.rating], function(err) {
          if (err) {
            return console.log(err.message);
          }
          //console.log(`A row has been inserted into skills with rowid ${this.lastID}`);
          
          // update the skill_frequencies table
          db.run(`INSERT INTO skill_frequencies (skill, frequency) VALUES (?, 1)
            ON CONFLICT (skill) DO UPDATE SET frequency = frequency + 1`,
            [skill.skill], function(err) {
              if (err) {
                return console.log(err.message);
              }
              //console.log(`A row has been inserted into skill_frequencies`);
          });
      });
    });
});
})

app.use(express.json());

// Get All Users endpoint
app.get('/users', (req, res) => {
  db.all(`SELECT p.name, p.company, p.email, p.phone, GROUP_CONCAT(s.skill || ':' || s.rating, ',') AS skills FROM people p LEFT JOIN skills s ON p.id = s.person_id GROUP BY p.id`, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});


// Get User endpoint 
// Retrieves data of one user given its id
app.get('/users/:id', (req, res) => {
  const personId = req.params.id;
  // query database for the specific ID
  db.get(`SELECT p.name, p.company, p.email, p.phone, GROUP_CONCAT(s.skill || ':' || s.rating, ',') AS skills FROM people p LEFT JOIN skills s ON p.id = s.person_id WHERE p.id = ?`, [personId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(row);
    } 
  });
});

app.put('/users/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const requestData = req.body;
    
    // use Object.keys() to loop through the data to later generate SQL query dynamically
    const keys = Object.keys(requestData);
    // checks the keys in the request body to determine whether to update the people or skills table
    const skillKeys = keys.filter(key => key.includes('skill_'));
    const peopleKeys = keys.filter(key => !key.includes('skill_'));

    if (peopleKeys.length) {
      const peopleSetStatement = peopleKeys.map(key => `${key} = ?`).join(', ');
      const peopleValues = peopleKeys.map(key => requestData[key]);
      peopleValues.push(personId);

      db.run(`UPDATE people SET ${peopleSetStatement} WHERE id = ?`, peopleValues);
    }

    if (skillKeys.length) {
      const skillValues = skillKeys.map(key => requestData[key]);
      skillValues.push(personId);

      // promise used to ensure everything is updated in database before retrieval
       const promises = skillKeys.map((key, index) => {
        const skill = key.replace('skill_', '');
        const rating = skillValues[index];

        return db.run(`
          INSERT INTO skills (person_id, skill, rating)
          VALUES (?, ?, ?)
          ON CONFLICT(person_id, skill) DO UPDATE SET rating = excluded.rating
          INSERT INTO skill_frequencies (skill, frequency) VALUES (?, 1)
          ON CONFLICT (skill) DO UPDATE SET frequency = frequency + 1 
        `, [personId, skill, rating]);
      });

      await Promise.all(promises); 
    }

    db.get(`SELECT p.name, p.company, p.email, p.phone, GROUP_CONCAT(s.skill || ':' || s.rating, ',') AS skills FROM people p LEFT JOIN skills s ON p.id = s.person_id WHERE p.id = ?`, [personId], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(row);
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Skills endpoint for min/max frequency query filtering
app.get('/skills', (req, res) => {
  const minFrequency = req.query.min_frequency || 0;
  const maxFrequency = req.query.max_frequency || Number.MAX_SAFE_INTEGER;
  db.all(`SELECT * FROM skill_frequencies WHERE frequency >= ? AND frequency <= ?`, [minFrequency, maxFrequency], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});

// Skills endpoint for retrieving the number of users with each skill
app.get('/skills/:id', (req, res) => {
  const skillId = req.params.id;
  db.all(`SELECT * FROM skill_frequencies WHERE id = ?`, [skillId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log('Server listening on port http://localhost:3000');
});

 


