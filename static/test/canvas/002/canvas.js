function setColour(id, v) {
    pen.colour = v;
    updateStyles(id, '#colours1 > button', 'button', 'button_selected');
}

function setLineWidth(id, v) {
    pen.width = v;
    updateStyles(id, '#lineWidths1 > button', 'button', 'button_selected');
}

function setPressure(id, v) {
    pen.alpha = v;
    updateStyles(id, '#pressures1 > button', 'button', 'button_selected');
}

function clickOption(range) {
    $(range).map(function() {
        this.click();
    });
}

function updateStyles(selectedId, range, normalClass, selectedClass) {
    $(range).map(function() {
        if (this.id === selectedId) {
            this.classList.remove(normalClass);
            this.classList.add(selectedClass);
        } else {
            this.classList.add(normalClass);
            this.classList.remove(selectedClass);
        }
    });
}

function onPageLoading() {
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

    clickOption('#colours1 > #o1');
    clickOption('#lineWidths1 > #o3');
    clickOption('#pressures1 > #o2');

    // draw image1 onto the canvas
    var img = document.getElementById("image1");
    ctx.drawImage(img, 0, 0);

}

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

