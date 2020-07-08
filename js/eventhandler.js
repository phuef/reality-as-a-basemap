//Register the event handler for the bus stops. Show information within an infobox on hover.
AFRAME.registerComponent('cursoronbusstop', {
    init: function () {
        let infobox = $('#infobox')[0];
        let cursor = $('#cursor')[0];
        let defaultColor = $(cursor).attr('color');
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = generateBusStopInfobox(e.target);
            $(cursor).attr('color', 'green');
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
            $(cursor).attr('color', defaultColor);
        });
    }
});

//Register the event handler for the venues. Show information within an infobox on hover.
AFRAME.registerComponent('cursoronvenue', {
    init: function () {
        var infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = generateVenueInfobox(e.target);
            $(cursor).attr('color', 'yellow');
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
            $(cursor).attr('color', 'black');
        });
    }
});

function navigate(lat, lon) {
    alert('Navigation not implemented yet.');
}