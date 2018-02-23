// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAFcqnKevpPDJMGUDCO_WIyEUUO5Bd2PA4',
    authDomain: 'trouvetontrain-sncf.firebaseapp.com',
    databaseURL: 'https://trouvetontrain-sncf.firebaseio.com',
    projectId: 'trouvetontrain-sncf',
    storageBucket: 'trouvetontrain-sncf.appspot.com',
    messagingSenderId: '727438676287'
  }
};
