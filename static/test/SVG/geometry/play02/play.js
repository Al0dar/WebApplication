function getContent() {
    var thing = new Thing();
    return thing.content();
}

class SVG {

    line(from, to) {
        var rv = '';
        rv += '<path ';
        rv += 'd="M ' + from.x + ' ' + from.y + ' l ' + (to.x - from.x) + ' ' + (to.y - from.y) + '" ';
        rv += '/>';
        return rv;
    }

    circle(centre, radius) {
        var rv = '';
        rv += '<circle ';
        rv += 'cx="' + centre.x + '" cy="' + centre.y + '" r="' + radius + '" ';
        rv += '/>';
        return rv;
    }

    text(position, value) {
        var rv = '';
        rv += '<text ';
        rv += 'x="' + position.x + '" y="' + position.y + '" ';
        rv += '>';
        rv += value;
        rv += '</text>';
        return rv;
    }

}

class Thing extends SVG {

    constructor() {
        super();
        var o = this;
        o.axisStyle = new Style('grey', '0.03');
        o.axisSize = 3;
        o.origin = new Point(0, 0);
        o.p1 = o.origin.delta(2.1, 1.2);
        o.s1 = new Style('green', '0.03', 'grey');
        o.p2 = o.origin.delta(1.8, -0.9);
        o.s2 = new Style('red', '0.03', 'red');
        o.textStyle = new Style(null, '0.01');
        o.textStyle.setTextStyle(0.2, 'sans-serif', 'middle')
    }

    content() {
        var o = this;
        var rv = '';
        rv += o.axisStyle.start();
        rv += o.line(new Point(-o.axisSize, 0), new Point(o.axisSize, 0));
        rv += o.line(new Point(0, -o.axisSize), new Point(0, o.axisSize));
        rv += o.axisStyle.end();
        rv += o.fancyPoint(o.p1, o.s1, 'P1', o.p1.delta(0.2, 0));
        rv += o.fancyPoint(o.p2, o.s2, 'P2', o.p2.delta(0.2, 0));
        return rv;
    }

    fancyPoint(point, style, label, labelPosition) {
        var o = this;
        var rv = '';
        rv += style.start();
        rv += o.line(o.origin, point);
        rv += o.circle(point, 0.03);
        rv += o.textStyle.start();
        rv += o.text(labelPosition, label);
        rv += o.textStyle.end();
        rv += style.end();
        return rv;
    }

}

class Style {

    constructor(stroke, strokeWidth, fill) {
        var o = this;
        o.stroke = stroke;
        o.strokeWidth = strokeWidth;
        o.fill = fill;
    }

    setTextStyle(fontSize, fontFamily, textAnchor) {
        var o = this;
        o.fontSize = fontSize;
        o.fontFamily = fontFamily; // 'sans-serif'
        o.textAnchor = textAnchor; // 'middle'
    }

    start() { return '<g ' + this.properties() + '>' }

    end() { return '</g>' }

    properties() {
        var o = this;
        var rv = '';
        if (o.stroke != null)
            rv += 'stroke="' + o.stroke + '" ';
        if (o.strokeWidth != null)
            rv += 'stroke-width="' + o.strokeWidth + '" ';
        if (o.fill != null)
            rv += 'fill="' + o.fill + '" ';
        if (o.fontSize != null)
            rv += 'font-size="' + o.fontSize + '" ';
        if (o.fontFamily != null)
            rv += 'font-family="' + o.fontFamily + '" ';
        if (o.textAnchor != null)
            rv += 'text-anchor="' + o.textAnchor + '" ';
        return rv;
    }

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
