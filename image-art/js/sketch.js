let video;

let detector;
let detections = [];
let idCount = 0;

let textNbPerson;
let nbPerson = 0;

let textNbPhone;
let nbPhone = 0;

let textNbCup;
let nbCup = 0;

let title;
let effect = 0;

let size = 50;
let cell_width, cell_height;
let nbPixels = 0;

let params = {
    pixelSize:  15,
    background: [10, 10, 10],
    color: [255, 255, 255],
    characters: ' .:-=+*#%@',
    textSize: 12,
    textStyle: 'NORMAL'
}

let images = [
    'bg_pixels.jpg',
    'bg_computer.jpg',
    'bg_ai.jpg',
]

function preload(){
    video = createCapture(VIDEO);
    video.size(1280,720);
    video.hide();
    detector = ml5.objectDetector('cocossd');
}

function setup(){
    title = createElement("h1", "Vous êtes pixelisés!");
    title.parent("title");

    let canvas = createCanvas(400, 400);
    canvas.parent("sketch");
    background(0);

    setInterval(changeSize, 1000);
    setInterval(changeCanvas, 15000);

    detector.detect(video, gotDetections);
}

function draw(){
    clear();
    if(video.width !== width || video.height !== height) {
        resizeCanvas(video.width, video.height);
    }
    cell_width = Math.round(width/size);
    cell_height = Math.round(height/size);

    if(effect === 0){
        pixelate(video);
        updateText();
    } else if(effect === 1) {
        ascii(video);
    } else {
        drawObjects();
        drawVideo(video);
        drawDebug();
        showNumbers();
    }
}

function changeSize(){
    size = random(10,200);
}

function changeCanvas(){
    effect++;
    if(effect > 2){
        effect = 0;
    }
    $.backstretch("img/"+images[effect], {speed: 500});
}


function pixelate(img){
    title.html("Vous êtes pixelisés!");

    loadPixels();
    img.loadPixels();

    var size;
    var r = 0;
    var g = 0;
    var b = 0;
    for(var x = 0; x < width; x=x+cell_width) {
        for (var y = 0; y < height; y = y + cell_height) {
            size = 1;
            for (var n = x; n < x + cell_width; n++) {
                for (var m = y; m < y + cell_height; m++) {
                    var loc = (n + m * width) * 4;
                    if(img.pixels[loc] > 0) {
                        r += img.pixels[loc];
                        g += img.pixels[loc + 1];
                        b += img.pixels[loc + 2];
                        size++;
                    }
                }
            }
            r = Math.round(r / size);
            g = Math.round(g / size);
            b = Math.round(b / size);

            for (var n = x; n < x + cell_width; n++) {
                for (var m = y; m < y + cell_height; m++) {
                    var loc = (n + m * width) * 4;
                    pixels[loc] = r;
                    pixels[loc + 1] = g;
                    pixels[loc + 2] = b;
                    pixels[loc + 3] = 255;
                }
            }
        }
    }
    nbPixels = Math.round(width/cell_width)*Math.round(height/cell_height);
    updatePixels();
}

function ascii(img){
    title.html("Vous êtes l'ordinateur!");

    if (params.textStyle === 'NORMAL') textStyle(NORMAL);
    else if (params.textStyle === 'ITALIC') textStyle(ITALIC);
    else textStyle(BOLD);

    const characters = params.characters.split('');

    img.loadPixels();

    background(params.background);
    textSize(params.textSize);
    fill(params.color);
    if (img.pixels) {
        for (y = 0; y < img.height; y+=params.pixelSize) {
            for (x = 0; x < img.width; x+=params.pixelSize) {
                // *4 is for each rgba value
                const index = (x + y * img.width) * 4

                const r = img.pixels[index];
                const g = img.pixels[index + 1];
                const b = img.pixels[index + 2];

                const bright = Math.round((r + g + b) / 3);
                const letter = characters[Math.round(map(bright, 0, 255, characters.length - 1, 0))];

                text(letter, x, y);
            }
        }
    }
}

function updateText(){
    push();
    stroke(0);
    fill(255);
    textAlign(RIGHT);
    text(nbPixels+"px", width-20, 20);
    pop();
}

