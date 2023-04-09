/**
 * Set of functions that handle GUI interactions that are independent from the map.
 *
 * Dependencies:
 *  - none
 *
 * @author  Katharina Henggeler
 * @date    05.11.2018
 */

/**
 * Toggles the navigation bar tab (i.e. the visibility of the corresponding panel) with the specified name.
 *
 * @param panelName - the id of the tab to be toggled
 */
function onNavButtonClicked(panelName) {
    // get the html element of the panel in question
    var panel = document.getElementById(panelName);
    // if the panel is hidden...
    if (panel.style.display === 'none') {
        // ...open it
        openControlPanel(panelName)
    } else {
        // if the panel is visible, hide/close it (incl. resetting the background color of the tab)
        panel.style.display = 'none';
        document.getElementById('tab-' + panelName).style.backgroundColor = "#BF7E4D"; // gradBC Q1
    }
}

/**
 * Opens the panel of the map control panel with the specified name.
 *
 * @param panelName - the id of the panel to be opened
 */
function openControlPanel(panelName) {
    // get an array of all the map control panels (i.e. all html elements with class "panel")
    var panels = document.getElementsByClassName('panel');
    // get the array of all the tab html elements of the navigation bar
    var tabButtons = document.getElementById('navbar').children;

    // iterate all map control panels (and consecutively also all navigation bar tabs) and...
    for (let i = 0; i < panels.length; i++) {
        // ...hide each panel
        panels[i].style.display = "none";
        // ...reset the background color of each navigation bar tab
        tabButtons[i].style.backgroundColor = "#BF7E4D"; // gradBC Q1
    }

    // show the map control panel in question
    document.getElementById(panelName).style.display = "flex";
    // set the background color of the navigation bar tab in question to the highlighted color
    var tabButton = document.getElementById('tab-' + panelName);
    tabButton.style.backgroundColor = "#D69466"; // color B
}

/**
 * Sets the count of activities in the routing panel.
 *
 * @param newCount  - the new count to be displayed
 */
function setActivitiesCount(newCount) {
    // set the new count
    var countDisplay = document.getElementById('activities-count');
    countDisplay.innerText = newCount;
    // enable routing button if at least 1 activity is selected, else disable
    if (newCount > 0) {
        document.getElementById('routing-button').disabled = false;
    } else {
        document.getElementById('routing-button').disabled = true;
    }
}

/**
 * Opens the popup (any div with the class "popup") with the specified id, if it's not open yet. If it is already open,
 * the popup gets closed instead.
 * This function ensures that there is always only one popup of the three (imprint, about, sources) open at a time.
 *
 * @param id    - id of the popup to be opened
 */
function togglePopup(id) {
    // get the html element of the popup in question
    var popup = document.getElementById(id);
    // if the popup in question is not visible yet...
    if (popup.style.display === 'none') {
        // ...iterate all html elements with class "popup" and hide them
        var popups = document.getElementsByClassName('popup');
        for(let i=0; i < popups.length; i++) {
            popups[i].style.display = 'none';
        }
        // then, show the popup in question
        popup.style.display = 'flex';
    } else {
        // if the popup in question is not yet visible, show it
        popup.style.display = 'none';
    }
}