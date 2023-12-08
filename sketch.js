let elf, snow, snowman, ice, cane;
let newGround;
let blockStop = [0, 0, 0, 0, 0];
const BLOCK_SIZE = 50;
const GAP = 500;

function preload() {
    elf = loadImage("assets/elf.png");
    snow = loadImage("assets/snow.png");
    ice = loadImage("assets/ice.png");
    snowman = loadImage("assets/snowman.jpeg");
    cane = loadImage("assets/cane.png");
}

class Ground {
    #x;
    #x1;

    constructor() {
        this.#x = 300;
        this.#x1 = 300;
    }

    draw() {
        for(let i = 0; i < width; i += BLOCK_SIZE) {
            imageMode(CORNER);
            image(ice, i, height - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        imageMode(CENTER);
        image(cane, this.#x, height - 1.5*BLOCK_SIZE, BLOCK_SIZE/2, BLOCK_SIZE);
        image(cane, this.#x + GAP, height - 1.5*BLOCK_SIZE, BLOCK_SIZE/2, BLOCK_SIZE);
        image(cane, this.#x + 1.5*GAP, height - 1.5*BLOCK_SIZE, BLOCK_SIZE/2, BLOCK_SIZE);
        image(cane, this.#x + 2*GAP, height - 1.5*BLOCK_SIZE, BLOCK_SIZE/2, BLOCK_SIZE);
        image(cane, this.#x1 + 2.5*GAP, height - 1.5*BLOCK_SIZE, BLOCK_SIZE/2, BLOCK_SIZE);
    }

    move() {
        if(this.#x + 2*GAP < -2*BLOCK_SIZE) {
            this.#x = width;
        }
        if(this.#x1 + 3*GAP < -2*BLOCK_SIZE) {
            this.#x1 = 300;
        }
        this.#x--;
        this.#x1--;
    }

    constraints() {
        for(let i = 0; i < 5; i++) {
            blockStop.pop();
        }
        blockStop.push(this.#x - (BLOCK_SIZE/2));
        blockStop.push(this.#x + GAP - (BLOCK_SIZE/2));
        blockStop.push(this.#x + GAP*1.5 - (BLOCK_SIZE/2));
        blockStop.push(this.#x + GAP*2 - (BLOCK_SIZE/2));
        blockStop.push(this.#x1 + GAP*2.5 - (BLOCK_SIZE/2));
    }

    getX() {
        return this.#x;
    }
}

class Elf {
    #x;
    #y;
    gameOver;

    constructor() {
        this.#x = 20;
        this.#y = height - 2*BLOCK_SIZE;
    }

    draw() {
        imageMode(CENTER);
        image(elf, this.#x, this.#y, 2*BLOCK_SIZE, 2*BLOCK_SIZE);
    }

    move() {
        if(keyIsPressed) {
            if(key === 'd') {
                this.#x++;
            }
        }
        if(keyIsPressed) {
            if(key === 'a') {
                this.#x--;
            } 
        } 
    }

    jump() {
        for(let i = 0; i < 1.5*BLOCK_SIZE; i++) {
            this.#y -= 1;
        }
        setTimeout(comeDown, 900);
    }

    down() {
        for(let i = 0; i < 1.5*BLOCK_SIZE; i++) {
            this.#y++; 
        }   
    }

    getY() {
        return this.#y;
    }
}

function setup() {
    createCanvas(800, 600);
    newGround = new Ground;
    newElf = new Elf;
    frameRate(500);
}

function draw() {
    noStroke();
    background(0);
    newGround.draw();
    newElf.draw();
    newElf.move();
    newGround.move();
    newGround.constraints();
}

function keyPressed() {
    if(key === 'w') {
        newElf.jump();
    }
}

function comeDown() {
    console.log("WORKING");
    newElf.down();
}