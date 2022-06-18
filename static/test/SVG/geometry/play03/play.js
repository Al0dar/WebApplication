const Geo = Geometry;

function init() {
    var o = thing;
    o.points = {};
    o.points.A = new Geo.Point();
    o.points.A.style = new Geo.Style('green', '0.03', 'green');
    o.points.B = new Geo.Point();
    o.points.B.style = new Geo.Style('blue', '0.03', 'blue');
    o.points.C = new Geo.Point();
    o.points.C.style = new Geo.Style('red', '0.03', 'red');
}

function update() {
    var o = thing;
    var A = o.points.A;
    var B = o.points.B;
    var C = o.points.C;

    var angle = 0.02 * frame;
    A.set(1, 0.5);
    B.set(Math.sin(angle) * 2, Math.cos(angle));
    var res = A.add(B);
    C.set(res.x, res.y);

    setContent('svgPlaceholder1', o.outer());
    frame++;
}

class Thing extends Geo.SVG {

    constructor() {
        super();
        var o = this;
        o.axisStyle = new Geo.Style('grey', '0.03', 'grey');
        o.axisSize = 3;
        o.origin = new Geo.Point(0, 0);
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
        rv += o.fancyPoint(o.points.A, 'A');
        rv += o.fancyPoint(o.points.B, 'B');
        rv += o.fancyPoint(o.points.C, 'C');

        return rv;
    }

    fancyPoint(point, label) {
        var o = this;
        var rv = '';

        var labelOffset = 0.25;
        if (point.y < 0)
            labelOffset = -0.1;
        var labelPosition = point.delta(0, labelOffset);

        rv += point.style.start();
        rv += new Geo.Line(o.origin, point).outer();
        rv += new Geo.Circle(point, 0.03).outer();
        rv += o.textStyle.start();
        rv += new Geo.Text(labelPosition, label).outer();
        rv += o.textStyle.end();
        rv += point.style.end();

        return rv;
    }

}
