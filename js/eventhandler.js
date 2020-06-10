AFRAME.registerComponent('cursorOnBusStop', {
    init: function () {
        this.el.addEventListener('mouseenter', busStopToInfobox(e));
    }
});