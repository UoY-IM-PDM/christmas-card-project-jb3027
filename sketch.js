let elf, snow, snowman, ice, cane, xmasFont, direction;
let YValue;
let messageX = [];
let levelSelect = 0;
let score = 0;
let current = 0;
let count = 0;
let spaces = 0;
let gameOver = false;
let checkSpace = true;
let jump = false;
let completeButton = false;
let loadButton = false;
let playAgainButton = false;
let pressed = false;

let startGame = 0;
let restartGame;
let playAgain;

const BLOCK_SIZE = 50;
const GAP = 800;

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
        this.#x = width/2;
        this.#y = height - 2*BLOCK_SIZE;
        this.#messageList = [];
        this.#check = false;
        this.#complete = false;
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
                spaces++;
            }
            this.#check = false;
        }
        if(messageList.length === mLength) {
            this.#complete = true;
            // completeScreen(newMessage.getMessage());
        }  
        
    }

    down() {
        for(let i = 0; i < 2*BLOCK_SIZE; i++) {
            this.#y++; 
        }   
    }

    constraint() {
        let caneList = newGround.getCandyCaneX();
        if(!gameOver) {
            for(let i = 0; i < caneList.length; i++) {
                if(this.#x >= caneList[i] && this.#x <= caneList[i] + BLOCK_SIZE && this.#y >= height - 2*BLOCK_SIZE) {
                    gameOver = true;
                }
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

    getIfCaught(messageList) {
        if(messageList[current] === this.#caught) {
            return true;
        } else {
            return false;
        }
    }

    getComplete() {
        return this.#complete;
    }
}

class Message {
    #y;
    #messageChoice = ["A"];
    #message;
    #messageLength;
    #messageList;
    #complete;

    constructor() {
        this.#y = -BLOCK_SIZE;
        this.#message = this.#messageChoice[levelSelect];
        let message = this.#message;
        this.#messageList = [];
        let messageList = this.#messageList;
        this.#messageLength = message.length;
        this.#complete = false;
        
        for(let i = 0; i < this.#messageLength; i++) {
            messageList.push(message[i]);
        }
    }

    draw() {
        let message = this.#message;
        let messageList = this.#messageList;
        let mLength = this.#messageLength;

        fill(255, 0, 0);
        textSize(80);
        textAlign(CENTER);
        text(messageList[current], messageX[current], this.#y);
        
        if(newElf.checkOver()) {
            this.#complete = true;
        } 
    }

    move() {
        let messageList = this.#messageList;
        if(this.#y < height + BLOCK_SIZE) {
            this.#y++;
        } 

        if(this.#y > height - BLOCK_SIZE) {
            this.#y = -BLOCK_SIZE;
        }
        if(newElf.getIfCaught(messageList)) {
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

    getComplete() {
        return this.#complete;
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
    console.log(startGame);
    //console.log("START GAME = " + startGame);
    gameOver = false;
    
    if(startGame === 0) {
        loadScreen();
    }
    if(startGame === 1) {
        newGame();
    }
    if(startGame === 2) {
        overScreen();
    }
    if(startGame === 3) {
        completeScreen(newMessage.getMessage());
    }
    if(startGame === 4) {
        completeScreen(newMessage.getMessage());
    }

    if(!gameOver) {
        if(newElf.getComplete()) {
            startGame = 3;
        }       
    }
    if(gameOver) {
        startGame = 2;
    } 
}

function overScreen() {
    background(0); 
    textAlign(CENTER);  
    text("GAME OVER", width/2, height/2);
    button("START GAME", 0, -50, "gameOver");
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

function completeScreen(message) {
    completeButton = false;
    //("COMPLETE SCREEN");
    background(0);
    textAlign(CENTER);
    textSize(20);
    fill(255);
    text("CONGRATULATIONS!", width/2, height*0.15);
    text("You have collected the message...", width/2, height*0.2);
    textSize(50);
    fill(255, 0, 0);
    text(message, width/2, height/2);
    button("PLAY AGAIN", 0, 0, "complete");
}

function loadScreen() {
    loadButton = false;
    gameOver = false;
    //console.log("LOAD SCREEN");
    background(0);
    newGround.draw();
    newElf.draw();
    fill(255);
    textAlign(CENTER);
    textSize(25);
    text("Help the elf collect all the falling letters to uncover the hidden message", width/2, height*0.2, 800);
    fill(255, 0, 0);
    text("but beware of the candy canes...", width/2, height*0.37);
    button("START GAME", 0, -150, "loadScreen");
}

function newGame() {
    gameOver = false;
    //("NEW GAME");
    background(0);
    fill(0, 255, 0);
    textAlign(CORNER);
    textSize(30);
    text("Letters caught: " + score + " / " + (newMessage.getMessageLength() - spaces), 40, 50);
    newGround.draw();
    newElf.draw();
    newElf.move();
    //newElf.constraint();
    newGround.move();
    newMessage.draw();
    newMessage.move();
}

function button(buttonLabel, xCord, yCord, functionName) {
    if(mouseX >= width/2 + xCord - 130 && mouseX <= width/2 + xCord + 130
    && mouseY <= (height*0.8 + yCord) + 45 && mouseY >= (height*0.8 + yCord)) {
        if(functionName === "complete") {
            playAgainButton = true;
        }
        if(functionName === "gameOver") {
            restartButton = true;
        }
        if(functionName === "loadScreen") {
            loadButton = true;
        }
        fill(0, 255, 0);
    } else {
        playAgainButton = false;
        restartButton = false;
        loadButton = false;
        fill(255, 0, 0);
    }                           
    rectMode(CENTER);
    rect(width/2 + xCord, height*0.835 + yCord, 260, 40);
    fill(255);
    textSize(30);
    text(buttonLabel, width/2 + xCord, height*0.85 + yCord);
}

function mouseClicked() {
    if(loadButton || restartButton || playAgainButton) { //|| playAgainButton
        startGame = 1;
    }
}
