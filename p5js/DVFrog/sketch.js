const G = new Object(null);
G.frogsize = 100;
G.pps = 75;

function preload() {
  G.frog = loadImage('pinkfrog.png');
}

function setup() {
  G.frog.resize(G.frogsize, 0);
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  G.frogx = 0;
  G.frogy = 10;
  G.frogdx = G.pps;
  G.frogdy = G.pps;
  G.lastframe = millis();
}

function draw() {
  background(0);
  let t = millis();
  let e = (t - G.lastframe)/1000;
  G.lastframe = t;
  
  G.frogx += G.frogdx * e;
  G.frogy += G.frogdy * e;
  if (G.frogx > width - G.frog.width) {
    G.frogx = 2 * (width - G.frog.width) - G.frogx;
    G.frogdx = -G.pps;
  }
  if (G.frogx < 0) {
    G.frogx = -G.frogx;
    G.frogdx = G.pps;
  }
  if (G.frogy > height - G.frog.height) {
    G.frogy = 2 * (height - G.frog.height) - G.frogy;
    G.frogdy = -G.pps;
  }
  if (G.frogy < 0) {
    G.frogy = -G.frogy;
    G.frogdy = G.pps;
  }
  image(G.frog, G.frogx, G.frogy);
}