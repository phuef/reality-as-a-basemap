//Register the event handler for the bus stops. Show information within an infobox on hover.
AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        const infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = generateBusStopPopup(e.target);
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});

//Register the event handler for the venues. Show information within an infobox on hover.
AFRAME.registerComponent('cursor_venue', {
    init: function () {
        const infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            var name = $(e.target).attr('name')
            var distance = $(e.target).attr('distancemsg');
            var lat = $(e.target).attr('lat');
            var lon = $(e.target).attr('lon');

            infobox.innerHTML = '<i class="fas fa-star fa-3x"></i><br>'
                + name + '<br><br>'
                + '<i class="fas fa-walking fa-2x"></i> '
                + distance + '<br><br>'
                + '<a class="btn btn-success" href="#" onclick="navigate(' + lat + ', ' + lon + ')"><i class="fas fa-crosshairs"></i> Navigate</a>';
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});

//Register the event handler for the bus lines. Show information within an infobox on hover.
AFRAME.registerComponent('cursor_busline', {
    init: function () {
        const infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            var id = $(e.target).attr('id');
            var direction = $(e.target).attr('direction');
            var delay = $(e.target).attr('delay');
            var lat = $(e.target).attr('lat');
            var lon = $(e.target).attr('lon');

            console.log(id, direction, delay);

            infobox.innerHTML = '<i class="fas fa-star fa-3x"></i><br>'
                + id + '<br><br>'
                + '<i class="fas fa-map-signs fa-2x"></i>'
                + direction + '<br>'
                + '<i class="far fa-clock fa-2x"></i>'
                + delay + '<br>'
                + '<a class="btn btn-success" href="#" onclick="navigate(' + lat + ', ' + lon + ')"><i class="fas fa-crosshairs"></i> Navigate</a>';
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});

function navigate(lat, lon) {
    alert('Navigation not implemented yet.');
}