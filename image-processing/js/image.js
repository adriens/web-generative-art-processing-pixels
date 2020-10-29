let images = [];

let size;
let cell_width, cell_height;
let nbPixels = 0;

// s[Name] means the select input for [name]
let sInput;
let sEffect;

let DEBUG = "";

function preload(){
    images.push(loadImage("img/frog.jpg"));
    images.push(createCapture(VIDEO));
    images[1].hide();
}

function setup(){
    createCanvas(400, 400);
    background(60);

    size_slider = createSlider(1,300,300,1);
    size_slider.style("width","150px");

    sInput = createSelect("input");
    sInput.option("Webcam", "1");
    sInput.option("Frog", "0");

    sEffect = createSelect("effect");
    sEffect.option("None", "0");
    sEffect.option("Pixelate", "1");
    sEffect.option("Minimum", "2");
    sEffect.option("Maximum", "3");
    sEffect.option("Black & White", "4");
    sEffect.option("Negative", "5");
    sEffect.selected("0");
}

function draw(){
    let img = images[sInput.value()];
    let effect = sEffect.value();
    if(img.width !== width || img.height !== height) {
        resizeCanvas(img.width, img.height);
    }
    size_slider.position(width/2-75, height-20);

    size = size_slider.value();
    cell_width = Math.round(width/size);
    cell_height = Math.round(height/size);

    if(effect === "0") showPic(img);
    else if(effect === "1") pixelate(img);
    else if(effect === "2") minimum(img);
    else if(effect === "3") maximum(img);
    else if(effect === "4") black_white(img);
    else if(effect === "5") negative(img);

    updateText();
}

function showPic(img){
    loadPixels();
    img.loadPixels();
    for(var x = 0; x < width; x++){
        for(var y = 0; y < height; y++){
            var loc = (x + y * width) * 4;
            pixels[loc] = img.pixels[loc];
            pixels[loc+1] = img.pixels[loc+1];
            pixels[loc+2] = img.pixels[loc+2];
            pixels[loc+3] = 255;
        }
    }
    nbPixels = width * height;
    updatePixels();
}

function pixelate(img){
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

function minimum(img){
    loadPixels();
    img.loadPixels();

    var r;
    var g;
    var b;
    for(var x = 0; x < width; x=x+cell_width) {
        for (var y = 0; y < height; y = y + cell_height) {
            r = 255;
            g = 255;
            b = 255;
            for (var n = x; n < x + cell_width; n++) {
                for (var m = y; m < y + cell_height; m++) {
                    var loc = (n + m * width) * 4;
                    if(img.pixels[loc] > 0) {
                        if(img.pixels[loc] < r) r = img.pixels[loc];
                        if(img.pixels[loc+1] < g) g = img.pixels[loc + 1];
                        if(img.pixels[loc+2] < b) b = img.pixels[loc + 2];
                    }
                }
            }

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

function maximum(img){
    loadPixels();
    img.loadPixels();

    var r;
    var g;
    var b;
    for(var x = 0; x < width; x=x+cell_width) {
        for (var y = 0; y < height; y = y + cell_height) {
            r = 0;
            g = 0;
            b = 0;
            for (var n = x; n < x + cell_width; n++) {
                for (var m = y; m < y + cell_height; m++) {
                    var loc = (n + m * width) * 4;
                    if(img.pixels[loc] > 0) {
                        if(img.pixels[loc] > r) r = img.pixels[loc];
                        if(img.pixels[loc+1] > g) g = img.pixels[loc + 1];
                        if(img.pixels[loc+2] > b) b = img.pixels[loc + 2];
                    }
                }
            }

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

function black_white(img){
    loadPixels();
    img.loadPixels();

    var size;
    var r;
    var g;
    var b;
    for(var x = 0; x < width; x=x+cell_width) {
        for (var y = 0; y < height; y = y + cell_height) {
            r = 0;
            g = 0;
            b = 0;
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
            r = g = b = Math.round(0.21*(r/size) + 0.72*(g/size) + 0.07*(b/size));

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

function negative(img){
    loadPixels();
    img.loadPixels();

    var size;
    var r;
    var g;
    var b;
    for(var x = 0; x < width; x=x+cell_width) {
        for (var y = 0; y < height; y = y + cell_height) {
            r = 0;
            g = 0;
            b = 0;
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
            r = 255 - (r/size);
            g = 255 - (g/size);
            b = 255 - (b/size);

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

function updateText(){
    push();
    stroke(0);
    fill(255);
    textAlign(RIGHT);
    text(nbPixels+"px", width-20, 20);
    text(DEBUG, width-10, height-10);
    pop();
}