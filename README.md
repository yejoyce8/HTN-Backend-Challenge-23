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

# **API Endpoints**
All of the required endpoints in the challenge have been implemented!

## Get All Users
This endpoint returns a list of all user data from the database in a JSON format.
**Endpoint URL:** `/users`
**HTTP Method:** `GET`
### Response 
```
{
    "name": <string>,
	"company": <string>,
	"email": <string>,
	"phone": <string>,
	"skills": skill: <string>, rating: <string>
}
```

## Get User
This endpoint returns the user data with specified ID.
**Endpoint URL:** `/users/:id`
**HTTP Method:** `GET`
**URL Parameters:** `id` - ID of the user to retrieve.

### Example Request
```
GET /users/6
```
### Response
```
{
	"name": "Christopher Johnson",
	"company": "Brown, Bishop and Rogers",
	"email": "whitefrederick@example.com",
	"phone": "(355)531-8987x8506",
	"skills": "Tornado:1,OCaml:4,Theano:2"
}
```

## Update User Data
This endpoint update the user data with specified ID and returns the updated data.
**Endpoint URL:** `/users/:id`
**HTTP Method:** `PUT`
**URL Parameters:** `id` - ID of the user to retrieve.
**Request Body:** The request body should be a JSON object that contains the fields to be updated. The fields can be any combination of the following:

name (string) - The name of the user.
company (string) - The user's company name.
email (string) - The user's email address.
phone (string) - The user's phone number.
skill_ (string) - The name of the skill to update, prefixed with "skill_".
### Example Request
```
PUT /users/5
```

### Example JSON 
```  
{
    "phone": "+1 (555) 123 4567"
}
```
### Example Response
```
{
	"name": "Maria Norman",
	"company": "Nguyen Inc",
	"email": "angela00@example.com",
	"phone": "+1 (555) 123 4567",
	"skills": "Ant Design:4,OCaml:3"
}
```

## Get Skill Frequency
Retrieves the frequency of a skill with specified ID.
**Endpoint URL:** `/skills/:id`
**HTTP Method:** `GET`
**URL Parameters:** `id` - ID of the user to retrieve.

### Example Request
```
GET /skills/10
```

### Example Response
```
[
	{
		"id": 10,
		"skill": "Angular",
		"frequency": 39
	}
]
```
## Get Skill Frequency Filtering
Retrieves a list of skill frequencies that fall within the specified frequency range.
**Endpoint URL:** `/skills`
**HTTP Method:** `GET`
**Query Parameters:** 
| Parameter | Type | Description |
| `min_frequency` | `integer` | (optional) Minimum frequency for a skill |
| `max_frequency` | `integer` | (optional) Maximum frequency for a skill |

### Example Request
```
GET /skills/?min_frequency=10&max_frequency=15
```

### Example Response
```
[
	{
		"id": 5,
		"skill": "Svelte",
		"frequency": 14
	},
	{
		"id": 95,
		"skill": "Ada",
		"frequency": 15
	}
]
```