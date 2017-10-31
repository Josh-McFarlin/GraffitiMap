let config = {
    apiKey: "AIzaSyAKxSuzmMXrvCxFIY8OCs17VM3R27qTtc0",
    authDomain: "graffitimap-21060.firebaseapp.com",
    databaseURL: "https://graffitimap-21060.firebaseio.com",
    projectId: "graffitimap-21060",
    storageBucket: "graffitimap-21060.appspot.com",
    messagingSenderId: "992076324644"
};
firebase.initializeApp(config);

let uiConfig = {
    signInSuccessUrl: 'admin.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: 'tos.html'
};

let ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);