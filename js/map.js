/**
 * Set of functions and variables that handle the map display and interaction with it.
 *
 * Dependencies:
 *  - JQuery
 *  - Google Maps JavaScript API
 *  - gmaps marker renderer library
 *  - sliders.js
 *  - navigation.js
 *
 * @author  Katharina Henggeler
 * @date    05.11.2018
 */

var selectionMode = false;
var activityMarkers;
var fannyhofMarker;
var markerCluster;
var directionsService;
var directionsDisplay;
var iconDefault;


/**
 * Initialises the map and its functionalities using the Google Maps JavaScript API.
 * The map features a custom basemap, custom markers, and a customised marker clustering.
 * Sources used for the clustering:
 *  - https://github.com/gmaps-marker-clusterer/gmaps-marker-clusterer
 *  - https://mono.software/2017/12/29/google-maps-marker-clustering
 */
function initMap() {

    // CREATE MAP
    // ------------------------------------------------------------------------------

    // define options of the base map
    var baseMapOptions = {
        center: {lat: 47.574147, lng: 8.786615},
        zoom: 14,
        mapTypeId: 'satellite',
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },

        styles: [
            {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    {"color": "#187d19"}
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"color": "#187d19"}
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#4a4a4a"}
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#ffddcb"}
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#e4efd6"},
                    {"lightness": "5"},
                    {"saturation": "0"},
                    {"weight": "1"}
                ]
            },
            {
                "featureType": "landscape.natural.landcover",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#0e6600"},
                    {"lightness": "-40"}
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#c8c8c8"}
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#d6efae"}
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"hue": "#ffde00"}
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {"hue": "#ff9f00"},
                    {"weight": "1.45"}
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#933700"}
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#ffffff"}
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#969696"}
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#ffffff"}
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#969696"}
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"hue": "#0090ff"}
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#009dff"},
                    {"lightness": "0"}
                ]
            }]

    };

    // create map
    var map = new google.maps.Map(document.getElementById("map-canvas"), baseMapOptions);


    // load data and display it on the map
    // ------------------------------------------------------------------------------

    // define icons
    iconDefault = {
        url: "images/flag.svg",
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
    };
    var iconSelected = {
        url: "images/flag_selected.svg",
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
    };
    var iconFannyhof = {
        url: "images/fannyhof_icon.svg",
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 50)
    };
    var iconFannyhofSelected = {
        url: "images/fannyhof_icon_selected.svg",
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 50)
    };

    // instantiate fannyhof marker with click event listener
    fannyhofMarker = new google.maps.Marker({
        position: {
            lat: 47.574688886882399,
            lng: 8.780882283628209
        },
        map: map,
        icon: iconFannyhof,
        label: {
            text: "F",
            fontSize: "2em",
            color: "white",
        },
        title: 'Fannyhof',
        description: "Der Hof in Altikon, welcher den Ausganspunkt für alle Ritte darstellt. Der Hof ist im Dorf gelegen " +
            "und ca 5 min von der Postauto-Haltestelle entfernt. Das Foto zeigt die Vorderseite des Hofes, von wo aus " +
            "losgeritten wird."
    });
    fannyhofMarker.addListener('click', function () {
        // fill data in info panel
        document.getElementById('feature-info-name').textContent = fannyhofMarker['title'];
        document.getElementById('feature-info-description').textContent = fannyhofMarker['description'];
        $('#feature-info-duration').parent().parent().hide();
        $('#feature-info-cat').parent().hide();
        document.getElementById('feature-info-img').innerHTML = "<img src='images/activityPics/fannyhof.jpg'>";

        // highlight selected marker
        if (selectionMode) { // multiple selection
            // do nothing
        } else { // single selection
            // clear previously highlighted selection
            activityMarkers.forEach(function (activityMarker) {
                activityMarker.setIcon(iconDefault);
            });
            // highlight newly selected activity
            fannyhofMarker.setIcon(iconFannyhofSelected);
            // show info panel and hide its default message
            $('#feature-info').show();
            $('#feature-info-default-message').hide();
            openControlPanel('info');
        }
    });

    // load activities data
    // NOTE: This uses cross-domain XHR, and may not work on older browsers.
    var activitiesData = new google.maps.Data();
    activitiesData.loadGeoJson("data/activities.json", null, function (features) {
        activityMarkers = features.map(function (feature) {
            // create marker
            var marker = new google.maps.Marker({
                position: feature.getGeometry().get(0),
                icon: iconDefault,
                id: feature.getProperty('id'),
                title: feature.getProperty('name'),
                description: feature.getProperty('description'),
                duration: feature.getProperty('duration'),
                selected: false,
                categories: feature.getProperty('categories')
            });

            // add click event listener to the marker
            marker.addListener('click', function () {
                // TODO fill data move into if statement
                // fill data in info panel
                document.getElementById('feature-info-name').textContent = marker['title'];
                document.getElementById('feature-info-description').textContent = marker['description'];
                document.getElementById('feature-info-duration').textContent = marker['duration'];
                $('#feature-info-duration').parent().parent().show();
                document.getElementById('feature-info-cat').textContent = marker['categories'].toString().replace(/,/g, ", ");
                $('#feature-info-cat').parent().show();

                var url = 'images/activityPics/' + marker['id'] + '.jpg';
                $.ajax({
                    url: url,
                    type: 'HEAD',
                    error: function ()   // no image file available
                    {
                        document.getElementById('feature-info-img').innerHTML = "<p> - Kein Bild vorhanden - </p>"
                    },
                    success: function () // image file available
                    {
                        document.getElementById('feature-info-img').innerHTML = "<img src='" + url + "'>";
                    }
                });

                // highlight selected marker
                if (selectionMode) { // multiple selection
                    var countDisplay = document.getElementById('activities-count');
                    // toggle selection of clicked feature
                    let selected = marker['selected'];
                    if (selected) { // if selected, deselect and decrease count
                        marker.setIcon(iconDefault);
                        setActivitiesCount(parseInt(countDisplay.innerText) - 1);
                    } else { // if not selected, select and increase count
                        marker.setIcon(iconSelected);
                        setActivitiesCount(parseInt(countDisplay.innerText) + 1);
                    }
                    marker['selected'] = !selected;
                } else { // single selection
                    // clear previously highlighted selection
                    fannyhofMarker.setIcon(iconFannyhof);
                    activityMarkers.forEach(function (activityMarker) {
                        activityMarker.setIcon(iconDefault);
                    });
                    // highlight newly selected activity
                    marker.setIcon(iconSelected);
                    // show info panel and hide its default message
                    $('#feature-info').show();
                    $('#feature-info-default-message').hide();
                    openControlPanel('info');
                }
            });

            return marker;
        });

        // initialise marker clusterer
        markerCluster = new MarkerClusterer(map, activityMarkers, {
            ignoreHiddenMarkers: true
        });
    });


    // ROUTING
    // ------------------------------------------------------------------------------

    // Instantiate a directions service
    directionsService = new google.maps.DirectionsService;

    // Create a renderer for directions and bind it to the map
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: {
            strokeColor: '#c13f11',
            strokeWeight: 5,
            strokeOpacity: 0.7
        },
        suppressMarkers: true
    });
}

