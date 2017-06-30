import FTE from './FTE/index.js';

var fte = new FTE();

window.addEventListener('load', () => {
    fte.init();
    fte.update();
});

window.fte = fte;