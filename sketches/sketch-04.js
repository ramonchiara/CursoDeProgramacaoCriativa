const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1080, 1080],
    animate: true
};

const sketch = () => {
    return ({ context, width, height, frame }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        const cols = 10;
        const rows = 10;
        const numCells = cols * rows;

        const gridw = 0.8 * width;
        const gridh = 0.8 * height;
        const cellw = gridw / cols;
        const cellh = gridh / rows;
        const margx = (width - gridw) * 0.5;
        const margy = (height - gridh) * 0.5;

        for (let i = 0; i < numCells; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = col * cellw;
            const y = row * cellh;
            const w = 0.8 * cellw;
            const h = 0.8 * cellh;

            const n = random.noise2D(x + frame * 10, y, 0.001);
            const angle = 0.2 * n * Math.PI;
            // const scale = 30 * (n + 1) / 2;
            // const scale = 30 * (n * 0.5 + 0.5);
            const scale = math.mapRange(n, -1, 1, 1, 30);

            context.save();
            context.translate(x, y);
            context.translate(margx, margy);
            context.translate(cellw * 0.5, cellh * 0.5);
            context.rotate(angle);
            context.lineWidth = scale;
            context.beginPath();
            context.moveTo(w * -0.5, 0);
            context.lineTo(w * 0.5, 0);
            context.stroke();
            context.restore();
    }
    };
};

canvasSketch(sketch, settings);
