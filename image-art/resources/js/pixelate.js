let pixelate = function(p) {
    let video;

    let size = 100;
    let cell_width, cell_height;
    let nbPixels = 0;

    let DEBUG = "";

    p.preload = function(){
        video = p.createCapture(VIDEO);
        video.size(640, 480);
        video.hide();
        setInterval(p.reset, 5000);
    }

    p.setup = function() {
        let canvas = p.createCanvas(400, 400);
        canvas.id("pixelateCanvas");
        canvas.style("border", "1px solid white");
        p.background(60);
        setInterval(p.changeSize, 1000);
    }

    p.draw = function() {
        if (video.width !== p.width || video.height !== p.height) {
            p.resizeCanvas(video.width, video.height);
        }

        cell_width = Math.round(p.width / size);
        cell_height = Math.round(p.height / size);

        p.pixelate(video);
        p.updateText();
        loop();
    }

    p.changeSize = function() {
        size = random(10, 100);
    }

    p.pixelate = function(img) {
        p.loadPixels();
        video.loadPixels();
        var size;
        var r = 0;
        var g = 0;
        var b = 0;
        for (var x = 0; x < p.width; x = x + cell_width) {
            for (var y = 0; y < p.height; y = y + cell_height) {
                size = 1;
                for (var n = x; n < x + cell_width; n++) {
                    for (var m = y; m < y + cell_height; m++) {
                        var loc = (n + m * p.width) * 4;
                        if (img.pixels[loc] > 0) {
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
                        var loc = (n + m * p.width) * 4;
                        p.pixels[loc] = r;
                        p.pixels[loc + 1] = g;
                        p.pixels[loc + 2] = b;
                        p.pixels[loc + 3] = 255;
                    }
                }
            }
        }
        nbPixels = Math.round(p.width / cell_width) * Math.round(p.height / cell_height);
        p.updatePixels();
    }

    p.updateText = function() {
        p.push();
        p.stroke(0);
        p.fill(255);
        p.textAlign(RIGHT);
        p.text(nbPixels + "px", width - 20, 20);
        p.text(DEBUG, width - 10, height - 10);
        p.pop();
    }

    p.reset = function(){
        video = p.createCapture(VIDEO);
        video.size(640, 480);
        video.hide();
    }
}