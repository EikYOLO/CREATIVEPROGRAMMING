let showBubble = true;
let myFont
function preload() {
  myFont = loadFont('Game.ttf');
}
function setup() {
createCanvas(1000, 200);
}

function draw() {
background(255);

if (showBubble) {
//Bubble background
fill(255, 226, 36);
stroke(0);
rect(70, 50, 500, 120, 10);

//text
fill(16, 92, 29);
noStroke();
textFont(myFont);
textAlign(CENTER, CENTER);
textSize(10);
 text("Try to save the corals before they die!!!", 320, 70);
 text("If the drops from the sunblock touches the corals", 320, 90);
 text("they will take damage", 320, 110);
 text("Press ENTER to continue", 320, 150);
}
}

function keyPressed() {
if (keyCode === ENTER) {
showBubble = false;
}
}
