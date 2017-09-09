//@flow
let initialState = {}

function reducer(state, action) {
    switch (action.type) {
        default: return state;
    }
}

const store = Redux.createStore(reducer, initialState);

store.subscribe(function () {
    render();
});

const start = () => {
    console.log('starting');
    steps.reduce((acc, cur) => {
        return { ...acc
        }
    }, {});


}


const getContext = (): CanvasRenderingContext2D => {
    const canvas = document.createElement("canvas");
    document.appendChild(canvas);
    return canvas.getContext("2d");
}

const render = () => {
    console.log("foo");
}


const steps = [
    getContext,
    render
]

document.addEventListener("DOMContentLoaded", start);