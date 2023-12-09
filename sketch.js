let elf, snow, snowman, ice, cane;
let newGround;

const BLOCK_SIZE = 50;
const GAP = 500;
let gameOver = false;

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
    #candyCaneX;

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

        this.#candyCaneX = [this.#x, this.#x + GAP, this.#x + 1.5*GAP, this.#x + 2*GAP, this.#x1 + 2.5*GAP];
        for(let i = 0; i < 5; i++) {
            image(cane, this.#candyCaneX[i], height - 1.5*BLOCK_SIZE, BLOCK_SIZE/2, BLOCK_SIZE);
        }
        
    
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

    getCandyCaneX() {
        return this.#candyCaneX;
    }
}

class Elf {
    #x;
    #y;
    #getXs;
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
        for(let i = 0; i < 2*BLOCK_SIZE; i++) {
            this.#y -= 1;
            
        }
        setTimeout(comeDown, 1000);
    }


    down() {
        for(let i = 0; i < 2*BLOCK_SIZE; i++) {
            this.#y++; 
        }   
    }

    constraint() {
        this.#getXs = newGround.getCandyCaneX();
        for(let i = 0; i < 5; i++) {
            if(this.#x >= this.#getXs[i] && this.#x >= this.#getXs[i-1] && this.#y >= height - 2*BLOCK_SIZE) {
                gameOver = true;
            }
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
    if(!gameOver) {
        newGround.draw();
        newElf.draw();
        newElf.move();
        newElf.constraint();
        newGround.move();
    }
    else {
        background(0);    
    }  
}

function keyPressed() {
    if(key === 'w') {
        newElf.jump();
    }
}

function comeDown() {
    newElf.down();
}