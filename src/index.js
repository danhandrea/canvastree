import Canvas from './Canvas/index.js';

window.addEventListener('load', function () {
    let canvas = new Canvas().html('canvas');

    document.body.appendChild(canvas);
});