function generateCoral() {
  corals = [];
  let count = floor(random(8, 12));

  let zones = [
    { x1: 0,          y1: height - 130, x2: width,        y2: height },
    { x1: 0,          y1: height - 300, x2: width * 0.31, y2: height - 130 },
    { x1: width * 0.76, y1: height - 300, x2: width,      y2: height - 130 }
  ];

  for (let i = 0; i < count; i++) {
    let z = random(zones);
    corals.push({
      x: random(z.x1, z.x2),
      y: random(z.y1, z.y2),
      len: random(80, 90),
      baseAngle: random(-0.2, 0.2),
      scale: random(0.6, 0.6),
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
      y: random(height - 170, height - 50),
      len: random(20, 60),
      swayOffset: random(1000),
      col: color(random(80, 140), random(60, 90), random(40, 70))
    });
  }
}
