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
    let imglink = document.forms["subForm"]["imglink"].value.trim();
    let loctype = document.forms["subForm"]["legalradio"].value.trim();
    let legalinfo = document.forms["subForm"]["legality"].value.trim();

    if (loctype === "Existing Graffiti") {
        legalinfo = "N/A";
    }

    if (!(name && address && loctype)) {
        let pos = "right";
        if (screen.orientation.type.includes("portrait")) {
            pos = "top right";
        }
        if (!name) {
            $(".fName").notify("Required", { position:pos, className:"error"});
        }
        if (!address) {
            $(".fAddress").notify("Required", { position:pos, className:"error"});
        }
        if (!loctype) {
            $(".fRadio").notify("Required", { position:pos, className:"error"});
        }
    } else {
        firebase.database().ref('info/').orderByChild('address').equalTo(address).once("value", function (infoSnapshot) {
            if (infoSnapshot.val()) {
                $.notify("This location is already on the map!");
                $.notify("Going to map!", "warn");
                let counter = 3;
                let i = setInterval(function () {
                    $.notify(String(counter) + "...", "warn");
                    counter--;
                    if (counter === 0) {
                        clearInterval(i);
                    }
                }, 1000);
                setInterval(function () {
                    window.location.href = "index.html";
                }, 4000);
            } else {
                firebase.database().ref('suggested/').orderByChild('address').equalTo(address).once("value", function (sugSnapshot) {
                    if (sugSnapshot.val()) {
                        $.notify("This location has already been submitted for review!");
                        document.getElementById("toClear").reset();
                        document.getElementById("legalinfo").style.display = "none";
                    } else {
                        if (name !== "testnofill") {
                            writeSuggestion(name, address, desc, imglink, loctype, legalinfo);
                        }
                        $.notify("Your submission has been submitted for review!", "success");
                        document.getElementById("toClear").reset();
                        document.getElementById("legalinfo").style.display = "none";
                    }
                });
            }
        });
    }
}


$(document).ready(function(){
    $('input[type=radio]').click(function(){
        if (this.id === "legalradio") {
            if (this.value === "Legal Location") {
                document.getElementById("legalinfo").style.display = "inherit";
            } else {
                document.getElementById("legalinfo").style.display = "none";
            }
        }
    });
});


function writeSuggestion(name, address, description, image, loctype, legalinfo) {
    firebase.database().ref('suggested/' + name).set({
        addr: address,
        description: description,
        image: image,
        loctype: loctype,
        legalinfo: legalinfo
    });
}


window.addEventListener('load', function() {
    initApp()
});


initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {})
};