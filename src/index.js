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
    let w = 0,
        h = 0;

    w = document.body.clientWidth - 1;
    h = document.body.clientHeight - 1;

    if (w % 2 !== 0 && w > 1) w -= 1;
    if (h % 2 !== 0 && h > 1) h -= 1;

    element.width = w;
    element.height = h;
}