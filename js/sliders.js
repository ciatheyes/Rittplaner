/**
 * a list of objects and functions that provide the functionality of the sliders in the routing panel
 * adapted from the Bootstrap Slider Plugin at:
 * https://www.jqueryscript.net/form/Highly-Customizable-Range-Slider-Plugin-For-Bootstrap-Bootstrap-Slider.html
 *
 * Dependencies:
 *  - Bootstrap Slider Plugin
 *  - Bootstrap
 *  - JQuery
 *
 * @author  Katharina Henggeler
 * @date    05.11.2018
 */

// 3-percentage slider for speed percentages with slide-event listener to bind to the corresponding input textfield
var percentagesSlider = $('#percentages-speed').slider({
    id: "percentages-slider",
    min: 0,
    max: 100,
    step: 5,
    range: true,
    value: [75, 95],
    tooltip: "hide"
});
percentagesSlider.on("slide", function (slideEvent) {
    var percentages = sliderPositionsToPercentages(slideEvent.value);
    document.getElementById('walk-percentage-text').innerText = percentages[0];
    document.getElementById('trot-percentage-text').innerText = percentages[1];
    document.getElementById('canter-percentage-text').innerText = percentages[2];
});

// walk speed slider with slide-event listener to bind to the corresponding input textfield
var walkSpeed = $("#walk-speed").slider({
    id: "walk-speed-slider",
    min: 0,
    max: 50,
    step: 1,
    value: 6,
    tooltip: "hide"
});
walkSpeed.on("slide", function(slideEvt) {
    document.getElementById('walk-speed-text').value = slideEvt.value;
});

// trot speed slider with slide-event listener to bind to the corresponding input textfield
var trotSpeed = $("#trot-speed").slider({
    id: "trot-speed-slider",
    min: 0,
    max: 50,
    step: 1,
    value: 15,
    tooltip: "hide"
});
trotSpeed.on("slide", function(slideEvt) {
    document.getElementById('trot-speed-text').value = slideEvt.value;
});

// canter speed slider with slide-event listener
var canterSpeed = $("#canter-speed").slider({
    id: "canter-speed-slider",
    min: 0,
    max: 50,
    step: 1,
    precision: 0,
    value: 25,
    tooltip: "hide"
});
canterSpeed.on("slide", function(slideEvt) {
    document.getElementById('canter-speed-text').value = slideEvt.value;
});


/**
 * updates the value of the specified slider with the specified value
 *
 * @param sliderID
 * @param newValue
 */
function setSliderValue(sliderID, newValue) {
    $('#' + sliderID).slider('setValue', newValue, false, false);
}

/**
 * returns the percentages (values between 0 and 100) of walk, trot, canter as an array
 *
 * @returns {*[]}  array of length 3
 */
function getPercentages() {
    var sliderPositions = percentagesSlider.slider('getValue');
    return sliderPositionsToPercentages(sliderPositions);
}

/**
 * takes two slider positions and returns the three percentages represented by it
 *
 * @param sliderPositions   array of length 2
 * @returns {*[]}   array of length 3
 */
function sliderPositionsToPercentages(sliderPositions) {
    var walk = sliderPositions[0];
    var trot = (sliderPositions[1] - walk);
    var canter = (100 - sliderPositions[1]);
    return [walk, trot, canter];
}