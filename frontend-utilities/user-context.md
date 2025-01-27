---
description: >-
  The user context file sets up the user in async memory and contains different
  functions for handling the user information
---

# User Context

* Exported component `userProvider` is wrapped around the whole app to give the user context
* Exported function `useUser` is an object which contains four keys:&#x20;
  * `user` is a state available throughout app giving the user information on an object
  * `saveUser` is a function that takes the user data object, with type declaration for the whole userData object, and sets the user state to the user data and stores the user information in async storage (async storage is persisted until app is uninstalled)
  * `loadUser` is a function that gets the user from the async storage. If there is a user in the storage then it is loaded into the user context, and if there isn't, it sets the user context object keys to null
  * `removeUser` is a function that sets the user context object keys to null, and then also sets the async storage to null

