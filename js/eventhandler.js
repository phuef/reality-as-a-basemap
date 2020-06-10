AFRAME.registerComponent('cursorOnBusStop', {
    init: function () {
        this.el.addEventListener('mouseenter', (e) => {
            var infobox = $("#infobox")[0];
            infobox.innerHTML = event.target.getAttribute('name');
        });
    }
});