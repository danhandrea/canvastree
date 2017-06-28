import Canvas from './Canvas/index.js';

window.addEventListener('load', function () {
    document.body.appendChild(new Canvas().html('canvas'));
});