var cubeRotation = 0.0;
// will set to true when video can be copied to texture
var copyVideo = false;
const thang = {};

function main() {

  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
      gl_FragColor.a = 0.8;

    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexNormal, aTextureCoord,
  // and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  const texture = initTexture(gl);

  //const video = setupVideo("/static/media/vid/Clean Slate by Conspiracy (Revision Online 2021 PC 64K Intro Compo).mp4");
  //const video = setupVideo("/static/media/vid/VX2 by Spectrals (Revision Online 2020 PC Demo Compo).mp4");
  //const video = setupVideo("/static/media/vid/Rupture by ASD (FullHD 1080p demoscene demo 2009).mp4");
  //const video = setupVideo("/static/media/vid/Return by Rebels & Calodox (1st @ Evoke 2022 PC Demo Compo).mp4");
  const video = setupVideo("/static/media/vid/Crystal Skies - Nigel Stanford.mp4");
  //const video = setupVideo("/static/media/vid/Gorillaz - Feel Good Inc.mp4");
  //const video = setupVideo("/static/media/vid/isolated.mp4");

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    if (copyVideo) {
      updateTexture(gl, texture, video);
    }

    drawScene(gl, programInfo, buffers, texture, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function setupVideo(url) {
  const video = document.createElement("video");

  var playing = false;
  var timeupdate = false;

  video.playsInline = true;
  video.muted = false;
  video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener(
    "playing",
    function () {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    function () {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  return video;
}

function configureThang(o) {
    o.positions = [];
    o.vertexNormals = [];
    o.textureCoordinates = [];
    o.indices = [];
    o.faceCount = 0;
    for(x = -2;x <= 2;x++) {
        for(y = -2;y <= 2;y++) {
            pushCube(o, x * 1, y * 1, 0, 0.4);
            pushCube(o, x * 1, y * 1, 0, 0.4);
            pushCube(o, x * 1, y * 1, 0, 0.4);
        }
    }
}

function pushCube(o, cx, cy, cz, size) {

    // texture coordinates (same per face)
    const t = [[1.0, 0.0], [0.0, 0.0], [0.0, 1.0], [1.0, 1.0]];

    { // Front
        const v0 = [cx - size, cy - size, cz + size];
        const v1 = [cx + size, cy - size, cz + size];
        const v2 = [cx + size, cy + size, cz + size];
        const v3 = [cx - size, cy + size, cz + size];
        const v = [v0, v1, v2, v3];
        const n = [0.0, 0.0, 1.0];
        pushSquare(o, v, n, t);
    }

    { // Back
        const v0 = [cx - size, cy - size, cz - size];
        const v1 = [cx - size, cy + size, cz - size];
        const v2 = [cx + size, cy + size, cz - size];
        const v3 = [cx + size, cy - size, cz - size];
        const v = [v0, v1, v2, v3];
        const n = [0.0, 0.0, -1.0];
        pushSquare(o, v, n, t);
    }

    { // Top
        const v0 = [cx - size, cy + size, cz - size];
        const v1 = [cx - size, cy + size, cz + size];
        const v2 = [cx + size, cy + size, cz + size];
        const v3 = [cx + size, cy + size, cz - size];
        const v = [v0, v1, v2, v3];
        const n = [0.0, 1.0, 0.0];
        pushSquare(o, v, n, t);
    }

    { // Bottom
        const v0 = [cx - size, cy - size, cz - size];
        const v1 = [cx + size, cy - size, cz - size];
        const v2 = [cx + size, cy - size, cz + size];
        const v3 = [cx - size, cy - size, cz + size];
        const v = [v0, v1, v2, v3];
        const n = [0.0, -1.0, 0.0];
        pushSquare(o, v, n, t);
    }

    { // Right
        const v0 = [cx + size, cy - size, cz - size];
        const v1 = [cx + size, cy + size, cz - size];
        const v2 = [cx + size, cy + size, cz + size];
        const v3 = [cx + size, cy - size, cz + size];
        const v = [v0, v1, v2, v3];
        const n = [1.0, 0.0, 0.0];
        pushSquare(o, v, n, t);
    }

    { // Left
        const v0 = [cx - size, cy - size, cz - size];
        const v1 = [cx - size, cy - size, cz + size];
        const v2 = [cx - size, cy + size, cz + size];
        const v3 = [cx - size, cy + size, cz - size];
        const v = [v0, v1, v2, v3];
        const n = [-1.0, 0.0, 0.0];
        pushSquare(o, v, n, t);
    }
}

function pushSquare(
    o,     // thang
	v,     // positions
	n,     // normal
	t      // texture coordinate
) {
    var ip = o.positions.length / 3;
    pushVert2(o, v[0], n, t[0]);
    pushVert2(o, v[1], n, t[1]);
    pushVert2(o, v[2], n, t[2]);
    pushVert2(o, v[3], n, t[3]);
    o.indices.push(
        ip + 0, ip + 1, ip + 2,
        ip + 0, ip + 2, ip + 3,
    );
    o.faceCount += 2;
}

function pushVert2(
    o,      // thang
	v,      // position
	n,      // normal
	t       // texture coordinate
) {
	o.positions.push(v[0], v[1], v[2]);
	o.vertexNormals.push(n[0], n[1], n[2]);
	o.textureCoordinates.push(t[0], t[1]);
}

function initBuffers(gl) {

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  configureThang(thang);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thang.positions), gl.STATIC_DRAW);

  // Set up the normals for the vertices, so that we can compute lighting.
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(thang.vertexNormals),
    gl.STATIC_DRAW
  );

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(thang.textureCoordinates),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(thang.indices),
    gl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

function initTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video havs to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set  wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function drawScene(gl, programInfo, buffers, texture, deltaTime) {

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  gl.enable(gl.BLEND); // me being a bit naughty
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is the center of the scene.
  const modelViewMatrix = mat4.create();

  // move drawing position
  var distance = -6.5 + (1.5 * Math.sin(cubeRotation * 0.015));
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, distance]
  ); // amount to translate
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.045, // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around (Z)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.035, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (X)

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // position buffer => [vertexPosition]
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  // texture coordinate buffer => [textureCoord]
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }
  // normal buffer => [vertexNormal]
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  );

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = thang.faceCount * 3;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
