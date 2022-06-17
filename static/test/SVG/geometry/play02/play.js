function getContent() {
    return new Thing().outer();
}

class SVG {

    properties() {
        return '';
    }

    start() {
        if (this.tag != null)
            return '<' + this.tag + ' ' + this.properties() + '>'
    }

    end() {
        if (this.tag != null)
            return '</' + this.tag + '>'
    }

    outer() {
        return this.start() + this.inner() + this.end();
    }

    inner() {
        return '';
    }

}

class Line extends SVG {

    constructor(from, to) {
        super();
        var o = this;
        o.tag = 'path';
        o.from = from;
        o.to = to;
    }

    properties() {
        var o = this;
        var rv = super.properties();
        rv += 'd="M ' + o.from.x + ' ' + o.from.y + ' l ' + (o.to.x - o.from.x) + ' ' + (o.to.y - o.from.y) + '" ';
        return rv;
    }

}

class Circle extends SVG {

    constructor(centre, radius) {
        super();
        var o = this;
        o.tag = 'circle';
        o.centre = centre;
        o.radius = radius;
    }

    properties() {
        var o = this;
        var rv = super.properties();
        rv += 'cx="' + o.centre.x + '" cy="' + o.centre.y + '" r="' + o.radius + '" ';
        return rv;
    }

}

class Text extends SVG {

    constructor(position, value) {
        super();
        var o = this;
        o.tag = 'text';
        o.position = position;
        o.value = value;
    }

    properties() {
        var o = this;
        var rv = super.properties();
        rv += 'x="' + o.position.x + '" y="' + o.position.y + '" ';
        return rv;
    }

    inner() {
        return super.inner() + this.value;
    }

}

class Style extends SVG {

    constructor(stroke, strokeWidth, fill) {
        super();
        var o = this;
        o.tag = 'g';
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

    properties() {
        var o = this;
        var rv = super.properties();
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

    inner() {
        var o = this;
        var rv = super.inner();
        // x and y axes
        rv += o.axisStyle.start();
        rv += new Line(new Point(-o.axisSize, 0), new Point(o.axisSize, 0)).outer();
        rv += new Line(new Point(0, -o.axisSize), new Point(0, o.axisSize)).outer();
        rv += o.axisStyle.end();
        // fancy points
        rv += o.fancyPoint(o.p1, o.s1, 'P1', o.p1.delta(0.2, 0));
        rv += o.fancyPoint(o.p2, o.s2, 'P2', o.p2.delta(0.2, 0));
        return rv;
    }

    fancyPoint(point, style, label, labelPosition) {
        var o = this;
        var rv = '';
        rv += style.start();
        rv += new Line(o.origin, point).outer();
        rv += new Circle(point, 0.03).outer();
        rv += o.textStyle.start();
        rv += new Text(labelPosition, label).outer();
        rv += o.textStyle.end();
        rv += style.end();
        return rv;
    }

}
