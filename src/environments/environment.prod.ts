export const environment = {
    production: true,
    VERSION: require('../../package.json').version,
    calendarViewDate: new Date(2019, 8, 2),
    firebase: {
        apiKey: 'AIzaSyAX2Qgm27HmSNIbmfLyJ5ATpadX9efupiU',
        authDomain: 'schedule-master-80cba.firebaseapp.com',
        databaseURL: 'https://schedule-master-80cba.firebaseio.com',
        projectId: 'schedule-master-80cba',
        storageBucket: '',
        messagingSenderId: '745655924757',
        firestore: {
            settingsCollection: 'settings',
            settingsDocument: 'main',
            schedulesCollection: 'schedules'
        }
    }
};
