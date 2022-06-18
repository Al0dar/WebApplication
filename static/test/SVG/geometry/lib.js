const Geometry = {};

Geometry.SVG = class {

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

Geometry.Line = class extends Geometry.SVG {

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

Geometry.Circle = class extends Geometry.SVG {

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

Geometry.Text = class extends Geometry.SVG {

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

Geometry.Style = class extends Geometry.SVG {

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

Geometry.Point = class {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(p) {
        return new Geometry.Point(this.x + p.x, this.y + p.y);
    }

    delta(x, y) {
        return new Geometry.Point(this.x + x, this.y + y);
    }

}
