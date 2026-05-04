function updateFish(f, i, currentFish) {
  // move fish
  f.x += f.speed * f.dir;

  // hold afstand fra andre fisk
  for (let j = 0; j < fishes.length; j++) {
    if (i === j) continue;
    let other = fishes[j];
    let d = dist(f.x, f.y, other.x, other.y);
    if (d < 80) {
      f.y += (f.y - other.y) * 0.05;
    }
  }

  // wave motion
  let yOffset = sin(frameCount * 0.1 + i) * 10;

  // tegn fisk
  push();
  translate(f.x, f.y + yOffset);
  scale(-f.dir, 1);
  image(currentFish, 0, 0, currentFish.width * f.size, currentFish.height * f.size);
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
