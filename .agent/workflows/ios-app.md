# /ios-app
Wrap the site with Capacitor.
1. `npm i @capacitor/core @capacitor/cli @capacitor/ios` then `npx cap init Jinn app.lakshya.jinn --web-dir=.`
2. In `src/app.js` make the API base URL absolute (`https://jinn.lakshya.uk/api/jinn`) when `window.Capacitor` exists.
3. `npx cap add ios && npx cap open ios`; add safe-area padding checks and an app icon.
