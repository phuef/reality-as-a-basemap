AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', function () {
            var infobox = $("#infobox")[0];
            alert(infobox.innerHTML);
            infobox.innerHTML = "<p>TESTZEILE</p>";
        });
    }
});