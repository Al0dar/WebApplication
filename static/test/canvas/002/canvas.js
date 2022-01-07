function onPageLoaded() {

    imaginator1 = new Imaginator("canvas1", 'image1.png', 'image/png', 'image1');
    imaginator1.load();

    imaginator2 = new Imaginator("canvas2", 'image2.png', 'image/png', 'image2');
    imaginator2.load();

    pen1 = imaginator1.pen;
    imaginator2.pen.mimick = pen1;

    clickOption('#colours1 > #o1');
    clickOption('#lineWidths1 > #o3');
    clickOption('#pressures1 > #o2');

}

function setPenColour(id, v) {
    pen1.colour = v;
    updateStyles(id, '#colours1 > button', 'button', 'button_selected');
}

function setPenWidth(id, v) {
    pen1.width = v;
    updateStyles(id, '#lineWidths1 > button', 'button', 'button_selected');
}

function setPenPressure(id, v) {
    pen1.alpha = v;
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



