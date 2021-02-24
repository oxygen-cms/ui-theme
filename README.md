# Oxygen - UI Theme

This repository contains the legacy front-end of Oxygen.

For more information visit the [Core](https://github.com/oxygen-cms/core) repository.

## Migration to Vue.js

The Vue.js migration is not happening inside this repository.
Instead, most of the excitement is in the [@oxygen-cms/ui](https://github.com/oxygen-cms/core)
npm package.

This UI is being gradually gutted as components are replaced with the Vue.js versions.
The first component to go was the Main Navigation bar at the top fo the screen.

The integration between the two UI frameworks is done through the use of an `<iframe>`.
When a legacy page is requested, the Vue.js UI will load the legacy page inside an iframe, and set up a number of global hooks
to allow the legacy page inside the iframe to communicate with the parent page. These hooks include:

- `window.Oxygen.onNavigationBegin` - called when a new page is loaded internally using SmoothState.js
- `window.Oxygen.onNavigationEnd` - called when navigation is finished and e.g.: the parent title should be updated
- `window.Oxygen.notify` - called to show a notification in the parent page. 
- `window.Oxygen.openAlertDialog` - shows an alert
- `window.Oxygen.openConfirmDialog` - shows a confirmation dialog
- `window.Oxygen.popState` - navigate one entry backwards in the history

## Development

    yarn install
    npx webpack
