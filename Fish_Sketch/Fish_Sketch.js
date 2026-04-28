let fish1, fish2;
let fishes = [];

function preload() {
  fish1 = loadImage('tuna1x.png');
  fish2 = loadImage('tuna2x.png');
}

function setup() {
  createCanvas(900, 900);

  // create 5 fish
  for (let i = 0; i < 5; i++) {
    fishes.push({
      x: random(width),
      y: random(height),
      speed: random(1, 4),
      size: random(0.2, 0.5),
      dir: random([1, -1]) // 1 = right, -1 = left
    });
  }
}

function draw() {
  background(100, 180, 255);

  // animation frame
  let currentFish = (frameCount % 20 < 10) ? fish1 : fish2;

  for (let i = 0; i < fishes.length; i++) {
    let f = fishes[i];

    // move fish
    f.x += f.speed * f.dir;

    // wave motion
    let yOffset = sin(frameCount * 0.1 + i) * 10;

    push();

    translate(f.x, f.y + yOffset);

   
    scale(-f.dir, 1);

    image(
      currentFish,
      0,
      0,
      currentFish.width * f.size,
      currentFish.height * f.size
    );

    pop();

    // wrap around screen
    if (f.dir === 1 && f.x > width) {
      f.x = -currentFish.width * f.size;
      f.y = random(height);
    } else if (f.dir === -1 && f.x < -currentFish.width * f.size) {
      f.x = width;
      f.y = random(height);
    }
  }
}
