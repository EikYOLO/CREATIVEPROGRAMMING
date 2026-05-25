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
let gameOver = false;
let musik1, musik2, musik3, musik4;
let aktivMusik = null;
let endsceneBg;
 



// SUNSCREEN MASCOT LETS

// Mascot
let maskot = [];               // 10 separate billedfiler
let åbneIndeks = [0,2,4,6,8]; // Billeder med åbne øjne  (mascot1,3,5,7,9)
let lukkedeIndeks = [1,3,5,7,9]; // Billeder med lukkede øjne (mascot2,4,6,8,10)
let maskotX, maskotY;
let retning = 1;               // 1 = mod højre, -1 = mod venstre
let hastighed = 1.8;
let floatOffset = 0;           // Til den bløde svæve-animation

// Animation
let nuværendePose = 0;         // Hvilken åben pose vises (0..4)
let sidstePoseSkift = 0;       // Hvornår skiftede vi sidst pose
let poseTakt = 1800;             // Frames mellem hvert poseskift

// Blinking
let blinker = false;
let blinkTæller = 0;           // Tæller ned mens maskotten blinker

// Bubbles
let bobler = [];
let spawnHastighed = 0.001;     // Start: få bobler per frame
let maxSpawn = 0.05;           // Maks: mange bobler per frame
let spredningsVinkel = 30;     // Grader — stiger til 120 over tid
let spawnRadius = 15;          // Radius bobler opstår inden for
let sidstePose = false; // True når maskotten er pose 4


//scorecounter
let score = 0;
let highScore = 0;
let scoreTimer = 0;

//hp
let liv = 3;
let maxLiv = 3;

//billede
let hjerteImg;

//hellig
let hellig = false;
let helligTimer = 0;
