const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1080, 1080],
    animate: true
};

const minA = 0.25;
const maxA = 1.75;
const t = 100;
let up = true;

const sketch = () => {
    return ({ context, width, height, frame }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'black';

        const cx = width;
        const cy = 0;

        const w = width * 0.01;
        const h = height * 0.1;

        const num = 100;
        const f = frame % t;
        const a = math.mapRange(f, 0, t - 1, (up ? minA : maxA), (up ? maxA : minA));
        const radius = a * 0.7 * width;

        let x, y;

        for (let i = 0; i < num; i++) {
            const slice = math.degToRad(360 / num);
            const angle = slice * i;

            x = cx + radius * Math.sin(angle);
            y = cy + radius * Math.cos(angle);

            context.save();
            context.translate(x, y);
            context.rotate(-angle);
            context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

            context.beginPath();
            context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
            context.fill();
            context.restore();

            context.save();
            context.translate(cx, cy);
            context.rotate(-angle);

            context.lineWidth = random.range(5, 20);

            context.beginPath();
            context.arc(0, 0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5));
            context.stroke();
            context.restore();
        }

        if (f === t - 1)
            up = !up;
    };
};

canvasSketch(sketch, settings);
