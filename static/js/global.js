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

    drawTo(toX, toY) {
        if (this.active === true) {

            // begin path
            this.ctx.beginPath();

            // set the context's drawing pen properties
            if (this.mimick) {
                this.ctx.strokeStyle = this.mimick.colour + this.mimick.alpha;
                this.ctx.lineWidth = this.mimick.width;
            } else {
                this.ctx.strokeStyle = this.colour + this.alpha;
                this.ctx.lineWidth = this.width;
            }

            // draw a line
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(toX, toY);
            this.ctx.stroke();

            // end path
            this.ctx.closePath();

            // change focal (start) point to destination point
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
        this.image = document.getElementById(imageId);
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

    loadFromImage() {
        this.ctx.drawImage(this.image, 0, 0);
    }

    clear() {
        this.ctx.fillStyle = this.pen.colour + this.pen.alpha;
        this.ctx.fillRect(0, 0, 500, 500);
    }

    post(blobType) {
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