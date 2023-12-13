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
let done = false;

let startGame = 0;
let restartGame;
let playAgain;
let newGround, newMessage, newElf;

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

function setup() {
    createCanvas(800, 600);
    newMessage = new Message();

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
    gameOver = false;
    let checkComplete = newMessage.getMessage();
    
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
        completeScreen(checkComplete);
    }
    if(!gameOver && newElf.getComplete() && !done) {
        startGame = 3;
    }  
    if(gameOver) {
        startGame = 2;
    } 
}

/**
 * The screen showed when the game is over.
 */
function overScreen() {
    playAgainButton = false;
    restartButton = false;
    loadButton = false;
    background(0); 
    textAlign(CENTER);  
    text("GAME OVER", width/2, height/2);
    button("START GAME", 0, -50, "gameOver");
}

/**
 * If w pressed then make the elf jump
 */
function keyPressed() {
    if(key === 'w') {
        jump = true;
    }
}

/**
 * Makes elf move down after jumping.
 */
function comeDown() {
    newElf.down();
}

/**
 * 
 * @returns {value} random number between BLOCK_SIZE and width - BLOCK_SIZE
 */
function randomVal() {
    return random(BLOCK_SIZE, width - BLOCK_SIZE);
}

/**
 * 
 * @param {string} message The message to be displayed
 */
function completeScreen(message) {
    playAgainButton = false;
    restartButton = false;
    loadButton = false;
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

/**
 * The initial screen
 */
function loadScreen() {
    playAgainButton = false;
    restartButton = false;
    loadButton = false;
    gameOver = false;
    score = 0;
    current = 0;

    newGround = new Ground();
    newElf = new Elf();
    newMessage = new Message();

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

/**
 * Second screen, the start of game play
 */
function newGame() {
    gameOver = false;
    background(0);
    fill(0, 255, 0);
    textAlign(CORNER);
    textSize(30);
    text("Letters caught: " + score + " / " + (newMessage.getMessageLength() - spaces), 40, 50);
    newGround.draw();
    newElf.draw();
    newElf.move();
    newElf.constraint();
    newGround.move();
    newMessage.draw();
    newMessage.move();
}

/**
 * 
 * @param {string} buttonLabel The text to be displayed on the button
 * @param {number} xCord x coordinate of button
 * @param {number} yCord y coordinate of butto
 * @param {string} functionName The name of the function to be called within mouseClicked()
 */
function button(buttonLabel, xCord, yCord, functionName) {
    //if mouse is over the button
    if(mouseX >= width/2 + xCord - 130 && mouseX <= width/2 + xCord + 130
    && mouseY <= (height*0.8 + yCord) + 45 && mouseY >= (height*0.8 + yCord)) {
        //checks to see which button the mouse is over
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
    //draws appropriate button                         
    rectMode(CENTER);
    rect(width/2 + xCord, height*0.835 + yCord, 260, 40);
    fill(255);
    textSize(30);
    text(buttonLabel, width/2 + xCord, height*0.85 + yCord);
}


function mouseClicked() {
    if(loadButton) { 
        startGame = 1;
    }
    if(restartButton) {
        startGame = 0;
    }
    if(playAgainButton) {
        done = true;
        startGame = 0;
    }
}

/**
 * Class for creating the ground
 */
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

    /**
     * 
     * @returns {array} x coordinates of the candy canes
     */
    getCandyCaneX() {
        return this.#candyCaneX;
    }
}

/**
 * Class for creating the elf
 */
class Elf {
    #x;
    #y;
    #messageList;
    #check;
    #complete;
    #caught;
    #isOver;

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

        //Checks to see if the elf is touching the current letter
        if((this.#x >= letterX[current] - BLOCK_SIZE/2 && this.#x <= letterX[current] + BLOCK_SIZE/2 
        && this.#y + BLOCK_SIZE/2 >= letterY - BLOCK_SIZE/2 && this.#y - BLOCK_SIZE/2 <= letterY + BLOCK_SIZE/2) 
        || message[current] === " ") {
            this.#check = true;
        } 
        
        //if the elf is touching the letter then add the letter to the caught list once
        if(this.#check) {
            if(messageList[current] != message[current] && message[current] != " ") {
                splice(messageList, message[current], current);
                score++;
                this.#caught = messageList[current];
            }
            //if the letter is a space, add it to caught automatically (can't catch blank space)
            if(message[current] === " ") {
                splice(messageList, message[current], current);
                this.#caught = messageList[current];
                spaces++;
            }
            this.#check = false;
        }
        //if all letters are caught while playing
        if(messageList.length === mLength && startGame === 1) {
            this.#complete = true;
        }         
    }

    down() {
        for(let i = 0; i < 2*BLOCK_SIZE; i++) {
            this.#y++; 
        }   
    }

    constraint() {
        //if elf is touching candy cane
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
     * Get the Y value
     * @returns {number} y coordinate of elf
     */
    getY() {
        return this.#y;
    }

    /**
     * Get the final length of the message
     * @returns {number} length of collected letter array
     */
    getFinalLength() {
        let messageList = this.#messageList;
        return messageList.length;
    }

    /**
     * Check if the letter has been caught
     * @param {array} messageList list of letters in the array
     * @returns {boolean} whether letter has been caught or not
     */
    getIfCaught(messageList) {
        if(messageList[current] === this.#caught) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @returns {boolean} returns true if all the letters have been collected
     */
    getComplete() {
        return this.#complete;
    }
}

class Message {
    #y;
    #messageChoice = ["MERRY CHRISTMAS!"];
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
     * get Y Value
     * @returns {array} y coordinates of letters
     */
    getY() {
        return this.#y;
    }

    /**
     * @returns {array} x coordinates of letters
     */
    getX() {
        return messageX;
    }
    
    /**
     * Get length of the message
     * @returns {number} number of letters in the message
     */
    getMessageLength() {
        let message = this.#message;
        return message.length;
    }

    /**
     * Get the message
     * @returns {array} gets original message
     */
    getMessage() {
        return this.#message;
    }

    /**
     * @returns {array} gets list of letters that have been caught
     */
    getMessageList() {
        return this.#messageList;
    }

    /**
     * Gets whether all the letters have been collected
     * @returns {boolean} returns true if all letters have been collected
     */
    getComplete() {
        return this.#complete;
    }
}