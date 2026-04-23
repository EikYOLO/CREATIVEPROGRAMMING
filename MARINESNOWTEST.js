let bubbles = [];
let corals = [];
let dust = [];
let bgsound;
let bg;

function preload() {
  bg = loadImage("Baggrunden.png");
  bgsound = loadSound("Ocean.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  generateCoral();
  
  //bg sounds setup
  bgsound.setVolume(1);
bgsound.loop();
}

function draw() {
  image(bg, 0, 0, width, height);


// sunbeams in HSB
noStroke();
for (let i = 0; i < 5; i++) {
  let x = width * 0.3 + i * 120;
  let rayWidth = 60 + sin(frameCount * 0.01 + i * 1.5) * 20;
  let sway = sin(frameCount * 0.001 + i * 2) * 30;
  
  fill(50, 30, 100, 5); // HSB gul, meget gennemsigtig
  beginShape();
  vertex(x + sway, 0);
  vertex(x + rayWidth + sway, 0);
  vertex(x + rayWidth * 2 + sway * 0.5, height);
  vertex(x - rayWidth * 0.5 + sway * 0.5, height);
  endShape(CLOSE);
}





//mouselocation
fill(0);
noStroke();
textSize(14);
textAlign(LEFT);
text("x: " + mouseX + "  y: " + mouseY, 10, 20);



// spawn nye (dust) partikler
if (random(1) < 0.1) {
  dust.push({
    x: random(width),
    y: 0,
    size: random(1, 4),
    speed: random(0.2, 0.8),
    wobble: random(1000),
    alpha: random(20, 40)
  });
}

// opdater og tegn
for (let i = dust.length - 1; i >= 0; i--) {
  let d = dust[i];
  d.y += d.speed;
  d.x += sin(frameCount * 0.01 + d.wobble) * 0.5;

  noStroke();
  fill(200, 10, 100, d.alpha);
  ellipse(d.x, d.y, d.size);

  if (d.y > height) {
    dust.splice(i, 1);
  }
}


  // Koraller
  for (let c of corals) {
    if (c.targetSat !== null) {
      let h = hue(c.color);
      let s = saturation(c.color);
      let b = brightness(c.color);
      s = lerp(s, c.targetSat, c.fadeSpeed);
      c.color = color(h, s, b);
      if (abs(s - c.targetSat) < 0.5) {
        c.targetSat = null;
      }
    }
    push();
    translate(c.x, c.y);
        let sway = sin(frameCount * 0.02 + c.swayOffset) * 0.05;
    branch(c.len, c, sway);
    pop();
  }

  // Tilfældige bobler fra bunden
  if (random(1) < 0.02) {
    let x = random(width);
    bubbles.push(new Bubble(x, height));
  }

  // Opdater og tegn bobler
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].move();
    bubbles[i].show();
    if (bubbles[i].y < -50) {
      bubbles.splice(i, 1);
    }
  }
}

//coralfunktion
function generateCoral() {
  corals = [];
  let count = floor(random(4, 9));

  // De tre gyldige områder
  let zones = [
    { x1: 1,    y1: 670, x2: 1325, y2: 800 },
    { x1: 0,    y1: 355, x2: 406,  y2: 670 },
    { x1: 1000, y1: 384, x2: 1325, y2: 670 }
  ];

  for (let i = 0; i < count; i++) {
   
    // Vælg en tilfældig zone
    let z = random(zones);

    corals.push({
      x: random(z.x1, z.x2),
      y: random(z.y1, z.y2),
      len: random(30, 60),
      baseAngle: random(-0.2, 0.2),
      scale: random(0.6, 0.75),
      spread: radians(random(90, 100)),
      color: color(random(0, 360), random(60, 100), random(70, 100)),
      targetSat: null,
      fadeSpeed: random(0.005, 0.02),
      swayOffset: random(1000)
    });
  }
}

function branch(len, c, sway ) {
  stroke(c.color);
  strokeWeight(map(len, 0, c.len, 2, 6));
  line(0, 0, 0, -len);
  translate(0, -len);
  rotate(sway);

  if (len > 8) {
    let branches = 3;
    for (let i = 0; i < branches; i++) {
      push();
      let angle = map(i, 0, branches - 1, -c.spread / 2, c.spread / 2);
      rotate(angle + c.baseAngle);
      branch(len * c.scale, c);
      pop();
    }
  } else {
    noStroke();
    fill(c.color);
    ellipse(0, 0, 4, 4);
  }
}

function keyPressed() {
  if (key === ' ') {
    generateCoral();
  }
  if (key === 'g') {
    for (let c of corals) {
      c.targetSat = 0;
    }
  }
}

function mousePressed() {
  userStartAudio();
  for (let i = 0; i < 5; i++) {
    bubbles.push(new Bubble(mouseX, mouseY));
  }
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 40);
    this.speed = random(1, 3);
    this.wobble = random(1000);
  }

  move() {
    this.y -= this.speed;
    this.x += sin(frameCount * 0.05 + this.wobble) * 1.5;
  }

  show() {
    let pixelSize = 4;
    for (let x = -this.size / 2; x < this.size / 2; x += pixelSize) {
      for (let y = -this.size / 2; y < this.size / 2; y += pixelSize) {
        let d = dist(x, y, 0, 0);
        if (d < this.size / 2) {
          fill(220, 30, 100, 65);
          noStroke();
          rect(this.x + x, this.y + y, pixelSize, pixelSize);
        }
      }
    }
  }
}
