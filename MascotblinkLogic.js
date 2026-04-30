// ============================================================
// SOLCREME-MASKOT MED BOBLER


// --- Maskot ---
let maskot = [];               // 10 separate billedfiler
let åbneIndeks = [0,2,4,6,8]; // Billeder med åbne øjne  (mascot1,3,5,7,9)
let lukkedeIndeks = [1,3,5,7,9]; // Billeder med lukkede øjne (mascot2,4,6,8,10)
let maskotX, maskotY;
let retning = 1;               // 1 = mod højre, -1 = mod venstre
let hastighed = 1.8;
let floatOffset = 0;           // Til den bløde svæve-animation

// --- Animation ---
let nuværendePose = 0;         // Hvilken åben pose vises (0..4)
let sidstePoseSkift = 0;       // Hvornår skiftede vi sidst pose
let poseTakt = 20;             // Frames mellem hvert poseskift

// --- Blink ---
let blinker = false;
let blinkTæller = 0;           // Tæller ned mens maskotten blinker

// --- Bobler ---
let bobler = [];
let spawnHastighed = 0.08;     // Start: få bobler per frame
let maxSpawn = 0.45;           // Maks: mange bobler per frame
let spredningsVinkel = 30;     // Grader — stiger til 120 over tid
let spawnRadius = 15;          // Radius bobler opstår inden for

// ============================================================
// INDLÆS BILLEDER — tilføj til din eksisterende preload()
// ============================================================
function preload() {
  for (let i = 1; i <= 10; i++) {
    maskot[i - 1] = loadImage(`mascot${i}.png`);
  }
}

// ============================================================
// OPSÆTNING — tilføj til din eksisterende setup()
// ============================================================
function setup() {
  maskotX = 60;
  maskotY = 120;
  sidstePoseSkift = frameCount;
}

// ============================================================
// HOVED-LØKKE — kald disse fra din eksisterende draw()
// ============================================================
function draw() {
  opdaterMaskot();
  tegnMaskot();
  opdaterSpredning();
  spawnerBobler();
  opdaterBobler();
}

// ============================================================
// MASKOT — BEVÆGELSE
// ============================================================
function opdaterMaskot() {
  // Flyt maskotten vandret
  maskotX += hastighed * retning;

  // Vend om ved kanterne
  if (maskotX > width - 60) {
    maskotX = width - 60;
    retning = -1;
  } else if (maskotX < 60) {
    maskotX = 60;
    retning = 1;
  }

  // Blød svæve-animation op og ned
  floatOffset = sin(frameCount * 0.03) * 6;

  // Skift pose hvert poseTakt-te frame
  if (frameCount - sidstePoseSkift > poseTakt) {
    nuværendePose = (nuværendePose + 1) % åbneIndeks.length;
    sidstePoseSkift = frameCount;
  }

  // Blink tilfældigt (~5% chance per frame)
  if (!blinker && random(1) < 0.005) {
    blinker = true;
    blinkTæller = 6; // Blinket varer 6 frames (~0.2 sek)
  }
  if (blinker) {
    blinkTæller--;
    if (blinkTæller <= 0) blinker = false;
  }
}

// ============================================================
// MASKOT — TEGNING
// ============================================================
function tegnMaskot() {
  // Vælg billede: lukket øje hvis vi blinker, ellers åbent øje
  let billedIndeks = blinker ? lukkedeIndeks[nuværendePose] : åbneIndeks[nuværendePose];
  let billede = maskot[billedIndeks];

  if (billede) {
    push();
    imageMode(CENTER);
    translate(maskotX, maskotY + floatOffset);
    scale(retning === 1 ? 1 : -1, 1); // Vend sprite vandret ved retningsskift
    image(billede, 0, 0, 200, 200);
    pop();
  } else {
    // Fallback: simpel fisk hvis billedet ikke er indlæst
    tegnSimplFisk();
  }
}

function tegnSimplFisk() {
  push();
  translate(maskotX, maskotY + floatOffset);
  scale(retning === 1 ? 1 : -1, 1);
  fill(45, 85, 92);
  noStroke();
  ellipse(0, 0, 48, 52);
  fill(0, 0, 0);
  ellipse(-13, -9, 5, 6);
  ellipse(13, -9, 5, 6);
  pop();
}

// ============================================================
// BOBLER — SPREDNING OG SPAWN
// ============================================================
function opdaterSpredning() {
  // Øg langsomt spredning over tid
  spawnHastighed = min(spawnHastighed + 0.004, maxSpawn);
  spredningsVinkel = min(spredningsVinkel + 0.15, 120);
  spawnRadius = min(spawnRadius + 0.08, 45);
}

function spawnerBobler() {
  if (random(1) < spawnHastighed) {
    let antal = floor(random(1, 3));
    for (let i = 0; i < antal; i++) {
      spawnEnBoble();
    }
  }
}

function spawnEnBoble() {
  let vinkel = random(TWO_PI);
  let radius = random(5, spawnRadius);
  let startX = maskotX + cos(vinkel) * radius;
  let startY = maskotY + floatOffset + sin(vinkel) * radius - 10;
  let xFart = random(-1.2, 1.2) * (spredningsVinkel / 60);

  bobler.push(new Boble(startX, startY, xFart));
}

function opdaterBobler() {
  for (let i = bobler.length - 1; i >= 0; i--) {
    let b = bobler[i];
    b.bevæg();
    b.tegn();

    // Fjern boblen hvis den er uden for skærmen
    if (b.y > height + 50 || b.y < -50 || b.x < -50 || b.x > width + 50) {
      bobler.splice(i, 1);
    }
  }
}

// ============================================================
// BOBLE-KLASSE
// ============================================================
class Boble {
  constructor(x, y, xFart = 0) {
    this.x = x;
    this.y = y;
    this.størrelse = random(5, 14);
    this.fart = random(1.2, 3.5);
    this.xFart = xFart;
    this.svajer = random(1000);  // Til tilfældig svajen
    this.spor = [];              // Hale (de sidste 4 positioner)
    this.rotation = random(TWO_PI);
  }

  bevæg() {
    this.spor.push({ x: this.x, y: this.y });
    if (this.spor.length > 4) this.spor.shift();

    this.y += this.fart;
    this.x += this.xFart + sin(frameCount * 0.07 + this.svajer) * 0.8;
    this.rotation += 0.05;
  }

  tegn() {
    // Hale
    for (let i = 0; i < this.spor.length; i++) {
      let alpha = map(i, 0, this.spor.length, 60, 20);
      noFill();
      stroke(55, 80, 100, alpha);
      strokeWeight(1.5);
      ellipse(this.spor[i].x, this.spor[i].y, this.størrelse * 0.6);
    }

    // Boble
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    noFill();
    stroke(55, 85, 100, 230);
    strokeWeight(2);
    ellipse(0, 0, this.størrelse);

    // Highlight
    stroke(55, 90, 100, 180);
    ellipse(-2, -2, this.størrelse * 0.3);
    pop();
  }
}
