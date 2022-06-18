const Geo = Geometry;

class Thing extends Geo.SVG {

    constructor() {
        super();
        var o = this;

        o.axisStyle = new Geo.Style('grey', '0.03', 'grey');
        o.axisSize = 3;

        o.origin = new Geo.Point(0, 0);

        o.p1 = o.origin.delta(1.1, 1.2);
        o.s1 = new Geo.Style('green', '0.03', 'green');

        o.p2 = o.origin.delta(1.8, -0.9);
        o.s2 = new Geo.Style('blue', '0.03', 'blue');

        o.textStyle = new Geo.Style(null, '0.01');
        o.textStyle.setTextStyle(0.2, 'sans-serif', 'middle')

    }

    inner() {
        var o = this;
        var rv = super.inner();

        // x and y axes
        rv += o.axisStyle.start();
        rv += new Geo.Line(new Geo.Point(-o.axisSize, 0), new Geo.Point(o.axisSize, 0)).outer();
        rv += new Geo.Line(new Geo.Point(0, -o.axisSize), new Geo.Point(0, o.axisSize)).outer();
        for (let n = -3;n <= 3;n++) {
            var px = new Geo.Point(n, 0);
            var py = new Geo.Point(0, n);

            rv += new Geo.Circle(px, 0.03).outer();
            rv += new Geo.Circle(new Geo.Point(0, n), 0.03).outer();

            if (n != 0) {
                rv += o.textStyle.start();
                var pxd = px.delta(0, -0.1);
                rv += new Geo.Text(pxd, n).outer();
                var pyd = py.delta(0.17, 0.05);
                rv += new Geo.Text(pyd, n).outer();
                rv += o.textStyle.end();
            }

        }
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
        rv += new Geo.Line(o.origin, point).outer();
        rv += new Geo.Circle(point, 0.03).outer();
        rv += o.textStyle.start();
        rv += new Geo.Text(labelPosition, label).outer();
        rv += o.textStyle.end();
        rv += style.end();

        return rv;
    }

}
