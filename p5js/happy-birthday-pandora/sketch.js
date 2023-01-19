const G = new Object(null);

G.message = "     HAPPY BIRTHDAY PANDORA!!!";
G.frameRate=60;
G.pastel = 255*.7;
G.blockspacing = 0.9;
G.period = 8;
G.bgr = 255;
G.bgg = 255;
G.bgb = 255;
G.bgskewps = 0.65;

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
  // b.square(0, 0, sz, sz/5);
  b.circle(sz/2, sz/2, sz*.85);
  
  b.stroke(128);
  b.noFill();
  b.strokeWeight(2);
  // b.square(sz*0.05, sz*0.05, sz*.9, sz/6);
  b.circle(sz/2, sz/2, sz*.75);
  
  b.stroke(0);
  b.noFill();
  b.strokeWeight(1);
  b.circle(sz/2, sz/2, sz*0.85+2);
  
  b.stroke(0);
  b.strokeWeight(5);
  b.fill(255);
  b.textAlign(CENTER, CENTER);
  b.textSize(sz*.55);
  b.textStyle(BOLD);
  b.text(ltr, sz/2, sz*0.525);
  
  let i = new p5.Image(sz, sz);
  i.copy(b, 0, 0, sz, sz, 0, 0, sz, sz);
  
  return i;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  G.pps = width/G.period;
  frameRate(G.frameRate);
  smooth();
  
  G.wavemult = 4;
  G.tiltmod = width/330;
  G.angleoff = 0;
  
  G.blocksize = max(50, width/(G.message.split('').length-5));
  G.blocks = [];
  for (let c of G.message.split('')) {
    G.blocks.push(makeBlock(G.blocksize, c, randomPastel()));
  }
  
  [G.bgr, G.bgg, G.bgb] = randomPastel();
  [G.dbgr, G.dbgg, G.dbgb] = [0, 0, 0];
  // [G.bgr, G.bgg, G.bgb] = [255, 255, 255];
  // [G.dbgr, G.dbgg, G.dbgb] = [-1, -1, -1];
  G.start=millis();
  G.lastframe=G.start;
}

function draw() {
  let t = millis();
  let e = (t - G.start)/1000;
  let d = (t - G.lastframe)/1000;
  G.lastframe = t;
  
  background(G.bgr, G.bgg, G.bgb);

  G.dbgr += random(-d*G.bgskewps, d*G.bgskewps);
  G.dbgg += random(-d*G.bgskewps, d*G.bgskewps);
  G.dbgb += random(-d*G.bgskewps, d*G.bgskewps);
  G.dbgr = max(-G.bgskewps, min(G.bgskewps, G.dbgr));
  G.dbgg = max(-G.bgskewps, min(G.bgskewps, G.dbgg));
  G.dbgb = max(-G.bgskewps, min(G.bgskewps, G.dbgb));
  G.bgr += G.dbgr;
  G.bgg += G.dbgg;
  G.bgb += G.dbgb;
  if (G.bgr > 255 || G.bgr < G.pastel) { G.bgr -= 2*G.dbgr; G.dbgr = 0; }
  if (G.bgg > 255 || G.bgg < G.pastel) { G.bgg -= 2*G.dbgg; G.dbgg = 0; }
  if (G.bgb > 255 || G.bgb < G.pastel) { G.bgb -= 2*G.dbgb; G.dbgb = 0; }
  // console.log(d, G.bgr, G.bgg, G.bgb);
  
  let i = 0;
  let xpos = 0;
  let fullsize = G.blocks.length*G.blocksize*G.blockspacing
  for (let b of G.blocks) {
    xpos = (i*G.blocksize*G.blockspacing - G.pps*e) % fullsize;
    while (xpos < -G.blocksize*2) {
      xpos += fullsize;
    }
    let theta = G.angleoff + xpos/width*PI*G.wavemult;
    let yoff = - G.blocksize*cos(theta)/2;
    let angle = sin(theta)/G.tiltmod;
    let ypos = height/2-G.blocksize/2+yoff
    
    G.angleoff = 0;//(G.angleoff + d / G.period) % (2 * PI);
    
    resetMatrix();
    translate(xpos + G.blocksize/2, ypos + G.blocksize/2)
    rotate(angle);
    image( b, -G.blocksize/2, -G.blocksize/2);
    i ++;
  }
}
