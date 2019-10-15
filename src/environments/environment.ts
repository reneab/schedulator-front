// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    VERSION: require('../../package.json').version,
    calendarViewDate: new Date(),
    firebase: {
        apiKey: 'AIzaSyAX2Qgm27HmSNIbmfLyJ5ATpadX9efupiU',
        authDomain: 'schedule-master-80cba.firebaseapp.com',
        databaseURL: 'https://schedule-master-80cba.firebaseio.com',
        projectId: 'schedule-master-80cba',
        storageBucket: '',
        messagingSenderId: '745655924757',
        firestore: {
            settingsCollection: 'settings',
            settingsDocument: 'dev',
            schedulesCollection: 'schedules-test'
        }
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
