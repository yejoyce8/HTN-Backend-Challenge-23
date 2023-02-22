-- Create the users table
CREATE TABLE people (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- Create skills table
CREATE TABLE skills (
  id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  skill TEXT NOT NULL,
  rating INTEGER NOT NULL,
  FOREIGN KEY (person_id) REFERENCES people (id)
);

-- Create skill frequences table
CREATE TABLE skill_frequencies (
  id INTEGER PRIMARY KEY,
  skill TEXT NOT NULL UNIQUE,
  frequency INTEGER NOT NULL
);