/**
 * Runs the routing algorithm with the current configuration (selected activities, specified percentages and speeds for
 * walk, trot, and canter) and, if sucessful, displays the result on the map.
 * Displaying the result means:
 *  - showing the route as a polyline
 *  - hiding all activities except the ones visited on the route (and repainting the marker clusterer)
 *  - disabling the categories panel (so that the user may not change the selection of the currently visible activities)
 */
function calculateAndDisplayRoute() {
    // convert the selected activities to waypoints
    var activityWaypoits = selectedActivitiesToWaypointArray();
    // run the routing with the directions service (fannyhof is start and end, order of waypoints may be optimised)
    directionsService.route({
        origin: fannyhofMarker.getPosition(),
        destination: fannyhofMarker.getPosition(),
        travelMode: 'WALKING',
        waypoints: activityWaypoits,
        optimizeWaypoints: true
    }, function (response, status) {
        if (status === 'OK') {
            // display route as polyline
            directionsDisplay.setDirections(response);

            // hide all activities that are not visited on the route by iterating all activity markers and...
            activityMarkers.forEach(function (activityMarker) {
                // ...hiding each activity marker whose selected property is false
                if (!activityMarker['selected']) {
                    activityMarker.setVisible(false);
                }
            });
            markerCluster.repaint();    // needed to update the marker clustering

            // fill route info data
            document.getElementById('route-distance').innerText = response.routes[0].legs[0].distance.text; // m
            document.getElementById('route-duration').innerText = formatMinutes(calculateDuration(response.routes[0].legs[0].distance.value)); // min
            document.getElementById('route-activities').innerText = activityWaypoits.length.toString();

            // show the panel with the route info
            $('#route-info').show();    // show the info div in the panel
            openControlPanel('routing');    // show the panel itself

            // disable categories panel (so that the user may not change the selection of currently visible activities)
            $('#cat-content').addClass('disabled-text');    // add class 'disabled-text' to the entire content
            $('#cat-content :checkbox').each(function (i, checkbox) {   // disable all checkboxes
                checkbox.disabled = true;
            });
            $('#cat-content .checkbox-label').each(function (i, label) {    // set the default cursor for all labels
                label.style.cursor = 'default';
            });
            $('#cat-disabled-message').show();  // show the disabled message
        } else {
            // show alert message, if the routing failed for some reason
            window.alert('Directions request failed due to ' + status);
        }

        // deselect all activities
        activityWaypoits = [];  // clear the array with the waypoints (most likely unnecessary, but just to be sure)
        toggleSelectionMode();   // clear selection in the map by toggling the selection mode
    });
}

