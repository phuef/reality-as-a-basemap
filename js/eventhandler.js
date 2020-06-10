AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', (e) => {
            var infobox = $('#infobox')[0];
            infobox.innerHTML = '<i class="fas fa-bus fa-3x"></i><br></br>'
                + e.target.getAttribute('name') + '<br>'
                + e.target.getAttribute('direction') + '<br>'
                + e.target.getAttribute('distance');
        });
    }
});