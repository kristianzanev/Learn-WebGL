const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = [

    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
];

// const colorData = [
//     1, 0, 0,    // V1.color
//     0, 1, 0,    // V2.color
//     0, 0, 1,    // V3.color
// ];

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

// let colorData = [
//     ...randomColor(),
//     ...randomColor(),
//     ...randomColor(),
// ];

let colorData = [];
for (let face = 0; face < 6; face++) {
    // let faceColor = [face];
    for (let vertex = 0; vertex < 6; vertex++) {
        let altFace = face / 10;
        let altVert = vertex / 10;

        let faceColor = [altFace, altVert, 0]
        console.error(faceColor)
        colorData.push(...faceColor);
    }
}
let test = [...colorData]

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const matrix = mat4.create();

mat4.translate(matrix, matrix, [.2, .5, 0]);

mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

function animate() {
    requestAnimationFrame(animate);
    // mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
    // mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}
let prev = {
    x: 0,
    y: 0
}
let click;

canvas.addEventListener('mousedown', e => {
    click = true;
});

canvas.addEventListener('mouseup', e => {
    click = false;
});
canvas.addEventListener('mousemove', e => {
    if (!click) return
    const pos = {
        x: e.screenX - prev.x,
        y: e.screenY - prev.y
    }
    // const width = canvas.width / 2;
    // const height = canvas.height / 2
    // const coords = {
    //     x: e.screenX - width,
    //     y: e.screenY - height
    // } 
    // console.error(pos.x)
    mat4.rotateX(matrix, matrix, pos.x / 100)
    mat4.rotateY(matrix, matrix, pos.y / 100)
    prev.x = e.screenX
    prev.y = e.screenY

    // mat4.rotateZ(matrix, matrix, e.pos / 100000)

    // console.error(e)
    // if (isDrawing === true) {
    //   drawLine(context, x, y, e.offsetX, e.offsetY);
    //   x = e.offsetX;
    //   y = e.offsetY;
    // }
});

    mat4.rotateZ(matrix, matrix, 0);
    mat4.rotateX(matrix, matrix, 10);
    mat4.rotateY(matrix, matrix, 10);

    // gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    // gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

animate();
