let params = {
    pixelSize:  10,
    background: [0, 0, 0],
    colour: [255, 255, 255],
    characters: ' .:-=+*#%@',
    textSize: 14,
    textStyle: 'NORMAL'
}

let capture;
let capturing = true;
let canvasWidth;
let canvasHeight;

function preload(){
    capture = createCapture(VIDEO, () => {
        capturing = true;
    })
    capture.size(640, 480);
    capture.hide();
}

function setup() {
    canvasWidth = 640;
    canvasHeight = 480;
    let asciiCanvas = createCanvas(canvasWidth, canvasHeight);
    asciiCanvas.parent("ascii");
    asciiCanvas.id("asciiCanvas");

}

function draw() {
    background(params.background);

    textSize(params.textSize);
    fill(params.colour);

    if (params.textStyle === 'NORMAL') textStyle(NORMAL);
    else if (params.textStyle === 'ITALIC') textStyle(ITALIC);
    else textStyle(BOLD);

    const characters = params.characters.split('');

    if (capturing) {
        capture.loadPixels();

        if (capture.pixels) {
            for (y = 0; y < capture.height; y+=params.pixelSize) {
                for (x = 0; x < capture.width; x+=params.pixelSize) {
                    // *4 is for each rgba value
                    const index = (x + y * capture.width) * 4

                    const r = capture.pixels[index];
                    const g = capture.pixels[index + 1];
                    const b = capture.pixels[index + 2];

                    const bright = Math.round((r + g + b) / 3);
                    const letter = characters[Math.round(map(bright, 0, 255, characters.length - 1, 0))];

                    text(letter, x, y);
                }
            }
        }
    }
}

function windowResized() {
    resizeCanvas(640, 480)
    // resizeCanvas(windowWidth / 1.5, windowHeight / 1.5)
    capture = createCapture(VIDEO, () => {
        capturing = true
    })
    // capture.size(windowWidth / 1.5, windowHeight / 1.5)
    capture.size(640, 480)
    capture.hide()
}
