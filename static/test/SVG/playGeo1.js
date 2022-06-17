function testPopulate(id) {

}

function getTestContent() {

    var rv = '';

    axisStyle = new Style('grey', '0.03');

    var axisSize = 3;
    rv += axisStyle.getStart();
    rv += getLine(new Point(-axisSize, 0), new Point(axisSize, 0));
    rv += getLine(new Point(0, -axisSize), new Point(0, axisSize));
    rv += axisStyle.getEnd();

    origin = new Point(0, 0);

    p1 = origin.delta(1.5, 1.2);
    s1 = new Style('blue', '0.03', 'blue');

    p2 = origin.delta(1.8, -0.2);
    s2 = new Style('red', '0.03', 'red');

    textStyle = new Style(null, '0.01');
    textStyle.setTextStyle(0.2, 'sans-serif', 'middle')

    rv += s1.getStart();
    rv += getLine(origin, p1);
    rv += getCircle(p1, 0.03);
    rv += textStyle.getStart();
    rv += getText(p1.delta(0.2, 0), 'P1');
    rv += textStyle.getEnd();
    rv += s1.getEnd();

    rv += s2.getStart();
    rv += getLine(origin, p2);
    rv += getCircle(p2, 0.03);
    rv += textStyle.getStart();
    rv += getText(p2.delta(0.2, 0), 'P2');
    rv += textStyle.getEnd();
    rv += s2.getEnd();

    return rv;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    delta(x, y) {
        return new Point(this.x + x, this.y + y);
    }
}

class Style {
    constructor(stroke, strokeWidth, fill) {
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.fill = fill;
    }
    setTextStyle(fontSize, fontFamily, textAnchor) {
        this.fontSize = fontSize;
        this.fontFamily = fontFamily; // 'sans-serif'
        this.textAnchor = textAnchor; // 'middle'
    }
    getStart() { return '<g ' + this.getProperties() + '>' }
    getEnd() { return '</g>' }
    getProperties() {
        var rv = '';
        if (this.stroke != null)
            rv += 'stroke="' + this.stroke + '" ';
        if (this.strokeWidth != null)
            rv += 'stroke-width="' + this.strokeWidth + '" ';
        if (this.fill != null)
            rv += 'fill="' + this.fill + '" ';
        if (this.fontSize != null)
            rv += 'font-size="' + this.fontSize + '" ';
        if (this.fontFamily != null)
            rv += 'font-family="' + this.fontFamily + '" ';
        if (this.textAnchor != null)
            rv += 'text-anchor="' + this.textAnchor + '" ';
        return rv;
    }
}

function getLine(p1, p2) {
    var rv = '';
    rv += '<path ';
    rv += 'd="M ' + p1.x + ' ' + p1.y + ' l ' + (p2.x - p1.x) + ' ' + (p2.y - p1.y) + '" ';
    rv += '/>';
    return rv;
}

function getCircle(c, r) {
    var rv = '';
    rv += '<circle ';
    rv += 'cx="' + c.x + '" cy="' + c.y + '" r="' + r + '" ';
    rv += '/>';
    return rv;
}

function getText(p0, text) {
    var rv = '';
    rv += '<text ';
    rv += 'x="' + p0.x + '" y="' + p0.y + '" ';
    rv += '>';
    rv += text;
    rv += '</text>';
    return rv;
}

