AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        const infobox = $('#infobox')[0];
        this.el.addEventListener('mouseenter', (e) => {
            var name = $(e.target).attr('name')
            var direction = $(e.target).attr('direction');
            var distance = $(e.target).attr('distance');

            infobox.innerHTML = '<i class="fas fa-bus fa-3x"></i><br>'
                + name + '<br><br>'
                + '<i class="fas fa-map-signs fa-2x"></i> stadt'
                + direction + '<br>'
                + '<i class="fas fa-walking fa-2x"></i> '
                + distance;
        });

        this.el.addEventListener('mouseleave', () => {
            infobox.innerHTML = "";
        });
    }
});