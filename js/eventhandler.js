AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function (e) {
            var infobox = $("#infobox")[0];
            infobox.innerHTML = e.target.getAttribute('name');
        });
    }
});