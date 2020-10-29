function Particle(x, y, img){
    this.x = x;
    this.y = y;

    this.speed = 20;
    this.xdir = random(-this.speed,this.speed);
    this.ydir = random(-this.speed,this.speed);

    this.size = 10;

    this.show = function(){
        push();
        let colors = image.get(this.x, this.y);

        noStroke();
        fill(colors[0], colors[1], colors[2], 255);
        ellipse(this.x, this.y, this.size);
        pop();
    }

    this.update = function(){
        this.x += this.xdir;
        this.y += this.ydir;

        if(dist(this.x, 0, 0, 0) <= this.size/2 || dist(this.x, 0, width, 0) <= this.size/2){
            this.xdir = -this.xdir;
        }
        if(dist(0, this.y, 0, 0) <= this.size/2 || dist(0, this.y, 0, height) <= this.size/2){
            this.ydir = -this.ydir;
        }
    }
}