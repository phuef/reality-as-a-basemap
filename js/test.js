var position, scene = null;

$(document).ready(() => {
    navigator.geolocation.getCurrentPosition((x) => {
        position = x;
        scene = $('a-scene')[0];
        initVenues(position, scene);
        initBusstops(position, scene);
        //initBuslines(position, scene);
    });
});