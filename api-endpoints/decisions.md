# Decisions

**GET /decisions/:decisionId**

* **Description**: serves with decision with specific Decision ID, populating the list and the options inside of the list, and also populating the group and the members inside of the group
* **Notes**: N/A
* **Queries**: None

Example Response:

```json
{
	"_id": "678940615a51bf4a2ed681c0",
	"list": {
		"_id": "6784d7a5844f23ac9810cf30",
		"title": "Weekly Standup",
		"description": "A list for organizing weekly standup meetings",
		"options": [
			{
				"_id": "6789430a373271753856a536",
				"name": "Alex option 6",
				"description": "Alex option for this list6",
				"customFields": [
					"time investment: 40 mins",
					"mood: relax"
				],
				"owner": "6784d7a5844f23ac9810cf30",
				"createdAt": "2025-01-16T17:33:57.153Z",
				"__v": 0
			},
			{
				"_id": "67894332373271753856a539",
				"name": "Alex option 6",
				"description": "Alex option for this list6",
				"customFields": [
					"time investment: 40 mins",
					"mood: relax"
				],
				"owner": "6784d7a5844f23ac9810cf30",
				"createdAt": "2025-01-16T17:33:57.153Z",
				"__v": 0
			},
			
		],
		"owner": "6784d64b844f23ac9810cf21",
		"members": [
			"6784d844844f23ac9810cf43",
			"6787cc268698a1a9960653a8"
		],
		"createdAt": "2025-01-16T10:47:47.725Z",
		"__v": 0
	},
	"group": {
		"_id": "6784d715844f23ac9810cf28",
		"name": "More Gardens",
		"description": "Even more gardens.",
		"owner": [
			"6784d64b844f23ac9810cf21"
		],
	"members": [
			{
				"_id": "6784d64b844f23ac9810cf21",
				"username": "sparkle_unicorn",
				"name": "Sparkle Unicorn",
				"email": "sparkles@testmail.com",
				"savedLists": [
					"6784d7a5844f23ac9810cf30",
					"678a443cf0aec95b86b4370b",
					"678a44a4f0aec95b86b4370d"
				]
			},
			{
				"_id": "6784d64b844f23ac9810cf22",
				"username": "pixel_penguin",
				"name": "Pixel Penguin",
				"email": "pixel@testmail.com",
				"savedLists": [],
			},
		]
	"votingStatus": "not started",
	"decisionsProcess_id": "6784d7a5844f23ac9810cf50",
	"completedAt": null,
	"outcome": null,
	"__v": 0,
	"createdAt": "2025-01-19T14:10:09.469Z",
	"updatedAt": "2025-01-19T14:10:09.469Z"
}
```

***

**POST /decisions**

* **Description**: Posts a voting process and responds with the newly posted voting process.
* **Notes**: N/A
* **Queries**: None
*   Required Fields:

    ```
    "list",
    "group",
    "user",
    "option",
    "decisionsProcess_id" 
    ```
* **Example Response**:

```json

{
        "list": "6784d7a5844f23ac9810cf33",
        "group": "6784d715844f23ac9810cf29",
        "votingStatus": "not started",
        "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
        "completedAt": null,
        "outcome": null,
        "_id": "678936353c1e50fdb8f4c0d7",
        "createdAt": "2025-01-17T09:03:23.505Z",
        "updatedAt": "2025-01-17T09:03:23.505Z",
        "__v": 0
      }
      
```

***

**PUT /decisions/decisionId**

* **Description**: Edits a decision by decisionId and responds with the updated decision
* **Queries**: None
* **Allowed Fields**:
  * `votingStatus`
  * `outcome`
  * `saveData`
* **Example Body**:

```json
{
        "list": "6784d7a5844f23ac9810cf30",
        "group": "6784d715844f23ac9810cf28",
        "votingStatus": "completed",
        "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
        "saveData": {},
        "outcome": "6784d7b5844f23ac9810cf31"
      }

```

* **Example Response**:

```json
{
        "_id": "678940615a51bf4a2ed681c0",
        "list": "6784d7a5844f23ac9810cf30",
        "group": "6784d715844f23ac9810cf28",
        "votingStatus": "completed",
        "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
        "completedAt": "2025-01-17T09:47:09.891Z",
        "outcome": "6784d7b5844f23ac9810cf31",
        "__v": 0,
        "createdAt": "2025-01-17T09:47:09.866Z",
        "updatedAt": "2025-01-17T09:47:09.992Z"
      }
```

***

#### DELETE /decisions/:decisionId

* **Description**: Deletes a decision by decision ID.

***

**GET** /groups/:groupId/decisions

* **Description**: serves every decision with this Group Id
* **Queries**: None
* **Example Body:**

```json
[
        {
          "_id": "678940615a51bf4a2ed681c0",
          "list": "6784d7a5844f23ac9810cf33",
          "group": "6784d715844f23ac9810cf29",
          "votingStatus": "not started",
          "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
          "completedAt": null,
          "outcome": null,
          "createdAt": "2025-01-17T09:03:23.505Z",
          "updatedAt": "2025-01-17T09:03:23.505Z",
          "__v": 0
        },
        {
          "_id": "678940615a51bf4a2ed681c1",
          "list": "6784d7a5844f23ac9810cf34",
          "group": "6784d715844f23ac9810cf29",
          "votingStatus": "in progress",
          "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
          "completedAt": null,
          "outcome": null,
          "createdAt": "2025-01-17T09:03:23.505Z",
          "updatedAt": "2025-01-17T09:03:23.505Z",
          "__v": 0
        }
      ]

```

***

**GET** /users/:userId/decisions

* **Description**: serves every decision with this User Id
* **Queries**: votingStatus (e.g. [http://localhost:9090/users/6784d64b844f23ac9810cf21/decisions?votingStatus=in%20progress](http://localhost:9090/users/6784d64b844f23ac9810cf21/decisions?votingStatus=in%20progress))
  * It can be "not started", "in progress" and "completed"
* **Example Body:**

```json
[
        {
          "_id": "678940615a51bf4a2ed681c0",
          "list": "6784d7a5844f23ac9810cf33",
          "group": "6784d715844f23ac9810cf29",
          "votingStatus": "not started",
          "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
          "completedAt": null,
          "outcome": null,
          "createdAt": "2025-01-17T09:03:23.505Z",
          "updatedAt": "2025-01-17T09:03:23.505Z",
          "__v": 0
        },
        {
          "_id": "678940615a51bf4a2ed681c1",
          "list": "6784d7a5844f23ac9810cf34",
          "group": "6784d715844f23ac9810cf29",
          "votingStatus": "in progress",
          "decisionsProcess_id": "6784d7a5844f23ac9810cf50",
          "completedAt": null,
          "outcome": null,
          "createdAt": "2025-01-17T09:03:23.505Z",
          "updatedAt": "2025-01-17T09:03:23.505Z",
          "__v": 0
        }
  ]
```

***
