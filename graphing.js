let dx = 10.1;
let dy = 10.1;
let colorMode = false;
const vertexShaderText =
    `precision mediump float;
        
        attribute vec2 vertPosition;
        attribute vec3 vertColor;
        varying vec3 fragColor;
        void main()
        {
          fragColor = vertColor;
          gl_Position = vec4(vertPosition, 0.0, 1);
        }`;

const fragmentShaderText = () =>
    `precision mediump float;
        varying vec3 fragColor;      
        void main()
        {
            float dx = (${dx});
            float dy = (${dy});
            float x = ((gl_FragCoord[0] /  float(${window.innerWidth})) - 0.5)*dx;
            float y =  ((gl_FragCoord[1]  / float(${window.innerHeight})) - 0.5)*dy;
            float zx = 0.0;
            float zy = 0.0;
            float temp_x = zx;
            float temp_y=zy;
            for(int i =0;i<1000;i++){
                temp_x = zx;
                temp_y = zy;
                zx = temp_x*temp_x - temp_y*temp_y + x;
                zy = 2.0*temp_x*temp_y + y;
            };
            gl_FragColor = vec4( 100.0*zx,100.0*zy, 150.0*zx*zy, 1);
            // if(inMandlebrot(x,y)){
            //     gl_FragColor = vec4(0.0 ,0.0, 0.0, 1);
            // }else{
            //     gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
            // }
        }`;

var InitDemo = function () {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Your browser does not support WebGL');
    }
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText());
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
window.onload = () => {
    render()
    // document.getElementById("input").oninput = (e) => {
    //     render()
    // }
}
const render = () => {
    InitDemo()//document.getElementById("input").value.replace(/=/g, "-"))
}
const zoomIn = () => {
    dx *= 0.9
    dy *= 0.9
    render()
}
const zoomOut = () => {
    dx *= 1.1;
    dy *= 1.1;
    render()
}
const colorToggle = () => {
    colorMode = !colorMode
    render();
}