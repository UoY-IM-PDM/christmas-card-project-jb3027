let elf, snow, snow0, snow1, snow2, snowman, ice, cane;
let newGround, delay;
const BLOCK_SIZE = 50;
const GAP = 500;


function preload() {
    elf = loadImage("assets/elf.png");
    snow = loadImage("assets/snow.png");
    snow0 = loadImage("assets/snow0.png");
    snow1 = loadImage("assets/snow1.png");
    snow2 = loadImage("assets/snow2.png");
    ice = loadImage("assets/ice.png");
    snowman = loadImage("assets/snowman.jpeg");
    cane = loadImage("assets/cane.jpg");
}

class Ground {
    #x;

    constructor() {
        this.#x = width;
    }

    draw() {
        image(cane, 300, height - 2*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        for(let i = 0; i < width; i += BLOCK_SIZE) {
            image(ice, i, height - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }

        image(snow0, this.#x, height - 3*BLOCK_SIZE, 4*BLOCK_SIZE, 2*BLOCK_SIZE);
        image(snow1, this.#x + GAP, height - 3*BLOCK_SIZE, 3*BLOCK_SIZE, 2*BLOCK_SIZE);
        let last = image(snow2, this.#x + (2*GAP), height - 3*BLOCK_SIZE, 2*BLOCK_SIZE, 2*BLOCK_SIZE);
    }

    move() {
        if(this.#x + (2*GAP) < -2*BLOCK_SIZE) {
            this.#x = width;
        }
        this.#x--;
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
        this.#y = height - 3*BLOCK_SIZE;
    }

    draw() {
        imageMode(CORNER);
        image(elf, this.#x, this.#y, 2*BLOCK_SIZE, 2*BLOCK_SIZE);
    }

    move() {
        if(keyIsDown(68)) {
            this.#x++;
        }
        if(keyIsDown(65)) {
            this.#x--;
        } 
    }

    jump() {
        for(let i = 0; i < BLOCK_SIZE; i++) {
            this.#y -= 1;
        }
        setTimeout(comeDown, 900);
    }

    down() {
        for(let i = 0; this.#y < height - 3*BLOCK_SIZE; i++) {
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
}


function keyPressed() {
    if(key === 'w') {
        newElf.jump();
    }
}

function comeDown() {
    newElf.down();
}
