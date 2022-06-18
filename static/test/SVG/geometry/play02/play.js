class Thing extends Geometry.SVG {

    constructor() {
        super();
        var o = this;

        o.axisStyle = new Geometry.Style('grey', '0.03');
        o.axisSize = 3;

        o.origin = new Geometry.Point(0, 0);

        o.p1 = o.origin.delta(1.1, 1.2);
        o.s1 = new Geometry.Style('green', '0.03', 'green');

        o.p2 = o.origin.delta(1.8, -0.9);
        o.s2 = new Geometry.Style('blue', '0.03', 'blue');

        o.textStyle = new Geometry.Style(null, '0.01');
        o.textStyle.setTextStyle(0.2, 'sans-serif', 'middle')

    }

    inner() {
        var o = this;
        var rv = super.inner();

        // x and y axes
        rv += o.axisStyle.start();
        rv += new Geometry.Line(new Geometry.Point(-o.axisSize, 0), new Geometry.Point(o.axisSize, 0)).outer();
        rv += new Geometry.Line(new Geometry.Point(0, -o.axisSize), new Geometry.Point(0, o.axisSize)).outer();
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
        rv += new Geometry.Line(o.origin, point).outer();
        rv += new Geometry.Circle(point, 0.03).outer();

        rv += o.textStyle.start();
        rv += new Geometry.Text(labelPosition, label).outer();
        rv += o.textStyle.end();

        rv += style.end();

        return rv;
    }

}
