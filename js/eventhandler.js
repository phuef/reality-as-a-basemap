AFRAME.registerComponent('cursoronbusstop', {
    init: () => {
        this.el.addEventListener('mouseenter', busStopToInfobox(e));
    }
});