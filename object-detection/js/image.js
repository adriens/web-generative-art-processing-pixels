let video;
let detector;
let detections = {};
let idCount = 0;

function preload() {
    detector = ml5.objectDetector('cocossd');
}

function gotDetections(error, results) {
    if (error) {
        console.error(error);
    }

    let labels = Object.keys(detections);
    for (let label of labels) {
        let objects = detections[label];
        for (let object of objects) {
            object.taken = false;
        }
    }

    for (let i = 0; i < results.length; i++) {
        let object = results[i];
        let label = object.label;

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
                    let amt = 0.75; //0.75;
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
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    detector.detect(video, gotDetections);
}

function draw() {
    background(60)

    let labels = Object.keys(detections);
    for (let label of labels) {
        let objects = detections[label];
        for (let i = objects.length - 1; i >= 0; i--) {
            let object = objects[i];
            if(object.label === "cell phone") {
                noStroke();
                fill(0, 255, 0, object.timer);
                rect(object.x, object.y, object.width, object.height);
            }
            object.timer -= 5;
            if (object.timer < 0) {
                objects.splice(i, 1);
            }
        }
    }
}