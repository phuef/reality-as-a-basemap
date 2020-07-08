//Register the event handler for the bus stops. Show information within an infobox on hover.
AFRAME.registerComponent('cursoronbusstop', {
    init: function () {
        let infobox = $('#infobox')[0];
        let cursor = $('#cursor')[0];
        let defaultColor = $(cursor).attr('color');

        //If the cursor hovers over the element...
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = generateBusStopInfobox(e.target); //Draw the info to the infobox
            $(cursor).attr('color', 'green'); //Switch the cursor color
        });
        //If the cursor leaves the element...
        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = ""; //Clear the infobox
            $(cursor).attr('color', defaultColor); //Set the cursor color to default
        });
    }
});

//Register the event handler for the venues. Show information within an infobox on hover.
AFRAME.registerComponent('cursoronvenue', {
    init: function () {
        let infobox = $('#infobox')[0];
        let cursor = $('#cursor')[0];
        let defaultColor = $(cursor).attr('color');

        //If the cursor hovers over the element...
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = generateVenueInfobox(e.target); //Draw the info to the infobox
            $(cursor).attr('color', 'yellow'); //Switch the cursor color
        });
        //If the cursor leaves the element...
        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = ""; //Clear the infobox
            $(cursor).attr('color', defaultColor); //Set the cursor color to default
        });
    }
});

/**
 * Navigation feature to be implemented.
 * @param {*} lat 
 * @param {*} lon 
 */
function navigate(lat, lon) {
    alert('Navigation not implemented yet.');
}