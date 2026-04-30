let bubbles = [];
let corals = [];
let dust = [];
let algae = [];
let fishes = [];
let clownfishes = [];
let fish1, fish2;
let clown1, clown2;
let bgsound;
let bg;

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
let spawnHastighed = 0.03;     // Start: få bobler per frame
let maxSpawn = 0.06;           // Maks: mange bobler per frame
let spredningsVinkel = 30;     // Grader — stiger til 120 over tid
let spawnRadius = 15;          // Radius bobler opstår inden for
