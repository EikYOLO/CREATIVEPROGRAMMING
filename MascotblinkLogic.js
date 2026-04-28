// ============================================================
// KORALREV MED SOLCREME-BOBLER
// Maskot bevæger sig automatisk frem og tilbage
// Bobler affarver koraller over tid
// ============================================================

let koraller = [];  // Liste over alle koraller
let bobler = [];    // Liste over alle aktive bobler

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

// --- Boble-spredning (stiger automatisk over tid) ---
let spawnHastighed = 0.08;
let maxSpawn = 0.45;
let spredningsVinkel = 30;  // Grader — stiger til 120 over tid
let spawnRadius = 15;       // Radius bobler opstår inden for

// --- Farve-effekter ---
let afblegningsMængde = 10;  // Hvor meget en boble affarver en koral
let genopretningsMængde = 8; // Hvor meget et klik gendanner farven

// ============================================================
// INDLÆS BILLEDER
// ============================================================
function preload() {
  // Indlæs 10 billedfiler: mascot1.png, mascot2.png, ... mascot10.png
  for (let i = 1; i <= 10; i++) {
    maskot[i - 1] = loadImage(`mascot${i}.png`);
  }
}

// ============================================================
// OPSÆTNING (kører én gang)
// ============================================================
function setup() {
  createCanvas(500, 800);
  colorMode(HSB, 360, 100, 100);
  genererKoraller();

  maskotX = 60;      // Start øverst til venstre
  maskotY = 120;
  sidstePoseSkift = frameCount; // Nulstil pose-timer
}

// ============================================================
// HOVED-LØKKE (kører ~60 gange i sekundet)
// ============================================================
function draw() {
  tegnOceanbaggrund();
  tegnLysstraaler();
  tegnSandbund();
  tegnAlleKoraller();
  opdaterMaskot();
  tegnMaskot();
  opdaterSpredning();
  spawnerBobler();
  opdaterBobler();
  tegnUI();
  tegnMåler();
}

// ============================================================
// BAGGRUND
// ============================================================
function tegnOceanbaggrund() {
  // Tegn en gradient fra mørkeblå øverst til mørk nedenunder
  for (let i = 0; i <= height; i += 2) {
    let t = map(i, 0, height, 0, 1);
    stroke(200, lerp(65, 45, t), lerp(55, 40, t));
    line(0, i, width, i);
  }
}

function tegnLysstraaler() {
  push();
  blendMode(ADD);
  for (let i = 0; i < 8; i++) {
    let rayX = width / 2 + sin(frameCount * 0.01 + i) * 80;
    stroke(55, 30, 90, 25);
    strokeWeight(15);
    line(rayX, 0, rayX + random(-20, 20), height * 0.4);
  }
  blendMode(BLEND);
  pop();
}

function tegnSandbund() {
  fill(30, 25, 28);
  noStroke();
  rect(0, height - 40, width, 40);

  // Sten og grus
  fill(35, 30, 35);
  for (let i = 0; i < 60; i++) {
    ellipse(random(width), random(height - 38, height - 3), random(1, 3));
  }
  fill(25, 20, 25);
  for (let i = 0; i < 12; i++) {
    ellipse(random(width), height - 38 + random(-5, 5), random(4, 10), random(3, 7));
  }
}

// ============================================================
// MASKOT — BEVÆGELSE OG TEGNING
// ============================================================
function opdaterMaskot() {
  // Flyt maskotten vandret
  maskotX += hastighed * retning;

  // Vend om ved kanterne (ingen eksplosion — bare retningsskift)
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

  // Blink tilfældigt (~5% chance per frame = ca. 2 gange i sekundet ved 30fps)
  if (!blinker && random(1) < 0.005) {
    blinker = true;
    blinkTæller = 6; // Blinket varer 6 frames (~0.2 sek)
  }
  if (blinker) {
    blinkTæller--;
    if (blinkTæller <= 0) blinker = false;
  }
}

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
    // Fallback: tegn en simpel fisk hvis billedet ikke er indlæst
    tegnSimplFisk();
  }
}

