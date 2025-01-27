# Groups



* **`name`** - group name, _required_&#x20;
* **`description`** - group description, _required_
* **`owner`** - user who created the group, references users
* **`members`** - users who have been invited to the group, references users&#x20;
* **`createdAt`** - when the group was created

```javascript
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, immutable: true, default: Date.now() },
});

module.exports = mongoose.model('Group', groupSchema);
```
