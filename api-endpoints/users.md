# Users

#### GET /users

* **Description**: Serves all users
* **Queries**: username (returns as a singular object)
* **Example Response**:

```json
[
        {
          "_id": "6784d64b844f23ac9810cf21",
          "username": "sparkle_unicorn",
          "name": "Sparkle Unicorn",
          "email": "sparkle@testmail.com",
          "savedLists": ["6784d7a5844f23ac9810cf30"],
          "createdAt": "2025-01-16T12:41:54.179Z",
          "__v": 0
        },
        {
          "_id": "6784d64b844f23ac9810cf22",
          "username": "pixel_penguin",
          "name": "Pixel Penguin",
          "email": "pixel@testmail.com",
          "savedLists": ["6784d7a5844f23ac9810cf30"],
          "createdAt": "2025-01-16T12:41:54.181Z",
          "__v": 0
        }
      ]
```

#### GET /users/:userId

* **Description**: Serves a user object containing user information.
* **Queries**: None
* **Example Response**:

```json
{
  "_id": "6784d64b844f23ac9810cf21",
  "username": "sparkle_unicorn",
  "name": "Sparkle Unicorn",
  "email": "sparkle@testmail.com",
  "createdAt": "2025-01-01",
  "__v": "0"
}
```

***

#### POST /users

* **Description**: Posts a new user and returns that new user.
* **Queries**: None
* **Required Fields**:
  * `username`
  * `name`
  * `email`
* **Defaulted Fields**:
  * `_id`
  * `__v`
  * `createdAt`
* **Example Response**:

```json
{
  "username": "huge_hippo",
  "name": "Hugo Hippo",
  "email": "hugohipster@testmail.com",
  "savedLists": [],
  "_id": "6784d64b844f23ac9810cf27",
  "createdAt": "2025-01-15T16:29:55.536Z",
  "__v": 0
}
```

***

#### PUT /users/:user\_id

* **Description**: Edits a user by ID and responds with the updated user.
* **Queries**: None
* **Allowed Fields**:
  * `username`
  * `name`
  * `email`
  * `bio`
* **Example Body**:

```json
{
  "username": "sparkle_unicorn 10",
  "name": "No more unicorns",
  "email": "sparkles@testmail.com"
}
```

* **Example Response**:

```json
{
  "_id": "6784d64b844f23ac9810cf21",
  "username": "sparkle_unicorn 10",
  "name": "No more unicorns",
  "email": "sparkles@testmail.com",
  "savedLists": ["6784d7a5844f23ac9810cf30"],
  "createdAt": "2025-01-15T14:31:18.210Z",
  "__v": 0
}
```

#### DELETE /users/:user\_id

* **Description**: Deletes a user by user ID.



\
