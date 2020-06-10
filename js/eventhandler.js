AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function () {
            var infobox = $("#infobox");
            alert(infobox);
            infobox.innerHTML = "<p>TESTZEILE</p>";
        });
    }
});