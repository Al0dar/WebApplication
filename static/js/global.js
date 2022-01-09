class CanvasLinePen {

    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.colour = '#00ff00';
        this.alpha = 'ff';
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
            return this.mimick.colour + this.mimick.alpha;
        else
            return this.colour + this.alpha;
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

}

class Imaginator {

    constructor(canvasId, filename, blobType, imageId) {
        this.canvas = document.getElementById(canvasId);
        this.filename = filename;
        this.blobType = blobType;
        this.ctx = this.canvas.getContext("2d");
        this.pen = new CanvasLinePen(this.ctx);
        this.pen.colour = '#000000';
        this.pen.width = 2;
        this.pen.alpha = '99';
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

    save(blobType) {
        let url = "/saveimage/" + this.filename;
        this.canvas.toBlob(
            //:
            function(blob) {
                $.ajax( {
                   url: url,
                   type: 'POST',
                   contentType: 'application/octet-stream',
                   data: blob,
                   processData: false
                } );
            }
            //:
            , this.blobType
        );
    }

}