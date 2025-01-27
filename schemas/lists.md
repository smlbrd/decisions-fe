# Lists



* **`title`** - list title, _required_
* **`description`** - list description, _optional_&#x20;
* **`options`** - individual list items, references options
* **`owner`** - user who created the list, references users
* **`members`** - users&#x20;
* **`createdAt`** - when a list was created

```javascript
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, immutable: true, default: Date.now() },
});

module.exports = mongoose.model('List', listSchema);
```
