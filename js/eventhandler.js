AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function () {
            var infobox = $("#infobox")[0];
            infobox.innerHTML = "<p>Neuer Text</p>";
        });
    }
});