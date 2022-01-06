function onPageLoading() {

    doClear();

}

function onPageLoaded() {

    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");

    pen = new CanvasLinePen(ctx);
    canvas.addEventListener('mousedown', e => {
        pen.start(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mousemove', e => {
        pen.drawTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mouseup', e => {
        pen.stop();
    });

    // draw image1 onto the canvas
    var img = document.getElementById("image1");
    ctx.drawImage(img, 0, 0);

}

function doClear() {

    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#8888aa";
    ctx.fillRect(0, 0, 500, 500);

}

function doSave() {

    // post the canvas as an image file (raw data / blob)
    var canvas = document.getElementById("canvas1");
    i = new Imaginator(canvas, '/saveimage/canvas-2-output.png', 'image/png');
    i.post();
    alert("image saved");

}

