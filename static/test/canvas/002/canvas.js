function doClear() {
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = pen.colour + pen.alpha;
    ctx.fillRect(0, 0, 500, 500);
}

function doSave() {
    // post the canvas as an image file (raw data / blob)
    var canvas = document.getElementById("canvas1");
    i = new Imaginator(canvas, '/saveimage/canvas-2-output.png', 'image/png');
    i.post();
    alert("image saved");
}

function doTiling() {
    var ctx = document.getElementById('canvas1').getContext('2d');
    var img = new Image();
    img.src = '/static/images/favicon.png';
    img.onload = function() {
        var ptrn = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, 500, 500);
    }
}

function setColour(v) {
    pen.colour = v;
}

function setPressure(v) {
    pen.alpha = v;
}

function setLineWidth(v) {
    pen.width = v;
}

function onPageLoading() {
    doClear();
}

function onPageLoaded() {

    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");

    pen = new CanvasLinePen(ctx);
    pen.colour = '#000000';
    pen.width = 2;
    pen.alpha = '99';
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

