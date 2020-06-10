AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        var infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = '<i class="fas fa-bus fa-3x"></i><br>'
                + e.target.getAttribute('name') + '<br><br>'
                + '<i class="fas fa-map-signs fa-2x"></i> stadt'
                + e.target.getAttribute('direction') + '<br>'
                + '<i class="fas fa-walking fa-2x"></i> '
                + e.target.getAttribute('distance').slice(0, 2);
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});