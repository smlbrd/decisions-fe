---
description: A page on the (tabs) stack
---

# Groups

* **Create new group button:** Comes up with an overlay with a form allowing a user to create a new group
  * A text box to enter group name (shows relevant error message if empty when posting)
  * A text box to enter group description (shows relevant error message if empty when posting)
  * A display for all the members in the group, with a remove button next to everyone who isn't the creater/owner of the group
  * A search bar that filters through a display of users with add buttons - can search by username or name
  * Create new group button which loads and then displays a success message
  * The group then optimistically renders on the screen behind the overlay
* **My Groups:** A scrollable section with collapsible components for each group. Each member is displayed with the UserCard component. (To add: an option at the bottom of each collapsible to add a new member to the group or manage the group)

