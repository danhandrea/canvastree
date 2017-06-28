/*@flow*/
export default class Canvas {
    static html(id: string) {
        if (!id || /^[A-Za-z]+[\w\-\:\.]*$/.test(id)) throw new Error(`Invalid id specified: ${id} `);

        let canvas = document.createElement('canvas');
        canvas.id = id;

        return canvas;
    }
}