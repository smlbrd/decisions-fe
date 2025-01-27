# Users



* **`username`** - must be unique, _required_
* **`name`** - _required_
* **`email`** - must be unique, _required_
* **`bio`** - _optional_
* **`avatarImg`** - _optional_
* **`savedLists`** - any lists the user has saved, references lists
* **`createdAt`** - when a user joined&#x20;

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  avatarImg: { type: String },
  savedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
});

module.exports = mongoose.model('User', userSchema);
```
