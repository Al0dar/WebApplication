// global.js version 1.0.0.02b

function setContent(elementId, content) {
    el = getElement(elementId);
    el.innerHTML = content;
}

function getElement(elementId) {
    return document.getElementById(elementId);
}

class CanvasLinePen {

    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.colour = '#00ff00';
        this.pressure = 'ff';
        this.width = 3;
        this.active = false;
    }

    start(x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
    }

    getStrokeStyle() {
        if (this.mimick)
            return this.mimick.colour + this.mimick.pressure;
        else
            return this.colour + this.pressure;
    }

    getLineWidth() {
        if (this.mimick)
            return this.mimick.width;
        else
            return this.width;
    }

    drawTo(toX, toY) {
        if (this.active === true) {
            var c = this.ctx;
            // begin path
            c.beginPath();
            // set drawing properties
            c.strokeStyle = this.getStrokeStyle();
            c.lineWidth = this.getLineWidth();
            // draw line
            c.moveTo(this.x, this.y);
            c.lineTo(toX, toY);
            c.stroke();
            // end path
            c.closePath();
            // change focal point to destination point
            this.x = toX;
            this.y = toY;
        }
    }

    stop() {
        this.active = false;
    }

    exampleDashArray(x, y, x2, y2, dashArray) {
        var c = this.ctx;
        if (!dashArray) dashArray=[10,5];
        if (dashLength == 0) dashLength = 0.001;
        var dashCount = dashArray.length;
        c.moveTo(x, y);
        var dx = (x2-x), dy = (y2-y);
        var slope = dx ? dy / dx : 1e15;
        var distRemaining = Math.sqrt( (dx * dx) + (dy * dy) );
        var dashIndex = 0, draw = true;
        while (distRemaining >= 0.1) {
            var dashLength = dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining) dashLength = distRemaining;
            var xStep = Math.sqrt(dashLength*dashLength / (1 + slope*slope));
            if (dx<0) xStep = -xStep;
            x += xStep
            y += slope * xStep;
            c[draw ? 'lineTo' : 'moveTo'](x,y);
            distRemaining -= dashLength;
            draw = !draw;
        }
    }
}

class Imaginator {

    constructor(canvasId, filename, blobType, imageId) {
        this.canvas = getElement(canvasId);
        this.filename = filename;
        this.blobType = blobType;
        this.ctx = this.canvas.getContext("2d");
        this.pen = new CanvasLinePen(this.ctx);
        this.pen.colour = '#000000';
        this.pen.width = 2;
        this.pen.pressure = '99';
        this.canvas.addEventListener('mousedown', e => {
            this.pen.start(e.offsetX, e.offsetY);
        });
        this.canvas.addEventListener('mousemove', e => {
            this.pen.drawTo(e.offsetX, e.offsetY);
        });
        this.canvas.addEventListener('mouseup', e => {
            this.pen.stop();
        });
    }

    clear() {
        this.ctx.fillStyle = this.pen.getStrokeStyle();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    copyFrom(si) {
        var img = si.ctx.getImageData(0, 0, si.canvas.width, si.canvas.height);
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.putImageData(img, 0, 0);
    }

    load() {
        var img = new Image();
        img.src = '/static/' + this.filename;
        var me = this;
        img.onload = function() {
            me.canvas.width = img.width;
            me.canvas.height = img.height;
            me.ctx.drawImage(img, 0, 0);
        }
    }

    loadTile() {
        var img = new Image();
        img.src = '/static/' + this.filename;
        var me = this;
        img.onload = function() {
            var ptrn = me.ctx.createPattern(img, 'repeat');
            me.ctx.fillStyle = ptrn;
            me.ctx.fillRect(0, 0, me.canvas.width, me.canvas.width);
        }
    }

    save() {
        let url = "/static/" + this.filename;
        var self = this;
        this.canvas.toBlob(
            function(blob) {
                $.ajax( {
                   url: url,
                   type: 'POST',
                   contentType: 'application/octet-stream',
                   data: blob,
                   processData: false,
                   success: self.handleSaveSuccess
                } );
            }
        );
    }

    handleSaveSuccess(data) {
        alert("save : " + data);
    }

    //--------

    testDrawing() {
        var pen = this.pen;
        pen.start(5, 5);
        pen.drawTo(50, 50);
        pen.stop();
    }

    drawSVG(id) {
        var svg = getElement(id);
        var img = new Image();
        var xml = new XMLSerializer().serializeToString(svg);
        var svg64 = btoa(xml);
        var b64Start = 'data:image/svg+xml;base64,';
        var image64 = b64Start + svg64;
        var me = this;
        img.onload = function() {
            me.ctx.drawImage(img, 0, 0);
        }
        img.src = image64;
    }

}
