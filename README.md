# Hack the North 2021 Backend Challenge Solution

These are the SQLite database tables that have been created in hackers.db:
| Table Name  | Column Name | Data Type |
|-------|-----|--------|
| People | id  | INTEGER |
|        | name|  TEXT   |
|        | company|  TEXT   |
|        | email|  TEXT   |
|        | phone|  TEXT   |
| Skills   | id  | INTEGER   |
|        | person_id|  INTEGER   |
|        | skill|  TEXT   |
|        | rating|  INTEGER   |
| Skill_Frequencies | id  | INTEGER |
|        | skill|  TEXT   |
|        | frequency|  INTEGER   |

**API Endpoints**
All of the required endpoints in the challenge have been implemented!
