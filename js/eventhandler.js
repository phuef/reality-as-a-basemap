AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function () {
            var infobox = $("#infobox");
            var text = document.createElement("text");
            text.attr("value", "TEST Bushaltestelle");
            infobox.appendChild(text);
        });
    }
});