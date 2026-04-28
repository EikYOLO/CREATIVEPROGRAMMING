let mascot = [];        // array of 10 images
let openIndices = [0,2,4,6,8];   // correspond to your 1,3,5,7,9
let closedIndices = [1,3,5,7,9]; // correspond to your 2,4,6,8,10

let currentPose = 0;    // which open pose we're showing (0..4)
let isBlinking = false;
let blinkTimer = 0;
let lastPoseChange = 0;

function preload() {
  // Load images: mascot1.png, mascot2.png, ... mascot10.png
  for (let i = 1; i <= 10; i++) {
    mascot[i-1] = loadImage(`mascot${i}.png`);
  }
}

function setup() {
  createCanvas(400, 400);
  frameRate(30);
  // Change pose every 20 frames (you can adjust speed)
  lastPoseChange = frameCount;
}

function draw() {
  background(220);
  
  // 1. Update which open pose to show (simple cycling)
  if (frameCount - lastPoseChange > 20) {
    currentPose = (currentPose + 1) % openIndices.length;
    lastPoseChange = frameCount;
  }
  
  // 2. Blink logic: every ~2 seconds, blink for 0.1 seconds
  if (!isBlinking && random(1) < 0.005) {   // ~5% chance each frame = about twice per second at 30fps
    isBlinking = true;
    blinkTimer = 6;   // blink lasts 6 frames (~0.2 sec at 30fps)
  }
  
  if (isBlinking) {
    blinkTimer--;
    if (blinkTimer <= 0) {
      isBlinking = false;
    }
  }
  
  // 3. Choose which image to display
  let imgIndex;
  if (isBlinking) {
    // Blink: use the closed‑eye version of the current pose
    imgIndex = closedIndices[currentPose];
  } else {
    // Normal: open‑eye version
    imgIndex = openIndices[currentPose];
  }
  
  // 4. Draw the selected mascot frame
  image(mascot[imgIndex], 100, 100, 200, 200);
}