/**
 * Clear the currently displayed route by:
 *  - removing the polyline symbolising the route
 *  - showing all activities again (and repainting the marker clusterer)
 *  - enabling the categories panel
 */
function clearRoute() {
    // clear the route in the map
    directionsDisplay.set('directions', null);

    // show all activities by iterating all activity markers and...
    activityMarkers.forEach(function (activityMarker) {
        // ...setting the visibility to true for each of them
        activityMarker.setVisible(true);
    });
    markerCluster.repaint();    // needed to update the marker clustering

    // hide the div in the routing panel that contains the route information
    $('#route-info').hide();

    // enable the categories panel
    $('#cat-content').removeClass('disabled-text'); // remove class 'disabled-text' from the entire content
    $('#cat-content :checkbox').each(function (i, checkbox) {   // enable all checkboxes
        checkbox.disabled = false;
    });
    $('#cat-content .checkbox-label').each(function (i, label) {    // set the pointer cursor for all labels
        label.style.cursor = 'pointer';
    });
    $('#cat-disabled-message').hide();  // hide the disabled message
}

/**
 * Toggles the selection mode; i.e. toggles between selecting a single activity (and showing its info in the info panel)
 * and selecting multiple activities (for calculating a route).
 */
function toggleSelectionMode() {
    // clear all previous selected activities and reset display style
    clearSelectedActivities();
    // toggle mode
    selectionMode = !selectionMode;
    // toggle button text
    if (selectionMode) {
        document.getElementById('select-activities').innerText = 'Auswahl löschen';
    } else {
        document.getElementById('select-activities').innerText = 'Aktivitäten auswählen';
    }
}

/**
 * Picks all the activities (from the activityMarkers array) whose property 'selected' is true, converts them into a
 * waypoint and collects them in a new array.
 *
 * @returns {Array} - array of waypoints
 */
function selectedActivitiesToWaypointArray() {
    // create new empty array for the activity waypoints
    var activityWaypoints = [];
    // loop all activity markers
    activityMarkers.forEach(function (activityMarker) {
        // if the marker's selected property is true...
        if (activityMarker['selected']) {
            // ...create a waypoint from it and push it to the waypoint array
            activityWaypoints.push({
                location: activityMarker.getPosition(),
                stopover: false
            });
        }
    });
    // return the array of activity waypoints
    return activityWaypoints;
}

/**
 * Deselects all activity markers in the map:
 *  - resets the marker icon
 *  - sets the marker's selected property to false
 *  - sets the activities count to 0
 *  - hides the div containing the feature info in the info panel
 *  - disables the routing button (would trigger the routing algorithm), since no activities to route to are selected
 */
