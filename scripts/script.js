var countries = {
    'au': {
        center: { lat: -25.3, lng: 133.8 },
        zoom: 4
    },
    'br': {
        center: { lat: -14.2, lng: -51.9 },
        zoom: 3
    },
    'ca': {
        center: { lat: 62, lng: -110.0 },
        zoom: 3
    },
    'fr': {
        center: { lat: 46.2, lng: 2.2 },
        zoom: 5
    },
    'de': {
        center: { lat: 51.2, lng: 10.4 },
        zoom: 5
    },
    'mx': {
        center: { lat: 23.6, lng: -102.5 },
        zoom: 4
    },
    'nz': {
        center: { lat: -40.9, lng: 174.9 },
        zoom: 5
    },
    'it': {
        center: { lat: 41.9, lng: 12.6 },
        zoom: 5
    },
    'za': {
        center: { lat: -30.6, lng: 22.9 },
        zoom: 5
    },
    'es': {
        center: { lat: 40.5, lng: -3.7 },
        zoom: 5
    },
    'pt': {
        center: { lat: 39.4, lng: -8.2 },
        zoom: 6
    },
    'us': {
        center: { lat: 37.1, lng: -95.7 },
        zoom: 3
    },
    'uk': {
        center: { lat: 54.8, lng: -4.6 },
        zoom: 5
    }
};
var map;
var places;
var markers = [];
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
 
function initMap() {
    
    document.getElementById('country').addEventListener('change', countryOfChoice);
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['uk'].zoom,
        center: countries['uk'].center,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false
    });
    places = new google.maps.places.PlacesService(map);

    var input = document.getElementById('searchForLocation');
    var options = {
        types: ['(cities)'],
        componentRestrictions: {'country': 'uk'}
    };
      
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo('bounds',map);
    
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        $("#hotelResults").collapse("show");
        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            search();
        }
    });
    
    function countryOfChoice() {
        var country = document.getElementById('country').value;
        if (country == 'all') {
            autocomplete.setComponentRestrictions({'country': []});
            map.setCenter({lat: 15, lng: 0});
            map.setZoom(2);
        } else {
            autocomplete.setComponentRestrictions({'country': country});
            map.setCenter(countries[country].center);
            map.setZoom(countries[country].zoom);
        }
        input.value = '';
    }
    
    $("#barResults").on("show.bs.collapse", function() {
        search("bar", "barResultsList");
    });
    $("#restaurantResults").on("show.bs.collapse", function() {
        search("restaurant", "restaurantResultsList");
    });
    $("#attractionsResults").on("show.bs.collapse", function() {
        search("museum", "attractionsResultsList");
    });
    $(".hotelHeader").on("show.bs.collapse", function() {
        $(this).siblings().find(".panel-body").collapse("hide");
    }); 
    
    function search(searchType="lodging", dropLocation="hotelResultsList") {
        var search = {
            bounds: map.getBounds(),
            types: [searchType]
        };

        places.nearbySearch(search, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                document.getElementById(dropLocation).innerHTML = '';
                for (var i = 0; i < results.length; i++) {
                    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
                    var markerIcon = MARKER_PATH + markerLetter + '.png';
                    // Use marker animation to drop the icons incrementally on the map.
                    markers[i] = new google.maps.Marker({
                        position: results[i].geometry.location,
                        animation: google.maps.Animation.DROP,
                        icon: markerIcon
                    });
                    markers[i].placeResult = results[i];
                    setTimeout(markers[i].setMap(map), i * 100);
                    addResult(results[i], i, dropLocation);
                }
            }
        });
    }
    
    function addResult(result, i, dropLocation) {
        var results = document.getElementById(dropLocation);
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        var listItem = document.createElement('li');
        var icon = document.createElement('img');
        icon.src = "/assets/image/hotel-solid.svg";
        icon.setAttribute('class', 'hotelIcon');
        icon.setAttribute('className', 'hotelIcon');
        listItem.appendChild(icon);
        var name = document.createTextNode(markerLetter + " - " + result.name);
        listItem.setAttribute("class", "hotelResult");
        listItem.appendChild(name);
        results.appendChild(listItem);
        
        
      }

   
    
    
}


