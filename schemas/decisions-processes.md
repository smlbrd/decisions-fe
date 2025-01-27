# Decisions Processes



### Restrictions Schema - _nested in Decisions Process Schema_

* **`minGroupSize`** - minimum number of participants, _required_
* **`maxGroupSize`** - maximum number of participants, _optional_
* **`_id: false`** - nested restrictions will not need/have a unique id&#x20;

### Decisions Process Schema&#x20;

* **`name`** - e.g. "this or that", "single elimination", _required_
* **`description`** - explaining the process, e.g. "choose between two options, winner stays on!", _required_
* **`restrictions`** - referencing the restrictionsSchema
* **`timestamps`** - automatically manages createdAt and updatedAt

```javascript
const mongoose = require('mongoose');

const restrictionsSchema = new mongoose.Schema(
  {
    minGroupSize: { type: Number, required: true }, // minimum number of participants
    maxGroupSize: { type: Number }, // optional maximum
  },
  { _id: false } // nested restrictions won't need/have a unique id
);

const decisionsProcessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "this or that", "single elimination"
    description: { type: String, required: true }, // e.g. "choose between two options, winner stays on!"
    restrictions: { type: restrictionsSchema },
  },
  { timestamps: true } // automatically manage createdAt and updatedAt
);

module.exports = mongoose.model('DecisionsProcess', decisionsProcessSchema);
```



