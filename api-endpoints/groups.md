# Groups

**GET /groups/:groupId**

* **Note**: Not currently of use.

***

**GET /groups/:groupId/members**

* **Description**: Serves all populated members of a group by group ID.
* **Queries**: None
* **Example Response**:

```json
[
  {
    "_id": "6784d64b844f23ac9810cf21",
    "username": "sparkle_unicorn",
    "name": "Sparkle Unicorn",
    "email": "sparkle@testmail.com",
    "savedLists": ["6784d7a5844f23ac9810cf30"],
    "createdAt": "2025-01-15T14:01:54.251Z",
    "__v": 0
  },
  {
    "_id": "6784d64b844f23ac9810cf22",
    "username": "pixel_penguin",
    "name": "Pixel Penguin",
    "email": "pixel@testmail.com",
    "savedLists": ["6784d7a5844f23ac9810cf30"],
    "createdAt": "2025-01-15T14:01:54.251Z",
    "__v": 0
  }
]
```

***

**POST /groups**

* **Description**: Allows posting of a new group and returns it.
* **Queries**: None
* **Required Fields**:
  * `name`&#x20;
  * `description`
  * `members`
  * `owner` (an array)
* **Defaulted Fields**:
  * `_id`
  * `__v`
  * `createdAt`
* **Example Body**:

```json
{
  "name": "good_gardeners",
  "description": "A group for good gardening",
  "members": [
    { "_id": "6784d64b844f23ac9810cf24" },
    { "_id": "6784d64b844f23ac9810cf25" }
  ],
  "owner": [
    { "_id": "6784d64b844f23ac9810cf24" },
  ],
}
```

* **Example Response**:

```json
{
  "name": "good_gardeners",
  "description": "A group for good gardening",
  "members": ["6784d64b844f23ac9810cf24", "6784d64b844f23ac9810cf25"],
    "owner": ["6784d64b844f23ac9810cf24"],
  "createdAt": "2025-01-15T14:04:51.092Z",
  "_id": "6784d715844f23ac90876222",
  "__v": 0
}
```

***

**PUT /groups/:group\_id**

* **Description**: Edits a group by ID and responds with the updated group.
* **Queries**: None
* **Allowed Fields**:
  * `name`
  * `description`
  * `members`
* **Example Body**:

```json
{
  "name": "Gardens",
  "description": "A club for anyone who gardens in their garden.",
  "members": [
    { "_id": "6784d64b844f23ac9810cf21" },
    { "_id": "6784d64b844f23ac9810cf22" }
  ]
}
```

* **Example Response**:

```json
{
  "_id": "6784d715844f23ac9810cf28",
  "name": "Gardens",
  "description": "A club for anyone who gardens in their garden.",
  "members": ["6784d64b844f23ac9810cf21", "6784d64b844f23ac9810cf22"],
  "createdAt": "2025-01-15T14:27:13.741Z",
  "__v": 0
}
```

***

**DELETE /groups/:group\_id**

* **Description**: Deletes a group by ID.

***

**GET /groups/users/:user\_id/groups**

* **Description**: Deletes a user by userId from a group specified by groupId

***

**GET /users/:user\_id/groups**

* **Description**: Serves all groups with a specified user by id, and populates the members
* **Queries**: None
* **Example Response**:

```json
 [
        {
          "_id": "6784d715844f23ac9810cf28",
          "name": "test_group",
          "description": "A group for all things testing",
          "owner": ["6784d64b844f23ac9810cf21"],
          "members": [
            {
              "_id": "6784d64b844f23ac9810cf21",
              "username": "sparkle_unicorn",
              "name": "Sparkle Unicorn",
              "email": "sparkle@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf30"],
              "createdAt": "2025-01-16T10:25:18.721Z",
              "__v": 0
            },
            {
              "_id": "6784d64b844f23ac9810cf22",
              "username": "pixel_penguin",
              "name": "Pixel Penguin",
              "email": "pixel@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf30"],
              "createdAt": "2025-01-16T10:25:18.721Z",
              "__v": 0
            },
            {
              "_id": "6784d64b844f23ac9810cf23",
              "username": "cosmic_koala",
              "name": "Cosmic Koala",
              "email": "cosmic@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf30"],
              "createdAt": "2025-01-16T10:25:18.721Z",
              "__v": 0
            }
          ],
          "createdAt": "2025-01-16T10:25:15.771Z",
          "__v": 0
        },
        {
          "_id": "6784d715844f23ac9810cf29",
          "name": "coding_club",
          "description": "A group for coding enthusiasts",
          "owner": ["6784d64b844f23ac9810cf24"],
          "members": [
            {
              "_id": "6784d64b844f23ac9810cf24",
              "username": "robo_raptor",
              "name": "Robo Raptor",
              "email": "robo@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf33"],
              "createdAt": "2025-01-16T10:25:18.722Z",
              "__v": 0
            },
            {
              "_id": "6784d64b844f23ac9810cf25",
              "username": "ninja_narwhal",
              "name": "Ninja Narwhal",
              "email": "ninja@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf33"],
              "createdAt": "2025-01-16T10:25:18.722Z",
              "__v": 0
            },
            {
              "_id": "6784d64b844f23ac9810cf26",
              "username": "galaxy_giraffe",
              "name": "Galaxy Giraffe",
              "email": "galaxy@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf33"],
              "createdAt": "2025-01-16T10:25:18.722Z",
              "__v": 0
            },
            {
              "_id": "6784d64b844f23ac9810cf21",
              "username": "sparkle_unicorn",
              "name": "Sparkle Unicorn",
              "email": "sparkle@testmail.com",
              "savedLists": ["6784d7a5844f23ac9810cf30"],
              "createdAt": "2025-01-16T10:25:18.721Z",
              "__v": 0
            }
          ],
          "createdAt": "2025-01-16T10:25:15.771Z",
          "__v": 0
        }
      ]
```

