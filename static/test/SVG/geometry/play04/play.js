const Geo = Geometry;

function start() {
    thing = new Thing();
    frame = 0;
    window.setInterval(update, 20);
}

function update() {
    var A = thing.points.A;
    var angle = 0.02 * frame;
    A.set(Math.sin(angle) * 2, -Math.cos(angle));
    setContent('svgPlaceholder1', thing.outer());
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

        o.points = {};
        o.points.A = new Geo.Point();
        o.points.A.style = new Geo.Style('red', '0.03', 'red');

        // house
        o.houseStyle = new Geo.Style('green', '0.03', 'green');
        o.houseCopyStyle = new Geo.Style('blue', '0.03', 'blue');
        var p0 = new Geo.Point(-1, 1); // clockwise from bottom left
        var p1 = new Geo.Point(-1, -1);
        var p2 = new Geo.Point(0, -2);
        var p3 = new Geo.Point(1, -1);
        var p4 = new Geo.Point(1, 1);
        o.house = [p0, p1, p2, p3, p4];

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

        // house
        rv += o.houseStyle.start();
        for (var i = 0; i < o.house.length; i++) {
            var i2 = i + 1;
            if (i2 > 4) i2 = 0;
            var p = o.house[i];
            var p2 = o.house[i2];
            //
            rv += new Geo.Circle(p, 0.03).outer();
            rv += new Geo.Line(p, p2).outer();
        }
        rv += o.houseStyle.end();

        // house (transformed)
        rv += o.houseCopyStyle.start();
        for (var i = 0; i < o.house.length; i++) {
            var i2 = i + 1;
            if (i2 > 4) i2 = 0;
            var p = o.house[i];
            var p2 = o.house[i2];
            //
            var pt = p.muli(o.points.A);
            var pt2 = p2.muli(o.points.A);
            //
            rv += new Geo.Circle(pt, 0.03).outer();
            rv += new Geo.Line(pt, pt2).outer();
        }
        rv += o.houseCopyStyle.end();

        // fancy points
        rv += o.fancyPoint(o.points.A, 'A');

        return rv;
    }

    fancyPoint(point, label) {
        var o = this;
        var rv = '';

        var labelOffsetY = 0.25;
        if (point.y < 0)
            labelOffsetY = -0.1;
        var labelPosition = point.delta(0, labelOffsetY);

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
