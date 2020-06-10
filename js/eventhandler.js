AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function () {
            var infobox = $("#infobox")[0];
            infobox.innerHTML = this.el.getAttribute('name');
        });
    }
});