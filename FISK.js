function updateFish(f, i, currentFish) {
  f.x += f.speed * f.dir;

  for (let j = 0; j < fishes.length; j++) {
    if (i === j) continue;
    let other = fishes[j];
    let d = dist(f.x, f.y, other.x, other.y);
    if (d < 80) {
      f.y += (f.y - other.y) * 0.05;
    }
  }

  let fishW = currentFish.width * f.size;
  let fishH = currentFish.height * f.size;
  let yOffset = sin(frameCount * 0.1 + i) * 10;

  let drawX = f.x - fishW / 2;
  let drawY = f.y + yOffset - fishH / 2;

  if (
    mouseX > drawX && mouseX < drawX + fishW &&
    mouseY > drawY && mouseY < drawY + fishH
  ) {
    gameOver = true;
  }

  push();
  translate(f.x, f.y + yOffset);
  scale(-f.dir, 1);
  image(currentFish, -fishW / 2, -fishH / 2, fishW, fishH);
  pop();

  if (f.dir === 1 && f.x > width) {
    f.x = -fishW;
    f.y = random(height);
  } else if (f.dir === -1 && f.x < -fishW) {
    f.x = width;
    f.y = random(height);
  }
}
