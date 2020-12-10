let video;

let detector;
let detections = {};
let idCount = 0;

let textNbPerson;
let nbPerson = 0;

let textNbPhone;
let nbPhone = 0;

let textNbCup;
let nbCup = 0;

function preload() {
    detector = ml5.objectDetector('cocossd');
    video = createCapture(VIDEO);
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

        object.color = color(randomColors[0], randomColors[1], randomColors[2], 100);
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

function setup() {
    createCanvas(windowWidth, windowHeight);
    video.size(width, height);
    video.hide();

    textNbPerson = createElement("p","Nombre de personnes détectées: " + nbPerson);

    textNbPerson.id("data");

    textNbPhone = createElement("p","Nombre de téléphones détectés: " + nbPhone);
    textNbPhone.id("data");

    textNbCup = createElement("p","Nombre de tasses détectés: " + nbCup);
    textNbCup.id("data");

    //setInterval(clearScreen, 30000);

    //video.hide();
    detector.detect(video, gotDetections);
}

function draw() {
    clear();
    textNbPerson.position(20,height-100);
    textNbPhone.position(20,height-80);
    textNbCup.position(20,height-60);
    drawObjects();
    showNumbers();
    image(video, 0, 0, 480, 360);
    drawDebug();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    video.size(width, height);
}

function drawObjects(){
    push();
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

function drawDebug(){
    push();
    var vxscale = Math.round(width/480);
    var vyscale = Math.round(height/360);
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
    textNbPerson.html("Nombre de personnes détectées: " + nbPerson);
    textNbPhone.html("Nombre de téléphones détectés: " +  nbPhone);
    textNbCup.html("Nombre de tasses détectés: " +  nbCup);
}


function clearScreen(){
    clear();
    background(60);
}