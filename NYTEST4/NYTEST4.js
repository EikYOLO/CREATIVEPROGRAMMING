


function preload() {
  bg = loadImage("Baggrunden.png");
  bgsound = loadSound("musikto.wav");
  fish1 = loadImage('tuna1x.png');
  fish2 = loadImage('tuna2x.png');
  clown1 = loadImage('Clown1x.png');
clown2 = loadImage('Clown2x.png');

 for (let i = 1; i <= 10; i++) {
    maskot[i - 1] = loadImage(`mascot${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  generateCoral();
  generateAlgae();
  
    maskotX = 60;
  maskotY = 120;
  sidstePoseSkift = frameCount;
  
  
  //tunfiskeskub
  for (let i = 0; i < 5; i++) {
    fishes.push({
      x: random(width),
      y: random(height),
      speed: random(2, 3),
      size: random(0.2, 0.3),
      dir: random([1, -1]) // 1 = right, -1 = left
    });
  }
  //klovnfisk skub
  for (let i = 0; i < 3; i++) {
  clownfishes.push({
    x: random(width),
    y: random(height),
    speed: random(1, 1.5),
    size: random(0.1, 0.2),
    dir: random([1, -1])
  });
}
  
  
  //bg sounds setup
  bgsound.setVolume(1);
bgsound.loop();
}

function draw() {
  image(bg, 0, 0, width, height);



  opdaterMaskot();
  tegnMaskot();
  opdaterSpredning();
  spawnerBobler();
  opdaterBobler();


// sunbeams in HSB
noStroke();
for (let i = 0; i < 3; i++) {
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
    let sway = c.health > 0 ? sin(frameCount * 0.02 + c.swayOffset) * 0.05 : 0;
    branch(c.len, c, sway);
    pop();
    
    drawHealthBar(c);
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
  
  for (let a of algae) {
  let sway = sin(frameCount * 0.01 + a.swayOffset) * 0.3;
  stroke(a.col);
  strokeWeight(3);
  push();
  translate(a.x, a.y);
  rotate(sway);
  line(0, 0, 0, -a.len);
  pop();
}
  
  
  //UPDATE FISK
let currentFish = (frameCount % 20 < 10) ? fish1 : fish2;
for (let i = 0; i < fishes.length; i++) {
  updateFish(fishes[i], i, currentFish);
}
  
  //UPDATE KLOVNFISK
  let currentClown = (frameCount % 20 < 10) ? clown1 : clown2;
for (let i = 0; i < clownfishes.length; i++) {
  updateFish(clownfishes[i], i, currentClown);
}
  
  
  
 

}



function drawHealthBar(c) {
  let barWidth = 45;
  let barHeight = 6;
  let x = c.x - barWidth / 2;
  let y = c.y + 12;

  noStroke();
  fill(0, 0, 20, 70);
  rect(x, y, barWidth, barHeight);

  let healthPercent = c.health / c.maxHealth;

  if (healthPercent > 0.6) {
    fill(120, 80, 80);
  } else if (healthPercent > 0.3) {
    fill(50, 90, 90);
  } else {
    fill(0, 80, 90);
  }

  rect(x, y, barWidth * healthPercent, barHeight);
}


function branch(len, c, sway ) {
  let damage = 1 - c.health / c.maxHealth;

  let h = hue(c.color);
  let s = saturation(c.color);
  let b = brightness(c.color);

  let damagedColor = color(
    h,
    lerp(s, 20, damage),
    lerp(b, 95, damage)
  );

  stroke(damagedColor);
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
    fill(damagedColor);
    ellipse(0, 0, 4, 4);
  }
}

function keyPressed() {
  if (key === ' ') {
    generateCoral();
    generateAlgae();
  }
}

function mousePressed() {
  userStartAudio();

  for (let c of corals) {
    let d = dist(mouseX, mouseY, c.x, c.y - c.len);

    if (d < c.len * 1.5 && c.health > 0) {
      c.health--;

      for (let i = 0; i < 8; i++) {
        dust.push({
          x: c.x + random(-25, 25),
          y: c.y - random(0, c.len * 2),
          size: random(2, 5),
          speed: random(0.2, 0.8),
          wobble: random(1000),
          alpha: random(40, 80)
        });
      }

      return;
    }
  }

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
