# Lists

**GET /users/:userId/saved\_lists**

* **Description**: Serves all populated lists that a specific user has saved.
* **Queries**: None
* **Example Response**:

```json
[
  {
    "_id": "6784d7a5844f23ac9810cf30",
    "title": "Weekly Standup",
    "description": "A list for organizing weekly standup meetings",
    "options": ["6784d7b5844f23ac9810cf31", "6784d7b5844f23ac9810cf32"],
    "owner": "6784d64b844f23ac9810cf21",
    "createdAt": "2025-01-15T13:49:26.127Z",
    "__v": 0
  }
]
```

***

**POST /lists**

* **Description**: Allows posting of a new list and returns it.
* **Queries**: None
* **Required Fields**:
  * `title`
  * `description`
  * `options`
  * `owner`
* **Example Body**:

```json
{
  "title": "Gardening",
  "description": "A list of the best new gardening tools",
  "options": ["6784d7b5844f23ac9810cf34"],
  "owner": "6784d64b844f23ac9810cf24"
}
```

* **Example Response**:

```json
{
  "title": "Gardening",
  "description": "A list of the best new gardening tools",
  "options": ["6784d7b5844f23ac9810cf34"],
  "owner": "6784d64b844f23ac9810cf24",
  "createdAt": "2025-01-15T14:23:44.461Z",
  "_id": "6784d7a5844f23ac9810ca45",
  "__v": 0
}
```

***

**PUT /lists/:listId**

* **Description**: Edits a list by ID and responds with the updated list.
* **Queries**: None
* **Allowed Fields**:
  * `title`
  * `description`
  * `options`
  * `owner`
* **Example Body**:

```json
{
  "title": "Weekly Standup Test",
  "description": "A test list update",
  "options": ["6784d7b5844f23ac9810cf31"],
  "owner": "6784d64b844f23ac9810cf21"
}
```

* **Example Response**:

```json
{
  "_id": "6784d7a5844f23ac9810cf30",
  "title": "Weekly Standup Test",
  "description": "A test list update",
  "options": ["6784d7b5844f23ac9810cf31"],
  "owner": "6784d64b844f23ac9810cf21",
  "createdAt": "2025-01-15T17:44:57.763Z",
  "__v": 0
}
```

***

**DELETE /lists/:listId**

* **Description**: Deletes a list given a list ID.

***

#### PUT /lists/:listId/options/:optionId

* **Description:** Edits an option by ID, given the list ID and option ID, and returns the updated option.
* **Queries:** None
* **Allowed Fields**
  * `name`: The name of the option.
  * `description`: A brief description of the option.
  * `customFields`: Custom fields related to the option (can be a list of key-value pairs).
* **Example Body:**

```json
{
  "name": "Daily Updates Now With Even More Updates",
  "description": "Brief updates with a side of extra updates from each team member",
  "customFields": ["time investment: 15 mins", "mood: positive"],
  "owner": "6784d7a5844f23ac9810cf30"
}
```

* **Example Response:**

```json
  {"name": "Daily Updates Now With Even More Updates",
  "description": "Brief updates with a side of extra updates from each team member",
  "customFields": ["time investment: 15 mins", "mood: positive"],
  "owner": "6784d7a5844f23ac9810cf30",
  "__v": 0
}
```

***
