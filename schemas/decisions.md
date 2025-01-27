# Decisions



* **`list`** - reference to the list used in the decision journey, required
* **`group`** - reference to the group invited to make the decision, required
* **`votes`**&#x20;
  * **`user`** - reference to which user voted
  * **`option`** - reference to what that user voted for&#x20;
  * **`timestamps`** - a timestamp for each individual vote interaction
* **`votingStatus`** - 3 permitted states for a decision making journey:
  * `not started` - _\*this is the default state\*_
  * `in progress`
  * `completed`
* **`decisionsProcess_id`** - reference to DecisionsProcess, which process was used in a decision journey&#x20;
* **`saveData`** - flexible field for capturing data needed for processes, default empty object
* **`completedAt`** - date that the vote was closed / the winner was decided / end of decision making journey
* **`outcome`** - the winner of the vote (winning option), references options
* **`timestamps`**&#x20;
  * `createdAt` - time the decision making journey start
  * `updatedAt` - whenever a change is made&#x20;

```javascript
const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema(
  {
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true }, // reference to list used in decision
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    }, // reference to group invited to decision
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        }, // which user voted
        option: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Option',
          required: true,
        },
      }, // what that user voted for
      { timestamps: true }, // timestamps for vote interactions
    ],
    votingStatus: {
      type: String,
      enum: ['not started', 'in progress', 'completed'],
      default: 'not started',
    }, // 3 permitted states for a decision
    decisionsProcess_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DecisionsProcess',
      required: true,
    }, // reference to which process was used in a decision
    saveData: { type: Object, default: {} }, // flexible field for capturing data needed for processes
    completedAt: { type: Date }, // date the vote was closed / winner was decided
    outcome: { type: mongoose.Schema.Types.ObjectId, ref: Options }, // the winner of the vote
  },
  { timestamps: true } // timestamps for decision
);

module.exports = mongoose.model('Decision', decisionSchema);

```
