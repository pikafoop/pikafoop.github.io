const G = new Object(null);

G.message = "  HAPPY BIRTHDAY PANDORA!!!  ";
G.pastel = 255*.5;
G.blockspacing = 1.0;
G.pps = 100;

function randomPastel() {
  let r = random(G.pastel, 255);
  let g = random(G.pastel, 255);
  let b = random(G.pastel, 255);
  return [r,g,b];
}

function makeBlock(sz, ltr, col) {
  let b = createGraphics(sz, sz);
  
  b.stroke(255);
  b.fill(col);
  b.strokeWeight(sz/10);
  b.square(0, 0, sz, sz/5);
  
  b.stroke(128);
  b.noFill();
  b.strokeWeight(2);
  b.square(sz*0.05, sz*0.05, sz*.9, sz/6);
  
  b.stroke(0);
  b.strokeWeight(5);
  b.fill(255);
  b.textAlign(CENTER, CENTER);
  b.textSize(sz*.7);
  b.textStyle(BOLD);
  b.text(ltr, sz/2, sz/2);
  
  let i = new p5.Image(sz, sz);
  i.copy(b, 0, 0, sz, sz, 0, 0, sz, sz);
  
  return i;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  smooth();
  
  G.blocksize = max(50, width/(G.message.split('').length-2));
  G.blocks = [];
  for (let c of G.message.split('')) {
    G.blocks.push(makeBlock(G.blocksize, c, randomPastel()));
  }
  
  G.start=millis();
}

function draw() {
  let t = millis();
  let e = (t - G.start)/1000;
  
  background(0);
  
  let i = 0;
  let xpos = 0;
  let fullsize = G.blocks.length*G.blocksize*G.blockspacing
  for (let b of G.blocks) {
    xpos = (i*G.blocksize*G.blockspacing - G.pps*e) % fullsize;
    while (xpos < -G.blocksize*2) {
      xpos += fullsize;
    }
    let ypos = - G.blocksize*sin(xpos/width*PI*4)/2;
    image( b,
           xpos,
           height/2-G.blocksize/2+ypos
          );
    i ++;
  }
}