function clearSelectedActivities() {
    // loop over all activity markers and...
    activityMarkers.forEach(function (activityMarker) {
        // ...reset the icon to the default icon
        activityMarker.setIcon(iconDefault);
        // ...reset the marker's selected property to false
        activityMarker['selected'] = false;
    });
    // reset the activities count
    setActivitiesCount(0);
    // hide the feature info div in the info panel and show the default message
    $('#feature-info').hide();
    $('#feature-info-default-message').show();
    // disable the routing button
    document.getElementById('routing-button').disabled = true;
}

/**
 * Calculates the duration of the trip from the passed distance. It reads the parameters from the routing panel and
 * uses them for the calculation.
 *
 * @param distance  - distance of the trip in meters
 * @returns {number}    - the duration of the trip in minutes
 */
function calculateDuration(distance) {
    // get percentages of the speeds and convert from range 0-100 to range 0-1
    var percentages = getPercentages();
    var percentageWalk = percentages[0] / 100;
    var percentageTrot = percentages[1] / 100;
    var percentageCanter = percentages[2] / 100;
    // get walk speeds and convert from km/h to m/min
    var walkSpeed = parseInt(document.getElementById('walk-speed').value) * 100 / 6;
    var trotSpeed = parseInt(document.getElementById('trot-speed').value) * 100 / 6;
    var canterSpeed = parseInt(document.getElementById('canter-speed').value) * 100 / 6;
    // calculate respective distances as percentages of the total distance
    var walkDist = percentageWalk * distance;
    var trotDist = percentageTrot * distance;
    var canterDist = percentageCanter * distance;
    // calculate durations (t = d/v)
    var durationWalk = walkDist / walkSpeed;
    var durationTrot = trotDist / trotSpeed;
    var durationCanter = canterDist / canterSpeed;

    // sum up the durations of all the selected activities
    var durationActivities = 0;
    activityMarkers.forEach(function (activityMarker) {
        if (activityMarker['selected']) {
            durationActivities += activityMarker['duration'];
        }
    });

    // return duration of entire walk (all speeds plus visited activities)
    return durationWalk + durationTrot + durationCanter + durationActivities;
}

/**
 * Format minutes into readable text.
 * If the number of minutes extends 24 h, i.e. one day, it will still return them as hours (e.g. 26 h 30 min).
 *
 * @param minutes   - a number denoting the minutes to format
 * @returns {string}    - a string of the format "00 h 00 min"
 */
function formatMinutes(minutes) {
    // determine the number of hours and minutes
    var h = Math.floor(minutes / 60);
    var min = Math.round(minutes % 60).toString();

    // if the number of minutes extens 1 hour...
    if (h > 0) {
        // ...append the respective amount at the beginning of the string
        return h + ' h ' + min.padStart(2, '0') + ' min';
    } else {
        // ... else, return the minutes only
        return min.padStart(2, '0') + ' min';
    }
}

/**
 * Handles the event fired, when a category checkbox is clicked by:
 *  - deselecting or selecting the respective activities in the map
 *  - repainting the marker clusterer
 *
 * Unchecking a checkbox will lead to all activities by that category to be hidden, checking it means all activities by
 * that category will be shown. Since an activity can have more than one category, a checkbox thus needs to be unchecked
 * and then checked again to make really sure all activities of that category are visible.
 *
 * @param checkbox  - the checkbox that was clicked
 * @param category  - a string specifying the category that the clicked checkbox represents
 */
function onCatCheckboxChanged(checkbox, category) {
    if (checkbox.checked) { // checkbox has been checked
        // show all activities of this category
        activityMarkers.forEach(function (activityMarker) {
            if (activityMarker['categories'].includes(category)) {
                activityMarker.setVisible(true);
                markerCluster.repaint();    // needed to update the marker clustering
            }
        });
    } else {    // checkbox has been unchecked
        // hide all activities of this category
        activityMarkers.forEach(function (activityMarker) {
            if (activityMarker['categories'].includes(category)) {
                activityMarker.setVisible(false);
                markerCluster.repaint();    // needed to update the marker clustering
            }
        });
    }
}
