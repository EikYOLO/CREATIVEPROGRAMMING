let showStartScreen = true;
let myFont;

function preload() {
  myFont = loadFont('Game.ttf');
  bg = loadImage("Baggrunden.png");
  fish1 = loadImage('tuna1x.png');
  fish2 = loadImage('tuna2x.png');
  clown1 = loadImage('Clown1x.png');
clown2 = loadImage('Clown2x.png');
musik1 = loadSound("musik1.wav");
musik2 = loadSound("musik2.wav");
musik3 = loadSound("musik3.wav");
musik4 = loadSound("musik4.wav");
hjerteImg = loadImage('Hjerte.png');
endsceneBg = loadImage('endscene.png');



 for (let i = 1; i <= 10; i++) {
    maskot[i - 1] = loadImage(`mascot${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  colorMode(HSB, 360, 100, 100, 100);
  generateCoral();
  generateAlgae();
  cursor('net.png', 16, 16);
  
  
    maskotX = 60;
  maskotY = 120;
  sidstePoseSkift = frameCount;
  
  
  //tuna push
  for (let i = 0; i < 5; i++) {
    fishes.push({
      x: random(width),
      y: random(height),
      speed: random(2, 3),
      size: random(0.2, 0.3),
      dir: random([1, -1]) // right or left
    });
  }
  //clownfish push
  for (let i = 0; i < 3; i++) {
  clownfishes.push({
    x: random(width),
    y: random(height),
    speed: random(1, 1.5),
    size: random(0.1, 0.2),
    dir: random([1, -1])
  });
}
  
  


}

function draw() {
  image(bg, 0, 0, width, height);

  if (showStartScreen) {
    tegnStartSkærm();
    return;
  }

fill(0);
noStroke();
textSize(14);
text("FPS: " + floor(frameRate()), 10, 40);

if (gameOver) {
  tegnEndScene();
  return;
}




  opdaterMaskot();
  tegnMaskot();
  opdaterSpredning();
  spawnerBobler();
  opdaterBobler();
  
  
  if (hellig) {
  helligTimer--;
  if (helligTimer <= 0) hellig = false;
}
  
  
  
  // Tjek om en koral er død
for (let c of corals) {
  if (c.health <= 0) {
    gameOver = true;
  }
}



let hjerteSize = 60;
for (let i = 0; i < maxLiv; i++) {
  let x = width - 10 - (maxLiv - i) * (hjerteSize + 5);
  tint(i < liv ? 100 : 30); // lyst = liv, mørkt = mistet
  image(hjerteImg, x, 10, hjerteSize, hjerteSize);
}
noTint();
  
  
  
  
score += 1000 / 600; // 1.667 point per frame = 1000 per 10 sek


// Vis score
fill(0);
noStroke();
textFont(myFont);
textSize(20);
textAlign(LEFT);
text("SCORE: " + floor(score), 10, 60);



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
  let barWidth = 70;
  let barHeight = 10;
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


function branch(len, c, sway) {
  let damage = 1 - c.health / c.maxHealth;
  let h = hue(c.color);
  let s = saturation(c.color);
  let b = brightness(c.color);

  let damagedColor = color(
    h,
    lerp(s, 20, damage),
    lerp(b, 95, damage)
  );

  let pixelSize = 4;
  let sw = map(len, 0, c.len, 2, 6);
  let halvPixel = max(sw, pixelSize) / 2;

  noStroke();
  fill(damagedColor);

  // Tegn rects langs linjen fra (0,0) til (0,-len)
  for (let y = 0; y > -len; y -= pixelSize) {
    rect(-halvPixel, y, halvPixel * 2, pixelSize);
  }

  translate(0, -len);
  rotate(sway);

  if (len > 12) {
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
    rect(-halvPixel, -halvPixel, halvPixel * 2, halvPixel * 2);
  }
}

function tegnStartSkærm() {
  let bx = width / 2 - 650;
  let by = height / 2 - 250;
  fill(255, 226, 36);
  stroke(0);
  strokeWeight(2);
  rect(bx, by, 1300, 500, 10);

  fill(0, 0, 100, 100);
  noStroke();
  textFont(myFont);
  textAlign(CENTER, CENTER);

  textSize(17);
  text("Save the corals by catching the sunscreen with your net!", width / 2, by + 50);
  text("You use the net by left-clicking the mouse", width / 2, by + 100);
  text("Avoid the fish with your net or loose a life", width / 2, by + 150);
    text("If a coral is hit by the sunscreen it takes damage.", width / 2, by + 200);
  textSize(30);
    text("If a coral dies, or you run out of life", width / 2, by + 250);
    text("IT IS GAME OVER", width / 2, by + 300);
  text("Press ENTER to play", width / 2, by +450);
}

function skiftMusik(pose) {
  let nyMusik = [musik1, musik2, musik3, musik4][pose];
  if (aktivMusik && aktivMusik.isPlaying()) {
    aktivMusik.stop();
  }
  aktivMusik = nyMusik;
  aktivMusik.setVolume(1);
  aktivMusik.loop();
}

function tegnEndScene() {
  image(endsceneBg, 0, 0, width, height);
  
  if (score > highScore) highScore = score;

  fill(0, 0, 100, 100);
  noStroke();
  textFont(myFont);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("BEST: " + floor(highScore), width / 2 + 400, height / 2 + 300);
  textSize(40);
  text("Press ENTER to try again", width / 2 + 400, height / 2 + 400);
    text("results won't vary", width / 2 + 400, height / 2 + 500);

  
  fill(0, 100, 0, 100);
    noStroke();
  textFont(myFont);
  textAlign(CENTER, CENTER);
   textSize(30);
   text("I killed the coral, killed the reef", width / 2 - 30, height / 2 - 400);
     text("now dead fish drift beneath the sea.", width / 2 - 30, height / 2 - 300);
       text("You tried to stop me, block my way", width / 2 - 30, height / 2 - 200);
       text("too bad I’m here to stay.", width / 2 - 30, height / 2 - 100);
       textSize(40);
       text("I. AM. INEVITABLE. MUHAHA", width / 2 - 30, height / 2 + 10);

}

function keyPressed() {
  if (keyCode === ENTER) {
    userStartAudio();
    if (showStartScreen) {
      showStartScreen = false;
      skiftMusik(0);
      return;
    }
    if (gameOver) {
      gameOver = false;
      showStartScreen = false;
      maskotX = 60;
      maskotY = 120;
      nuværendePose = 0;
      sidstePoseSkift = frameCount;
      sidstePose = false;
      retning = 1;
      bobler = [];
      spawnHastighed = 0.001;
      spredningsVinkel = 30;
      spawnRadius = 15;
      score = 0;        
      scoreTimer = 0; 
      skiftMusik(0);
      generateCoral();
      generateAlgae();
      liv = 5;
      hellig = false;
helligTimer = 0;
    }
  }

  if (key === ' ') {
    if (!showStartScreen && !gameOver) {
      generateCoral();
      generateAlgae();
    }
  }
}


function mousePressed() {
  userStartAudio();

  
}


function mouseClicked() {
  let ramteBoble = false;
  for (let i = bobler.length - 1; i >= 0; i--) {
    if (dist(mouseX, mouseY, bobler[i].x, bobler[i].y) < bobler[i].størrelse / 2) {
      bobler.splice(i, 1);
      ramteBoble = true;
    }
  }
  if (!ramteBoble) {
    for (let i = 0; i < 2; i++) {
      bubbles.push(new Bubble(mouseX, mouseY));
    }
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
