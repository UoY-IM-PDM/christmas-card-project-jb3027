let elf, snow, snowman, ice, cane, xmasFont, direction;
let YValue;
let levelSelect = 0;
let score = 0;
let current = 0;
let count = 0;
let gameOver = false;
let checkSpace = true;
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
        this.#candyCaneX = [this.#x, this.#x + GAP, this.#x + 2*GAP, this.#x + 3*GAP, this.#x1 + 3*GAP];
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
    #messageList;
    #check;
    #complete;
    #caught;
    #isOver;

    /**
     * @param {number} x sets x coordinate
     * @param {number} y sets y coordinate
     */
    constructor() {
        this.#x = 20;
        this.#y = height - 2*BLOCK_SIZE;
        this.#messageList = [];
        this.#check = false;
        this.#complete;
        this.#caught;
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
                    this.#x += 2;
                }
            }
        }
        if(keyIsPressed) {
            if(key === 'a') {
                direction = -1;
                if(this.#x > 0 + BLOCK_SIZE) {
                    this.#x -= 2;
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

    checkOver() {
        let letterY = newMessage.getY();
        let letterX = newMessage.getX();
        let message = newMessage.getMessageList();
        let mLength = newMessage.getMessageLength();
        let messageList = this.#messageList;
        
        if((this.#x >= letterX[current] - BLOCK_SIZE/2 && this.#x <= letterX[current] + BLOCK_SIZE/2 
        && this.#y + BLOCK_SIZE/2 >= letterY - BLOCK_SIZE/2 && this.#y - BLOCK_SIZE/2 <= letterY + BLOCK_SIZE/2) 
        || message[current] === " ") {
            this.#check = true;
        } 
            
        if(this.#check) {
            if(messageList[current] != message[current] && message[current] != " ") {
                splice(messageList, message[current], current);
                score++;
                this.#caught = messageList[current];
            }
            if(message[current] === " ") {
                splice(messageList, message[current], current);
                this.#caught = messageList[current];
            }
            this.#check = false;
        }

        if(messageList.length === mLength) {
            completeScreen(messageList);
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

    getFinalLength() {
        let messageList = this.#messageList;
        return messageList.length;
    }

    getCaught() {
        let messageList = this.#messageList;
        if(messageList[current] === this.#caught) {
            return this.#caught;
        } else {
            return false;
        } 
    }
}

class Message {
    #y;
    #messageChoice = ["Merry Christmas!"];
    #message;
    #messageLength;
    #messageList;
    #xCoord;

    constructor() {
        this.#y = -BLOCK_SIZE;
        this.#message = this.#messageChoice[levelSelect];
        let message = this.#message;
        this.#messageList = [];
        let messageList = this.#messageList;
        this.#messageLength = message.length;
        this.#xCoord = 80;
        
        for(let i = 0; i < this.#messageLength; i++) {
            messageList.push(message[i]);
        }
    }

    draw() {
        let message = this.#message;
        let messageList = this.#messageList;
        let mLength = this.#messageLength;
        

        fill(255, 0, 0);
        text(messageList[current], messageX[current], this.#y);
        
        textSize(40);
        textAlign(CENTER);
            
        if(newElf.checkOver()) {
            completeScreen(messageList);
        } 
    }

    move() {
        if(this.#y < height + BLOCK_SIZE) {
            this.#y++;
        } 
        if(this.#y > height + BLOCK_SIZE || newElf.getCaught()) {
            current++;
            this.#y = -BLOCK_SIZE;
        }
    }

    /**
     * @returns {ARRAY} y coordinates of letters
     */
    getY() {
        return this.#y;
    }

    /**
     * @returns {ARRAY} x coordinates of letters
     */
    getX() {
        return messageX;
    }

    getMessageLength() {
        let message = this.#message;
        return message.length;
    }

    getMessage() {
        return this.#message;
    }

    getMessageList() {
        return this.#messageList;
    }
}

function setup() {
    createCanvas(800, 600);
    newGround = new Ground;
    newElf = new Elf;
    newMessage = new Message;
    

    for(let i = 0; i < 20; i++) {
        messageX.push(randomVal());
    }
}

function draw() {
    frameRate(500);
    textFont(xmasFont);
    textAlign(CENTER);
    textSize(75);
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
        fill(0, 255, 0);
        textAlign(CORNER);
        textSize(20);
        text("Letters caught: " + score + " / " + (newMessage.getMessageLength() -1), 40, 50);
    }
    if (gameOver) {
        background(0); 
        textAlign(CENTER);  
        text("GAME OVER", width/2, height/2);
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

function completeScreen(messageList) {
    background(0);
    textAlign(CENTER);
    textSize(35);

    let separator = " ";
    let joinedText = join(messageList, separator);
    text(joinedText, width/2, height/2);
}