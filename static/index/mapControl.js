let config = {
    apiKey: "AIzaSyAKxSuzmMXrvCxFIY8OCs17VM3R27qTtc0",
    authDomain: "graffitimap-21060.firebaseapp.com",
    databaseURL: "https://graffitimap-21060.firebaseio.com",
    projectId: "graffitimap-21060",
    storageBucket: "graffitimap-21060.appspot.com",
    messagingSenderId: "992076324644"
};
firebase.initializeApp(config);


function initMap() {
    let Atlanta = {lat: 33.7490, lng: -84.3880};

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: Atlanta
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            let marker = new google.maps.Marker({
                position: Atlanta,
                map: map,
                title: "Your Location"
            });

            map.setCenter(pos);
            map.setZoom(11);
        });
    } else {
        map.setCenter(Atlanta);
        map.setZoom(11);
    }

    let locationsRef = firebase.database().ref('locations/');
    locationsRef.on('value', function(locSnapshot) {
        locSnapshot.forEach(function (snapshot) {
            placeMarker(map, snapshot.key, snapshot.val());
        });
    });
}


function placeMarker(map, name, loc) {
    let lat = loc.lat;
    let lng = loc.lng;

    let marker = new google.maps.Marker({
        map: map,
        title: name,
        position: {lat: lat, lng: lng}
    });

    google.maps.event.addListener(marker, 'click', function () {
        firebase.database().ref('info/' + this.getTitle()).on('value', function (snapshot) {
            let text = "<div class='centerIW'><div class='iw-title'>" + name + "</div><h5>" + snapshot.val().address + "</h5><p>" + snapshot.val().desc + "</p><img class='mapImg' src='" + snapshot.val().images + "'></div>";
            let infowindow = new google.maps.InfoWindow();
            infowindow.setContent(text);
            infowindow.open(map, marker);
        });
    });
}