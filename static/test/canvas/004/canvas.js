

function onPageLoading() {

    var canvas = getElement("canvas1");
    var ctx = canvas.getContext("2d");

    ctx.save();

    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,500,500);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(250, 0, 250, 250);

    var grd = ctx.createLinearGradient(0, 0, 500, 500);
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 500, 500);

    ctx.restore();

}

function onPageLoaded() {

    var canvas = getElement("canvas1");
    var ctx = canvas.getContext("2d");

    // draw image1 onto the canvas
    var img = getElement("image1");
    ctx.drawImage(img, -0, 0);

    var dict = {};

//    dict["000000"] = "black";
//    dict["888888"] = "grey";
//    dict["ffffff"] = "white";
//    var x1 = dict["888888"];
//    for (const [key, value] of Object.entries(dict)) {
//        var x = key;
//        var y = value;
//    }
//    var foo1 = dict["notakey"];
//    var flag1 = (dict["notakey"] == undefined);
//    var flag2 = (dict["000000"] == undefined);

    // mess around with raw RGBA data
    var image = ctx.getImageData(0, 0, 200, 340);
    var imageData = image.data,
    length = imageData.length;
    var scale = 1.2;
    for(var i = 0; i < length; i += 4){

        // input colour RGBA
        var inR = imageData[i + 0];
        var inG = imageData[i + 1];
        var inB = imageData[i + 2];
        var inA = imageData[i + 3];

        // convert to hex values
        var hexR = inR.toString(16);
        var hexG = inG.toString(16);
        var hexB = inB.toString(16);

        // combine RGB hex as hexKey
        var hexKey = hexR + hexG + hexB;

        // create or increment dictionary count, where key is hexKey
        if(dict[hexKey] == undefined)
            dict[hexKey] = 1;       // create, starting at 1
        else
            dict[hexKey] += 1;      // increment

        // examples of converting from hex back to integer
        var valR = parseInt(hexR, 16);
        var valG = parseInt(hexG, 16);
        var valB = parseInt(hexB, 16);

        // var distanceR = Math.abs(100 - inR);

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
    var sortedDict = {};
    var sizeN = 200;
    for (var n = 0; n < sizeN; n++) {
        var highKey = "";
        var highValue = 0;
        for (const [key, value] of Object.entries(dict)) {
            if (highValue < value) {
                highKey = key;
                highValue = value;
                dict[key] = 0;
            }
        }
        sortedDict[n] = { hex : highKey, n : highValue };
    }

    var s = "";
    for (var n = 0; n < sizeN; n++) {
        var kv = sortedDict[n];
        s += "<span style='background-color: #" + kv.hex + ";'>";
        s += kv.hex + " =&gt; " + kv.n + " <br/>";
        s += "</span>";
    }
    setContent("colours", s);

    image.data = imageData;
    ctx.putImageData(image, 200, 50);

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

