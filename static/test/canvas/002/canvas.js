function setColour(id, v) {
    imaginator1.pen.colour = v;
    updateStyles(id, '#colours1 > button', 'button', 'button_selected');
}

function setLineWidth(id, v) {
    imaginator1.pen.width = v;
    updateStyles(id, '#lineWidths1 > button', 'button', 'button_selected');
}

function setPressure(id, v) {
    imaginator1.pen.alpha = v;
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

function onPageLoading() {}

function onPageLoaded() {

    imaginator1 = new Imaginator("canvas1", 'image1.png', 'image/png', 'image1');
    imaginator2 = new Imaginator("canvas2", 'image2.png', 'image/png', 'image2');

    clickOption('#colours1 > #o1');
    clickOption('#lineWidths1 > #o3');
    clickOption('#pressures1 > #o2');

    imaginator2.pen.mimick = imaginator1.pen;

    imaginator1.load();
    imaginator2.load();

}

function doClear(i) {
    i.clear();
}

function doLoad(i) {
    i.load();
}

function doSave(i) {
    i.save();
}

function doCopyFrom(di, si) {
    di.copyFrom(si);
}

function doPaste() {
    imaginator1.ctx.drawImage(imaginator2.image, 0, 0);
}

function doTiling() {
    var img = new Image();
    img.src = '/static/images/favicon.png';
    img.onload = function() {
        var ptrn = imaginator1.ctx.createPattern(img, 'repeat');
        imaginator1.ctx.fillStyle = ptrn;
        imaginator1.ctx.fillRect(0, 0, 500, 500);
    }
}

