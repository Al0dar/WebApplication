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
    ctx.drawImage(img, -200, 0);

    // mess around with raw RGBA data
    var image = ctx.getImageData(50, 50, 400, 300);
    var imageData = image.data,
    length = imageData.length;
    var scale = 1;
    for(var i = 0; i < length; i += 4){

        // input colour RGBA
        var inR = imageData[i + 0];
        var inG = imageData[i + 1];
        var inB = imageData[i + 2];
        var inA = imageData[i + 3];

        var distanceR = Math.abs(100 - inR);

        var outR = inR * scale;
        var outG = inG * scale;
        var outB = inB * scale;
        var outA = inA;

        // clamp to allowed range 0 to 255 (1 byte)
        if (outR < 0) outR = 0;
        else if (outR > 255) outR = 255;
        if (outG < 0) outG = 0;
        else if (outG > 255) outG = 255;
        if (outB < 0) outB = 0;
        else if (outB > 255) outB = 255;
        if (outA < 0) outA = 0;
        else if (outA > 255) outA = 255;

        imageData[i + 0] = outR;
        imageData[i + 1] = outG;
        imageData[i + 2] = outB;
        imageData[i + 3] = outA;

    }
    image.data = imageData;
    ctx.putImageData(image, 50, 50);

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

