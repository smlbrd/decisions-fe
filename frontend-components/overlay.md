# Overlay

<figure><img src="../.gitbook/assets/Screenshot 2025-01-16 at 13.28.17.png" alt="" width="188"><figcaption></figcaption></figure>

* **Description:** The overlay component brings up a scrollable content box over the top of the page. On iOS and Android it blurs the background, and on the web it covers the background with a transparent grey box. It is used by putting it in the return statement of your page and defining states for when it should be visible, and a function for what should happen when it is closed. The content box is aligned and justified in the center of the page
* **Attributes**
  * `isVisible` boolean
  * `onClose` function to execute when the overlay is closed (which happens either by pressing outisde of content box, or by pressing the back button on android)
  * &#x20;`isKeyboardAvoiding` default set to false - avoids the keyboard on mobile when set to true
  * &#x20;`scrollable` default set to false - allows the whole overlay box to be scrollable
  * `children` react components to place inside the content box
