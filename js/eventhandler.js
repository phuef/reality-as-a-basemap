AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        var infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            infobox.innerHTML = '<i class="fas fa-bus fa-3x"></i><br></br>'
                + e.target.getAttribute('name') + '<br>'
                + '<i class="fas fa-map-signs fa-2x"></i> stadt'
                + e.target.getAttribute('direction') + '<br>'
                + e.target.getAttribute('distance');
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});