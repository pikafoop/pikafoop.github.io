// global structure
const G = new Object(null);
G.dropDelay = 500;
G.ballSize = 50;
G.ballSides = 25;
G.message = "HAPPY BIRTHDAY PANDORA!!!     ";
G.msgIndex = 0;
G.frameRate=60;
G.pastel = 255*0.7;
G.bgskewps = 0.65;


function randomPastel() {
  let r = random(G.pastel, 255);
  let g = random(G.pastel, 255);
  let b = random(G.pastel, 255);
  return [r,g,b];
}


function makeSprite() {
  let sz = G.ballSize;
  let b = createGraphics(sz*2, sz*2);
  
  let col = randomPastel();
  let ltr = G.message[G.msgIndex];
  G.msgIndex = (G.msgIndex + 1) % G.message.length;
  
  b.stroke(255);
  b.fill(col);
  b.strokeWeight(sz/10);
  b.circle(sz, sz, sz);
  
  b.stroke(128);
  b.noFill();
  b.strokeWeight(2);
  b.circle(sz, sz, sz*.85);
  
  b.stroke(0);
  b.strokeWeight(5);
  b.fill(255);
  b.textAlign(CENTER, CENTER);
  b.textSize(sz*.7);
  b.textStyle(BOLD);
  b.text(ltr, sz, sz*1.025);
  
  let i = new p5.Image(sz*2, sz*2);
  i.copy(b, 0, 0, sz*2, sz*2, 0, 0, sz*2, sz*2);
  
  return i;
}

function makeBall() {
  let b = Matter.Bodies.circle(width/2, -G.ballSize * 2, G.ballSize/2);
  b.sprite = makeSprite();
  G.bodies.add(b);
  Matter.Composite.add(G.world, b);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
  [G.bgr, G.bgg, G.bgb] = randomPastel();
  [G.dbgr, G.dbgg, G.dbgb] = [0, 0, 0];
  
  G.engine = Matter.Engine.create();
  G.world = G.engine.world;
  
  G.bodies = new Set();
  
  G.grounds = new Set();
  G.grounds.add( Matter.Bodies.rectangle( width/2, height*0.95, width * 0.8, height*0.05, {isStatic:true} ) );
  
  for (let g of G.grounds) {
    Matter.Composite.add( G.world, g );
  }
  for (let b of G.bodies) {
    Matter.Composite.add( G.world, b );
    console.log(b.position.x, b.position.y, b.vertices[0].x, b.vertices[1].y);
  }
  
  Matter.Runner.run(G.engine);
  
  // console.log(Matter.Composite.allBodies(G.world));
  
  let t = millis();
  G.lastFrame = t;
  G.nextDrop = t + G.dropDelay;
  G.nextReport = t;
  G.start = t;
  
  console.log(G);
}

function draw() {
  let t = millis();
  let e = (t - G.start)/1000;
  let d = (t - G.lastFrame)/1000;
  G.lastFrame = t;
  
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
  
  if (t > G.nextReport) {
    console.log(G.bgr, G.bgg, G.bgb);
    G.nextReport = t + 1000;
  }
  
  fill('white');
  stroke('white');
  strokeWeight(2);
  
  for (let g of G.grounds) {
    beginShape();
    for (let v of g.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
  
  for (let b of G.bodies) {
    // beginShape();
    // for (let v of b.vertices) {
    //   vertex(v.x, v.y);
    // }
    // endShape(CLOSE);
    // line(b.position.x, b.position.y, b.vertices[0].x, b.vertices[0].y);
    
    resetMatrix();
    translate(b.position.x, b.position.y);
    rotate(b.angle);
    image(b.sprite, -G.ballSize, -G.ballSize);
    resetMatrix();
  }
  
  if (t >= G.nextDrop) {
    let b = makeBall();
    G.nextDrop = t + G.dropDelay;
  }
  
  for (let b of G.bodies) {
    if (b.position.y > height + G.ballSize) {
      G.bodies.delete(b);
      Matter.Composite.remove(G.world, b);
    }
  }
}