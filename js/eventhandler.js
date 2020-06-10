AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function () {
            var popup = document.createElement("div");
            var scene = $("scene")[0];

            popup.attr("background", "grey");
            popup.attr("opacity", "0.7");
            popup.innerHTML = "Hallo, TEST";

            scene.appendChild(popup);
        });
    }
});