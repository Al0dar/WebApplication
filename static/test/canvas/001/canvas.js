function onPageLoading() {

    var canvas = getElement("canvas1");
    var ctx = canvas.getContext("2d");

    ctx.save();

    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(0,0,250,250);
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(250, 0, 250, 250);

    var grd = ctx.createLinearGradient(0, 250, 250, 250);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 250, 250, 250);

    var grd2 = ctx.createRadialGradient(250, 250, 50, 250, 250, 200);
    grd2.addColorStop(0, "red");
    grd2.addColorStop(1, "white");
    ctx.fillStyle = grd2;
    ctx.fillRect(250, 250, 250, 250);

    ctx.restore();

    ctx.moveTo(0, 0);
    ctx.lineTo(125, 125);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(125, 125, 40, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.fillText("Hello World", 260, 280);
    ctx.strokeText("Stroke Text", 260, 30);

}

function onPageLoaded() {

    var canvas = getElement("canvas1");
    var ctx = canvas.getContext("2d");

    // draw image1 onto the canvas
    var img = getElement("image1");
    ctx.drawImage(img, 50, 310);

    // mess around with raw RGBA data
    var image = ctx.getImageData(260, 310, 100, 100);
    var imageData = image.data,
    length = imageData.length;
    for(var i = 3; i < length; i += 4){
        if(imageData[i - 2] > 2)
            imageData[i] = 50;
    }
    image.data = imageData;
    ctx.putImageData(image, 260, 310);

    // post the canvas as an image file (raw data blob)
    postCanvas(canvas);

}

function postCanvas(canvas) {

    canvas.toBlob(postBlob, 'image/png');

}

function postBlob(blob) {



    $.ajax( {
       url: '/static/test/canvas/001/output.png',
       type: 'POST',
       contentType: 'application/octet-stream',
       data: blob,
       processData: false
    } );

}

