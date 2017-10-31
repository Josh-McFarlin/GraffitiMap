let config = {
    apiKey: "AIzaSyAKxSuzmMXrvCxFIY8OCs17VM3R27qTtc0",
    authDomain: "graffitimap-21060.firebaseapp.com",
    databaseURL: "https://graffitimap-21060.firebaseio.com",
    projectId: "graffitimap-21060",
    storageBucket: "graffitimap-21060.appspot.com",
    messagingSenderId: "992076324644"
};
firebase.initializeApp(config);


function validateForm() {
    let name = document.forms["subForm"]["name"].value.trim();
    let address = document.forms["subForm"]["address"].value.replace(/(?<=[a-zA-z  ])\d{5}(?:-\d{4})?/g, "").trim();
    let desc = document.forms["subForm"]["desc"].value.trim();
    let legality = document.forms["subForm"]["legality"].value.trim();
    let imglink = document.forms["subForm"]["imglink"].value.trim();
    firebase.database().ref('info/').orderByChild('address').equalTo(address).once("value", function(infoSnapshot) {
        if (infoSnapshot.val()) {
            $.notify("This location is already on the map!");
            $.notify("Going to map!", "warn");
            let counter = 3;
            let i = setInterval(function(){
                $.notify(String(counter) + "...", "warn");
                counter--;
                if (counter === 0) {
                    clearInterval(i);
                }
            }, 1000);
            setInterval(function(){
                window.location.href = "index.html";
            }, 4000);
        } else {
            firebase.database().ref('suggested/').orderByChild('address').equalTo(address).once("value", function(sugSnapshot) {
                if (sugSnapshot.val()) {
                    $.notify("This location has already been submitted for review!");
                    document.getElementById("toClear").reset();
                } else {
                    writeSuggestion(name, address, desc, legality, imglink);
                    $.notify("Your submission has been submitted for review!", "success");
                    document.getElementById("toClear").reset();
                }
            });
        }
    });
}


function writeSuggestion(name, address, description, legality, image) {
    firebase.database().ref('suggested/' + name).set({
        address: address,
        desc: description,
        legality: legality,
        images: image
    });
}