function tegnSimplFisk() {
  push();
  translate(maskotX, maskotY + floatOffset);
  scale(retning === 1 ? 1 : -1, 1);
  fill(45, 85, 92);
  noStroke();
  ellipse(0, 0, 48, 52);  // Krop
  fill(0, 0, 0);
  ellipse(-13, -9, 5, 6); // Venstre øje
  ellipse(13, -9, 5, 6);  // Højre øje
  pop();
}

// ============================================================
// BOBLER — SPREDNING OG SPAWN
// ============================================================
function opdaterSpredning() {
  // Øg langsomt antallet af bobler og deres spredning over tid
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
  // Tilfældig startposition tæt på maskotten
  let vinkel = random(TWO_PI);
  let radius = random(5, spawnRadius);
  let startX = maskotX + cos(vinkel) * radius;
  let startY = maskotY + floatOffset + sin(vinkel) * radius - 10;

  // Tilfældig vandret hastighed (mere spredning over tid)
  let xFart = random(-1.2, 1.2) * (spredningsVinkel / 60);

  bobler.push(new Boble(startX, startY, xFart));
}

// ============================================================
// KORALLER
// ============================================================
function genererKoraller() {
  koraller = [];

  // Nulstil spredning
  spawnHastighed = 0.08;
  spredningsVinkel = 30;
  spawnRadius = 15;

  let antal = floor(random(5, 10));
  for (let i = 0; i < antal; i++) {
    let farve = color(random(0, 360), random(60, 100), random(70, 100));
    koraller.push({
      x: random(40, width - 40),
      y: height - 40,
      længde: random(35, 65),
      grundvinkel: random(-0.25, 0.25),
      skala: random(0.6, 0.75),
      spredning: radians(random(85, 105)),
      farve: farve,
      originalMætning: saturation(farve),
      målMætning: null,    // null = ingen aktiv farveændring
      fadeHastighed: random(0.008, 0.025)
    });
  }
}

function tegnAlleKoraller() {
  for (let k of koraller) {
    // Glid gradvist mod målMætning hvis den er sat
    if (k.målMætning !== null) {
      let h = hue(k.farve);
      let s = saturation(k.farve);
      let b = brightness(k.farve);
      s = lerp(s, k.målMætning, k.fadeHastighed);
      k.farve = color(h, s, b);
      if (abs(s - k.målMætning) < 0.5) k.målMætning = null;
    }

    push();
    translate(k.x, k.y);
    tegnGren(k.længde, k);
    pop();
  }
}

function tegnGren(længde, koral) {
  stroke(koral.farve);
  strokeWeight(map(længde, 0, koral.længde, 2, 7));
  line(0, 0, 0, -længde);
  translate(0, -længde);

  if (længde > 8) {
    // Del op i 3 undergrene
    for (let i = 0; i < 3; i++) {
      push();
      let vinkel = map(i, 0, 2, -koral.spredning / 2, koral.spredning / 2);
      rotate(vinkel + koral.grundvinkel);
      tegnGren(længde * koral.skala, koral);
      pop();
    }
  } else {
    // Tegn en lille cirkel ved spidsen
    noStroke();
    fill(koral.farve);
    ellipse(0, 0, 5, 5);
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
    this.fart = random(1.2, 3.5);   // Falder nedad
    this.xFart = xFart;
    this.svajer = random(1000);     // Til tilfældig svajen
    this.landed = false;            // Har boblen ramt en koral?
    this.spor = [];                 // Hale (de sidste 4 positioner)
    this.rotation = random(TWO_PI);
  }

  bevæg() {
    // Gem position til hale
    this.spor.push({ x: this.x, y: this.y });
    if (this.spor.length > 4) this.spor.shift();

    // Fald ned med vandret svajen
    this.y += this.fart;
    this.x += this.xFart + sin(frameCount * 0.07 + this.svajer) * 0.8;
    this.rotation += 0.05;
  }

  tegn() {
    // Tegn halen
    for (let i = 0; i < this.spor.length; i++) {
      let alpha = map(i, 0, this.spor.length, 60, 20);
      noFill();
      stroke(55, 80, 100, alpha);
      strokeWeight(1.5);
      ellipse(this.spor[i].x, this.spor[i].y, this.størrelse * 0.6);
    }

    // Tegn selve boblen
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    noFill();
    stroke(55, 85, 100, 230);
    strokeWeight(2);
    ellipse(0, 0, this.størrelse);

    // Lille hvid highlight
    stroke(55, 90, 100, 180);
    ellipse(-2, -2, this.størrelse * 0.3);
    pop();
  }
}

