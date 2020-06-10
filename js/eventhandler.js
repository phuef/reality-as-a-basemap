AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', (e) => {
            var infobox = $('#infobox')[0];
            infobox.innerHTML = e.target.getAttribute('name') + '<br>'
                + e.target.getAttribute('direction') + '<br>'
                + e.target.getAttribute('distance');
        });
    }
});