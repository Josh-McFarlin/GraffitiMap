let config = {
    apiKey: "AIzaSyAKxSuzmMXrvCxFIY8OCs17VM3R27qTtc0",
    authDomain: "graffitimap-21060.firebaseapp.com",
    databaseURL: "https://graffitimap-21060.firebaseio.com",
    projectId: "graffitimap-21060",
    storageBucket: "graffitimap-21060.appspot.com",
    messagingSenderId: "992076324644"
};
firebase.initializeApp(config);

let geocoder;

firebase.database().ref('suggested/').on('value', function (snapshot) {
    if (snapshot.exists()) {
        let content = '';
        let count = 0;

        let names = [];
        $("table.table-fill tr").each(function() {
            let row = [];
            let tableInfo = $(this).find('td');
            if (tableInfo.length > 0) {
                tableInfo.each(function() {
                    row.push($(this).text());
                });
                names.push(row[0]);
            }
        });

        snapshot.forEach(function(data) {
            if (!names.includes(Object.keys(snapshot.val())[count])) {
                let val = data.val();
                content += '<tr>';
                content += '<td class="text-left">' + Object.keys(snapshot.val())[count] +'</td>';
                content += '<td class="text-left">' + val.address + '</td>';
                content += '<td class="text-left">' + val.desc + '</td>';
                content += '<td class="text-left"><img src="' + val.images + '"></td>';
                content += '<td class="text-left"><button type="button" onclick="approveSuggestion(' + "'" + Object.keys(snapshot.val())[count] + "'" + ')">Approve</button></td>';
                content += '<td class="text-left"><button type="button" onclick="deleteSuggestion(' + "'" + Object.keys(snapshot.val())[count] + "'" + ')">Delete</button></td>';
                content += '</tr>';
            }
            count++;
        });
        $('#ex-table').append(content);
    }
});


function deleteSuggestion(tag) {
    firebase.database().ref('suggested/' + tag + '/').on('value', function (snapshot) {
        snapshot.ref.remove();
        location.reload(true);
    });
}


function approveSuggestion(tag) {
    firebase.database().ref('suggested/' + tag + '/').on('value', function (snapshot) {
        let info = snapshot.val();
        let name = tag;
        let address = info.address;
        let description = info.desc;
        let images = info.images;
        writeLocation(name, address, description, images);
        snapshot.ref.remove();
        location.reload(true);
    });
}


function writeLocation(name, address, description, images) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            let pos = results[0].geometry.location;
            firebase.database().ref('locations/' + name).set({
                lat: Number(pos.lat()),
                lng: Number(pos.lng())
            });

            firebase.database().ref('info/' + name).set({
                address: address,
                desc: description,
                images: images
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


window.addEventListener('load', function() {
    initApp()
});


initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
    })
};
