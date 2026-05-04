//coralfunktion
function generateCoral() {
  corals = [];
  let count = floor(random(4, 9));
  
  // De tre gyldige områder
  let zones = [
    { x1: 1,    y1: 670, x2: 1325, y2: 800 },
    { x1: 0,    y1: 500, x2: 406,  y2: 670 },
    { x1: 1000, y1: 500, x2: 1325, y2: 670 }
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
      swayOffset: random(1000),
      health: 5,
      maxHealth: 5
    });
  }
}



function generateAlgae() {
  algae = [];
  let count = floor(random(8, 15));
  for (let i = 0; i < count; i++) {
    algae.push({
      x: random(width),
      y: random(630, 750),
      len: random(20, 60),
      swayOffset: random(1000),
      col: color(random(80, 140), random(60, 90), random(40, 70))
    });
  }
}
