let elf, snow, snowman, ice, cane, xmasFont, direction;
let levelSelect = 0;
let gameOver = false;
let jump = false;
let messageX = [];

const BLOCK_SIZE = 50;
const GAP = 500;

function preload() {
    elf = loadImage("assets/elf.png");
    snow = loadImage("assets/snow.png");
    ice = loadImage("assets/ice.png");
    snowman = loadImage("assets/snowman.jpeg");
    cane = loadImage("assets/cane.png");
    xmasFont = loadFont("assets/Silkscreen-Bold.ttf"); 
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
            image(snow, i, height - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
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
    gameOver;

    /**
     * @param {number} x sets x coordinate
     * @param {number} y sets y coordinate
     */
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
                direction = 1;
                if(this.#x < width - BLOCK_SIZE) {
                    this.#x++;
                }
            }
        }
        if(keyIsPressed) {
            if(key === 'a') {
                direction = -1;
                if(this.#x > 0 + BLOCK_SIZE) {
                    this.#x--;
                }
            } 
        } 

        if(jump) {
            for(let i = 0; i < 2*BLOCK_SIZE; i++) {
                this.#y -= 1;
                if(direction === 1 && this.#x < width - BLOCK_SIZE) {
                    this.#x++;
                }
                if(direction === -1 && this.#x > 0 + BLOCK_SIZE){
                    this.#x--;
                }
            }
            setTimeout(comeDown, 200);
            jump = false;
        }

    }

    down() {
        for(let i = 0; i < 2*BLOCK_SIZE; i++) {
            this.#y++; 
        }   
    }

    constraint() {
        let caneList = newGround.getCandyCaneX();
        for(let i = 0; i < caneList.length; i++) {
            if(this.#x >= caneList[i] && this.#x <= caneList[i] + BLOCK_SIZE && this.#y >= height - 2*BLOCK_SIZE) {
                gameOver = true;
            }
        }
    }

    /**
     * 
     * @returns {number} y coordinate of elf
     */
    getY() {
        return this.#y;
    }
}

class Message {
    #y;
    #messageY;
    #messageChoice = ["Merry Christmas!"];
    #message;

    constructor() {
        this.#y = -BLOCK_SIZE;
        this.#messageY = [];
        this.#message = this.#messageChoice[levelSelect];
    }

    /**
     * @returns {array} random number between BLOCK_SIZE and width - BLOCK_SIZE
     */
    #random() {
        return random(BLOCK_SIZE, width - BLOCK_SIZE);
    }

    draw() {
        fill(255, 0, 0);
        textFont(xmasFont);
        textAlign(CENTER);
        textSize(75);
        let message = this.#message;

        

        for(let i = 0; i < message.length; i++) {
            text(this.#message[i], messageX[i], this.#y - (GAP*i));
            this.#messageY.push(this.#y - (GAP*i));
        }
    }

    /**
     * @param {number} y increases y value so letters move
     */
    move() {
        this.#y++;
    }

    /**
     * @returns {ARRAY} y coordinates of letters
     */
    getY() {
        return this.#messageY;
    }

    /**
     * @returns {ARRAY} x coordinates of letters
     */
    getX() {
        return messageX;
    }
}

function setup() {
    createCanvas(800, 600);
    newGround = new Ground;
    newElf = new Elf;
    newMessage = new Message;
    frameRate(500);

    for(let i = 0; i < 20; i++) {
        messageX.push(randomVal());
    }
    
}

function draw() {
    noStroke();
    background(0);
    if(!gameOver) {
        newGround.draw();
        newElf.draw();
        newElf.move();
        //newElf.constraint();
        newGround.move();
        newMessage.draw();
        newMessage.move();
    }
    else {
        background(0);    
    }  
}

function keyPressed() {
    if(key === 'w') {
        jump = true;
    }
}

function comeDown() {
    newElf.down();
}

function randomVal() {
    return random(BLOCK_SIZE, width - BLOCK_SIZE);
}