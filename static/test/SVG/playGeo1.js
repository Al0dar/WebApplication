function testPopulate() {
    var content = '';

    p0 = new Point(0, 0);
    p1 = new Point(250, 200);
    p2 = new Point(150, 200);

    content += getSVGLine(p0, p1, null, 'blue', '3');
    content += getSVGLine(p0, p2, null, 'black', '2');

    setContent('svgPlaceholder1', content);
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getSVGLine(p1, p2, id, stroke, strokeWidth) {
    var rv = '';
    rv += '<path ';
    rv += 'id="lineC" ';
    rv += 'd="M ' + p1.x + ' ' + p1.y + ' l ' + (p2.x - p1.x) + ' ' + (p2.y - p1.y) + '" ';
    rv += 'stroke="' + stroke + '" ';
    rv += 'stroke-width="' + strokeWidth + '" ';
    rv += 'fill="none" ';
    rv += '/>';
    return rv;
}
