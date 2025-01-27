# Options



* **`name`** - option name, _required_&#x20;
* **`description`** - option description, _optional_&#x20;
* **`image_url`** - _optional_
* **`customFields`** - _optional_&#x20;
* **`owner`** - user who created the option, references lists
* **`createdAt`** - when an option was created&#x20;

```javascript
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image_url: { type: String },
  customFields: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  createdAt: { type: Date, immutable: true, default: Date.now() },
});

module.exports = mongoose.model('Option', optionSchema);
```
