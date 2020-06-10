AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        const infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            var name = ""
            var direction = "";
            var distance = "";
            infobox.innerHTML = '<i class="fas fa-bus fa-3x"></i><br>'
                + $(e.target).attr('name') + '<br><br>'
                + '<i class="fas fa-map-signs fa-2x"></i> stadt'
                + e.target.getAttribute('direction') + '<br>'
                + '<i class="fas fa-walking fa-2x"></i> '
                + e.target.getAttribute('distance');
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});