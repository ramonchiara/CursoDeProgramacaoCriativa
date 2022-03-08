const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
    dimensions: [1080, 1080]
};

let img, manager;

let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const params = {
    glyph50: '',
    glyph100: '.',
    glyph150: '-',
    glyph200: '+'
};

const sketch = ({ context, width, height }) => {
    const cell = 6;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;

    typeCanvas.width = cols;
    typeCanvas.height = rows;

    return ({ context, width, height }) => {
        typeContext.fillStyle = 'black';
        typeContext.fillRect(0, 0, cols, rows);
        typeContext.drawImage(img, 0, 0, img.width, img.height);
        const typeData = typeContext.getImageData(0, 0, cols, rows).data;

        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        for (let i = 0; i < numCells; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = col * cell;
            const y = row * cell;

            const r = typeData[i * 4 + 0];
            const g = typeData[i * 4 + 1];
            const b = typeData[i * 4 + 2];
            const a = typeData[i * 4 + 3];

            const glyph = getGlyph(r);

            context.font = `${cell * 2}px ${fontFamily}`;
            if (Math.random() < 0.1)
                context.font = `${cell * 6}px ${fontFamily}`;

            context.fillStyle = `rgb(${r}, ${g}, ${b})`;

            context.save();
            context.translate(x, y);
            context.translate(cell * 0.5, cell * 0.5);
            context.fillText(glyph, 0, 0);
            context.restore();
    }
    };
};

const getGlyph = (v) => {
    if (v < 50)
        return params.glyph50;
    if (v < 100)
        return params.glyph100;
    if (v < 150)
        return params.glyph150;
    if (v < 200)
        return params.glyph200;

    const glyphs = '_= /'.split('');

    return random.pick(glyphs);
};

// const url = 'https://picsum.photos/200';
const url = 'https://i.picsum.photos/id/75/200/200.jpg?hmac=iXY_MolS8m8RDrh8BblWo-XCw9TRR_YvkeuRIko1Q1A';

const loadMeSomeImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
};

const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;

    folder = pane.addFolder({title: 'Glyphs '});
    folder.addInput(params, 'glyph50');
    folder.addInput(params, 'glyph100');
    folder.addInput(params, 'glyph150');
    folder.addInput(params, 'glyph200');

    pane.on('change', (ev) => { manager.render(); });
};

const start = async() => {
    img = await loadMeSomeImage(url);
    manager = await canvasSketch(sketch, settings);
};

createPane();
start();