function gotDetections(error, results) {
    if (error) {
        console.error(error);
    }
    nbPerson = 0;
    nbPhone = 0;
    nbCup = 0;


    let labels = Object.keys(detections);
    for (let label of labels) {
        let objects = detections[label];
        for (let object of objects) {
            object.taken = false;
        }
    }

    for (let i = 0; i < results.length; i++) {
        let object = results[i];
        var randomColors = [random(255), random(255), random(255)];
        let highestValue = randomColors.indexOf(Math.max(...randomColors));

        for(var n = 0; n < randomColors.length; n++){
            if(n === highestValue){
                randomColors[n] = 255;
            } else {
                randomColors[n] = 0;
            }
        }

        object.color = color(randomColors[0], randomColors[1], randomColors[2], 80);
        let label = object.label;

        if (label === "person"){
            nbPerson++;
        } else if(label === "cell phone"){
            nbPhone++;
        } else if(label === "cup"){
            nbCup++;
        }

        if (detections[label]) {
            let existing = detections[label];
            if (existing.length === 0) {
                object.id = idCount;
                idCount++;
                existing.push(object);
                object.timer = 50;
            } else {
                // Find the object closest?
                let recordDist = Infinity;
                let closest = null;
                for (let candidate of existing) {
                    let d = dist(candidate.x, candidate.y, object.x, object.y);
                    if (d < recordDist && !candidate.taken) {
                        recordDist = d;
                        closest = candidate;
                    }
                }
                if (closest) {
                    let amt = 0.7; //0.75;
                    closest.x = lerp(object.x, closest.x, amt);
                    closest.y = lerp(object.y, closest.y, amt);
                    closest.width = lerp(object.width, closest.width, amt);
                    closest.height = lerp(object.height, closest.height, amt);
                    closest.taken = true;
                    closest.timer = 50;
                } else {
                    object.id = idCount;
                    idCount++;
                    existing.push(object);
                    object.timer = 50;
                }
            }
        } else {
            object.id = idCount;
            idCount++;
            detections[label] = [object];
            object.timer = 50;
        }
    }
    detector.detect(video, gotDetections);
}

function drawObjects(){
    push();
    title.html("Vous controllez les figures!");

    let labels = Object.keys(detections);
    for (let label of labels) {
        let objects = detections[label];
        for (let i = objects.length - 1; i >= 0; i--) {
            let object = objects[i];
            noStroke();
            fill(object.color);
            var x = map(object.x+(object.width/2), 0, width, width, 0);
            blendMode(ADD);
            if(object.label === "cell phone") {
                rect(x, object.y, object.width/2, object.height/2);
            } else if(object.label === "person"){
                ellipseMode(CORNER);
                ellipse(x, object.y, object.width/4, object.height/2);
                ellipse(x, object.y, object.width/4, object.height/2);
            } else if(object.label === "cup"){
                rect(x, object.y, object.width/2, object.height/2);
            }
            object.timer -= 5;
            if (object.timer < 0) {
                objects.splice(i, 1);
            }
        }
    }
    pop();
}

function drawVideo(video){
    loadPixels();
    video.loadPixels();
    var vxscale = Math.round(width/360);
    var vyscale = Math.round(height/240);

    /*
    ? I don't know why x < 360 outputs repeated pixels
    */
    for (var x = 0; x < 320; x++) {
        for (var y = 0; y < 240; y++) {
            var debug_loc = (x + y * width) * 4;
            var main_loc = ((x*vxscale) + (y*vyscale) * width) * 4;
            pixels[debug_loc] = video.pixels[main_loc];
            pixels[debug_loc + 1] = video.pixels[main_loc+1];
            pixels[debug_loc + 2] = video.pixels[main_loc+2];
            pixels[debug_loc + 3] = 255;
        }
    }
    nbPixels = Math.round(width/cell_width)*Math.round(height/cell_height);
    updatePixels();
}

function drawDebug(){
    push();
    var vxscale = Math.round(width/360);
    var vyscale = Math.round(height/240);
    let labels = Object.keys(detections);
    for (let label of labels) {
        let objects = detections[label];
        for (let i = objects.length - 1; i >= 0; i--) {
            let object = objects[i];
            stroke(10,255,10);
            noFill();
            var x = object.x/vxscale;
            var y = object.y/vyscale;
            var owidth = object.width/vxscale;
            var oheight = object.height/vyscale;
            rect(x, y, owidth, oheight);

            noStroke();
            fill(255,0,0);
            textSize(20);
            text(object.label + " " + (object.confidence*100).toFixed(2)+"%", x, y+20);
            object.timer -= 5;
            if (object.timer < 0) {
                objects.splice(i, 1);
            }
        }
    }
    pop();
}

function showNumbers(){
    fill(255);
    stroke(0);
    textSize(16);

    text("Nombre de personnes détectées: " + nbPerson, 50, height-100);
    text("Nombre de téléphones détectés: " + nbPhone, 50, height-70);
    text("Nombre de tasses détectées: " + nbCup, 50, height-40);
}