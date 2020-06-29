const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}



// // vertexData = [...]

// // create buffer
// // load vertexData into buffer

// // create vertex shader
// // create fragment shader
// // create program
// // attach shaders to program

// // enable vertex attributes

// // draw



const vertexData = [
    0, 1, 0, // x, y, z | their values can be: -1 is for being to the most left of the of screen, 0 is in middle, 1 is at the right
    1, -1, 0,
    -1, -1, 0,
];

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW) // static_draw is for drawing once, for more use dynamic_draw;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);
// for gl_FragColor all values are r, g, b, a

gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

/// vertex attributes are disabled by default so the next lines are enabling them 

//getting the index of position vec
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);

// telling webgl how to retrieve attrib data from buffer
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);