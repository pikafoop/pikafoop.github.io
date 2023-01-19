// global structure
const G = new Object(null);
G.dropDelay = 500;
G.ballSize = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
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
  
  console.log(Matter.Composite.allBodies(G.world));
  
  let t = millis();
  G.lastFrame = t;
  G.nextDrop = t + G.dropDelay;
}

function draw() {
  let t = millis();
  
  background(0);
  
  
  noFill();
  stroke('white');
  strokeWeight(1);
  
  for (let g of G.grounds) {
    beginShape();
    for (let v of g.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
  
  
  fill('brown');
  stroke('white');
  strokeWeight(1);
  
  for (let b of G.bodies) {
    beginShape();
    for (let v of b.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    line(b.position.x, b.position.y, b.vertices[0].x, b.vertices[0].y);
  }
  
  if (t >= G.nextDrop) {
    let b = Matter.Bodies.polygon(width/2, -G.ballSize * 2, 5, G.ballSize);
    G.bodies.add(b);
    Matter.Composite.add(G.world, b);
    
    G.nextDrop = t + G.dropDelay;
  }
  
  for (let b of G.bodies) {
    if (b.position.y > height + G.ballSize) {
      G.bodies.delete(b);
      Matter.Composite.remove(G.world, b);
    }
  }
}