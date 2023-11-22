function preload() {
    elf1 = loadImage("assets/pixil-frame-0.png");
    elf2 = loadImage("assets/pixil-frame-0 (1).png");
}

class Elf {
    elf1;
    elf2; 
    #xDir;
    #yDir;

    constructor() {
        
    }

    move() {
        
    }

    goLeft() {
        this.#xDir = 1;
        this.#yDir = 0;
    }

    goRight() {
        this.#xDir = -1;
        this.#yDir = 0;
    }

    goUp() {
        this.#xDir = 0;
        this.#yDir = -1;
    }

    goDown() {
        this.#xDir = 0;
        this.#yDir = 1;
    }

    addSegment() {
        let prevSegment = this.#segments[this.#segments.length - 1];
        let newSegX = prevSegment.getX() - prevSegment.getWidth() * this.#xDir;
        let newSegY = prevSegment.getY() - prevSegment.getWidth() * this.#yDir;
        this.#segments.push(new Segment(newSegX, newSegY));
    }

    draw() {
        fill(0, 255, 0);
        for(let segment of this.#segments) {
            segment.draw();
        }
    }

    isOverFood(food) {
        return this.#segments[0].isOverPoint(food.getX(), food.getY());
    }

    touchingWall() {
        let currentSegment = this.#segments[0];
        if((currentSegment.getX() === width || currentSegment.getX() < 0) || (currentSegment.getY() === height || currentSegment.getY() < 0)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @returns {number} segments array
     */
    getSegments() {
        return this.#segments;
    }

    /**
     * @returns {number} xDir
     */
    getXDir() {
        return this.#xDir;
    }

    /**
     * @returns {number} yDir
     */
    getYDir() {
        return this.#yDir;
    }

}




function setup() {
    createCanvas(800, 600);
    rectMode(CENTER);
    background(0);
}

function draw() {
    image(elf[0], 300, 300, 200, 200);

    
}

function running() {
    
}

