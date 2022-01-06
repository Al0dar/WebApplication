class CanvasLinePen {

    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.strokeStyle = 'green';
        this.lineWidth = 3;
        this.active = false;
    }

    start(x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
    }

    drawTo(toX, toY) {
        if (this.active === true) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(toX, toY);
            this.ctx.stroke();
            this.ctx.closePath();
            this.x = toX;
            this.y = toY;
        }
    }

    stop() {
        this.active = false;
    }

}

class Imaginator {

    constructor(canvas, url, blobType) {
        this.canvas = canvas;
        this.url = url;
        this.blobType = blobType;
    }

    post(blobType) {
        let url = this.url;
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