// ============================================================
// OPDATER ALLE BOBLER
// ============================================================
function opdaterBobler() {
  for (let i = bobler.length - 1; i >= 0; i--) {
    let b = bobler[i];
    b.bevæg();
    b.tegn();

    // Tjek om boblen rammer en koral
    if (!b.landed) {
      for (let koral of koraller) {
        let d = dist(b.x, b.y, koral.x, koral.y);
        if (d < koral.længde * 1.5) {
          // Affarv korallen lidt
          let nyMætning = max(0, saturation(koral.farve) - afblegningsMængde);
          koral.målMætning = nyMætning;
          b.landed = true;
          break;
        }
      }
    }

    // Fjern boblen hvis den er uden for skærmen
    if (b.y > height + 50 || b.y < -50 || b.x < -50 || b.x > width + 50) {
      bobler.splice(i, 1);
    }
  }
}

// ============================================================
// BRUGERGRÆNSEFLADE
// ============================================================
function tegnUI() {
  fill(0, 0, 100);
  noStroke();
  textSize(11);
  textAlign(LEFT);
  text("🐠 Maskot bevæger sig automatisk frem og tilbage", 10, 25);
  text("🖱️ Klik på bobler → gendan koralfarve", 10, 42);
  text("🎮 [R] Nyt rev  [G] Afbleg alt  [SPACE] Boblestorm", 10, 59);

  textSize(9);
  textAlign(RIGHT);
  text("Bobler: " + bobler.length, width - 10, height - 10);
  textAlign(LEFT);
}

function tegnMåler() {
  let fremgang = map(spawnHastighed, 0.08, maxSpawn, 0, 1);

  // Baggrund
  fill(0, 0, 20, 180);
  noStroke();
  rect(10, 80, 150, 12, 6);

  // Fyldt del
  let fyldFarve = color(map(fremgang, 0, 1, 55, 30), 100, 100);
  fill(fyldFarve);
  rect(12, 82, 146 * fremgang, 8, 4);

  // Tekst
  fill(0, 0, 100);
  textSize(10);
  textAlign(LEFT);
  text("🌊 SPREDNING", 10, 77);
  textAlign(RIGHT);
  text(floor(fremgang * 100) + "%", 160, 77);
  textAlign(LEFT);
}

// ============================================================
// MUS OG TASTATUR
// ============================================================
function mousePressed() {
  // Klik på en boble → fjern den og gendan koralfarve lidt
  for (let i = bobler.length - 1; i >= 0; i--) {
    let b = bobler[i];
    if (dist(mouseX, mouseY, b.x, b.y) < b.størrelse / 2 + 6) {
      // Find nærmeste koral inden for rækkevidde
      for (let koral of koraller) {
        let d = dist(b.x, b.y, koral.x, koral.y);
        if (d < koral.længde * 1.5) {
          let nuværendeMætning = saturation(koral.farve);
          koral.målMætning = min(koral.originalMætning, nuværendeMætning + genopretningsMængde);
          break;
        }
      }
      bobler.splice(i, 1);
      break;
    }
  }
}

function mouseDragged() {
  mousePressed();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    genererKoraller();  // Nyt rev + nulstil spredning
    bobler = [];
  }
  if (key === 'g' || key === 'G') {
    for (let k of koraller) k.målMætning = 0;  // Afbleg alle koraller
  }
  if (key === ' ') {
    // Manuel boblestorm
    for (let i = 0; i < 15; i++) spawnEnBoble();
  }
}
