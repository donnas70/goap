// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginurl: 'http://localhost:4200/login',
  firebase: {
    apiKey: "AIzaSyA2vJDZw7FApKMT8lKMsqev1VvbIEJiEB4",
    authDomain: "goap-8f902.firebaseapp.com",
    databaseURL: "https://goap-8f902.firebaseio.com",
    projectId: "goap-8f902",
    storageBucket: "goap-8f902.appspot.com",
    messagingSenderId: "356079649890",
    appId: "1:356079649890:web:d55823e97f1286d27e7d3b"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
