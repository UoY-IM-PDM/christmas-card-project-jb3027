function preload() {
    elf1 = loadImage("assets/pixil-frame-0.png");
    elf2 = loadImage("assets/pixil-frame-0 (1).png");
}

function setup() {
    createCanvas(800, 600);
    rectMode(CENTER);
    background(0);
}

function draw() {
    image(elf1, 300, 300, 200, 200);
    image(elf2, 300, 300, 300, 300);

    
}


