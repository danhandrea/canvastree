export default class Canvas {
    html(id) {
        if (!id || !/^[A-Za-z]+[\w\-\:\.]*$/.test(id)) throw new Error(`Invalid id specified: ${id} `);

        let canvas = document.createElement('canvas');
        canvas.id = id;

        return canvas;
    }
}