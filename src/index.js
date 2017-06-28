import Canvas from './Canvas/index.js';

window.addEventListener('load', function () {
    let canvas = new Canvas().html('canvas');

    window.addEventListener('resize', function () {
        setHeight(canvas);
    });

    setHeight(canvas);

    document.body.appendChild(canvas);
});

function setHeight(element) {
    element.width = document.body.clientWidth;
    element.height = document.body.clientHeight;
}