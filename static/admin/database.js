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
                let info = data.val();
                content += '<tr onclick="expand(this)">';
                content += '<td class="text-left crop">' + Object.keys(snapshot.val())[count] +'</td>';
                content += '<td class="text-left crop" data-text="'+ info.addr +'" data-full="no">' + info.addr + '</td>';
                content += '<td class="text-left crop" data-text="'+ info.description +'">' + info.description + '</td>';
                content += '<td class="text-left crop" data-text="'+ info.loctype +'">' + info.loctype + '</td>';
                content += '<td class="text-left crop" data-text="'+ info.legalinfo +'">' + info.legalinfo + '</td>';
                content += '<td class="text-left"><img src="' + info.image + '"></td>';
                content += '<td class="text-left"><button type="button" onclick="approveSuggestion(' + "'" + Object.keys(snapshot.val())[count] + "'" + ')">Approve</button></td>';
                content += '<td class="text-left"><button type="button" onclick="deleteSuggestion(' + "'" + Object.keys(snapshot.val())[count] + "'" + ')">Delete</button></td>';
                content += '</tr>';
            }
            count++;
        });
        $('#ex-table').append(content);

        var croppable = document.getElementsByClassName("crop");
        for (let index = 0; index < croppable.length; index++) {
            if (croppable[index].innerHTML.length > 50) {
                croppable[index].setAttribute("title", "Click To Expand");
                croppable[index].innerHTML = croppable[index].innerHTML.substring(0, 50) + "...";
            }
        }
    }
});


function expand(tr) {
    let chld = tr.children;
    if (chld.length > 0) {
        let full = chld[1].getAttribute("data-full");
        if (full === "no") {
            chld[1].setAttribute("data-full", "yes");
            for (let index = 0; index < chld.length; index++) {
                if (chld[index].hasAttribute("data-text")) {
                    let text = chld[index].getAttribute("data-text");
                    chld[index].innerHTML = text;
                }
            }
        } else {
            chld[1].setAttribute("data-full", "no");
            for (let index = 0; index < chld.length; index++) {
                if (chld[index].hasAttribute("data-text")) {
                    if (chld[index].innerHTML.length > 50) {
                        chld[index].innerHTML = chld[index].innerHTML.substring(0, 50) + "...";
                    }
                }
            }
        }
    }
}



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
        let address = info.addr;
        let description = info.description;
        let image = info.image;
        let loctype = info.loctype;
        writeLocation(name, address, description, image, loctype);
        snapshot.ref.remove();
        location.reload(true);
    });
}


function writeLocation(name, address, description, image, loctype) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            let pos = results[0].geometry.location;
            let label;
            if (loctype === "Legal Location") {
                label = "M";
            } else {
                label = "V";
            }
            firebase.database().ref('locations/' + name).set({
                lat: Number(pos.lat()),
                lng: Number(pos.lng()),
                type: label
            });

            firebase.database().ref('info/' + name).set({
                address: address,
                desc: description,
                image: image,
                loctype: loctype
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
    firebase.auth().onAuthStateChanged(function(user) {})
};