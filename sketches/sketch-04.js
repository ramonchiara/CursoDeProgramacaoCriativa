const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
    dimensions: [1080, 1080],
    animate: true
};

const params = {
    cols: 10,
    rows: 10,
    scaleMin: 1,
    scaleMax: 30,
    freq: 0.001,
    amp: 0.2,
    frame: 0,
    animate: true,
    lineCap: 'butt',
    bgColor: 'rgb(255, 127, 0)',
    gridColor: 'rgb(255, 255, 0)',
};

const sketch = () => {
    return ({ context, width, height, frame }) => {
        context.fillStyle = params.bgColor; // 'white';
        context.fillRect(0, 0, width, height);

        const cols = params.cols;
        const rows = params.rows;
        const numCells = cols * rows;

        const gridw = 0.8 * width;
        const gridh = 0.8 * height;
        const cellw = gridw / cols;
        const cellh = gridh / rows;
        const margx = (width - gridw) * 0.5;
        const margy = (height - gridh) * 0.5;

        context.strokeStyle = params.gridColor;
        for (let i = 0; i < numCells; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = col * cellw;
            const y = row * cellh;
            const w = 0.8 * cellw;
            const h = 0.8 * cellh;

            const f = params.animate ? frame : params.frame;
            // const n = random.noise2D(x + frame * 10, y, params.freq);
            const n = random.noise3D(x, y, f * 10, params.freq);

            const angle = params.amp * n * Math.PI;
            // const scale = 30 * (n + 1) / 2;
            // const scale = 30 * (n * 0.5 + 0.5);
            const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

            context.save();
            context.translate(x, y);
            context.translate(margx, margy);
            context.translate(cellw * 0.5, cellh * 0.5);
            context.rotate(angle);
            context.lineWidth = scale;
            context.lineCap = params.lineCap;
            context.beginPath();
            context.moveTo(w * -0.5, 0);
            context.lineTo(w * 0.5, 0);
            context.stroke();
            context.restore();
    }
    };
};

const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;

    folder = pane.addFolder({title: 'Grid '});
    folder.addInput(params, 'lineCap', {options: {butt: 'butt', round: 'round', square: 'square'}});
    folder.addInput(params, 'cols', {min: 2, max: 50, step: 1});
    folder.addInput(params, 'rows', {min: 2, max: 50, step: 1});
    folder.addInput(params, 'scaleMin', {min: 1, max: 100});
    folder.addInput(params, 'scaleMax', {min: 1, max: 100});

    folder = pane.addFolder({title: 'Noise '});
    folder.addInput(params, 'freq', {min: -0.01, max: 0.01});
    folder.addInput(params, 'amp', {min: 0, max: 1});

    folder.addInput(params, 'animate');
    folder.addInput(params, 'frame', {min: 0, max: 999});

    folder = pane.addFolder({title: 'Colors '});
    folder.addInput(params, 'bgColor');
    folder.addInput(params, 'gridColor');
};

createPane();
canvasSketch(sketch, settings);
