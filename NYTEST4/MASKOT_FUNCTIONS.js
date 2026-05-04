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

  if (random(1) < 0.003) {
    retning *= -1;
  }


  // Blød svæve-animation op og ned
  floatOffset = sin(frameCount * 0.08) * 6;

  // Skift pose hvert poseTakt-te frame
  if (frameCount - sidstePoseSkift > poseTakt && !sidstePose) {
    if (nuværendePose < åbneIndeks.length - 1) {
      nuværendePose++;          // Gå én pose frem
      sidstePoseSkift = frameCount;
    } else {
      sidstePose = true;        // Sidste pose nået — stop her
    }
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
  // Spredning styres nu udelukkende af hvilken pose maskotten er på (0..4)
  // Pose 0 = meget få partikler, Pose 4 = maks partikler
  let poseAndel = nuværendePose / 4; // 0.0 → 1.0

  spawnHastighed   = lerp(0.01, maxSpawn, poseAndel);
  spredningsVinkel = lerp(15, 120, poseAndel);
  spawnRadius      = lerp(8, 45, poseAndel);
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


  if (mouseIsPressed && dist(mouseX, mouseY, b.x, b.y) < b.størrelse / 2) {
      bobler.splice(i, 1);
      continue;
    }



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
    this.størrelse = random(20, 30);
    this.fart = random(0.5, 1.5);
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
    push();
    translate(this.x, this.y);

    // Cremet hvid plet — uregelmæssig form med noise
    noStroke();
    for (let i = 0; i < 3; i++) {
      let wobbleX = sin(frameCount * 0.05 + this.svajer + i) * 2;
      let wobbleY = cos(frameCount * 0.05 + this.svajer + i) * 1.5;
      fill(40, 15, 100, 55 - i * 12); // Cremet hvid, fader udad
      ellipse(
        wobbleX,
        wobbleY,
        this.størrelse * (1 - i * 0.2),
        this.størrelse * 0.6 * (1 - i * 0.15)
      );
    }

    // Lille blank glans øverst til venstre
    fill(0, 0, 100, 80);
    ellipse(-this.størrelse * 0.2, -this.størrelse * 0.2, this.størrelse * 0.2, this.størrelse * 0.15);

    pop();
  }
}
