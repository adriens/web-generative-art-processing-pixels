let image;
let images = [];
let count = 50;
let particles = [];

function preload(){
    images.push(loadImage("img/frog.jpg"));
    images.push(loadImage("img/rastadidi.png"));
    images.push(createCapture(VIDEO));
    images[2].hide();
}

function setup(){
    createCanvas(400, 400);
    background(0);

    inputPic = createSelect("input");
    inputPic.option("Frog");
    inputPic.option("Rastadidi");
    inputPic.option("Webcam");
    inputPic.selected("Frog");

    for(var i = 0; i < count; i++){
        particles.push(new Particle(random(10, width), random(10, height)));
    }
}

function draw(){
    if(inputPic.value() === "Frog"){
        image = images[0];
    } else if(inputPic.value() === "Rastadidi"){
        image = images[1];
    } else {
        image = images[2];
    }

    for(var i = 0; i < particles.length; i++){
        particles[i].show();
        particles[i].update();
    }
}