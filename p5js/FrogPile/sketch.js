const G = new Object(null);
G.frameRate = 60;

function preload() {
  G.frogImg = loadImage('pinkfrog.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(G.frameRate);
  smooth();
  
  G.spriteSize = max(50, width/30);
  
  let imgScale = min(G.spriteSize/G.frogImg.width, G.spriteSize/G.frogImg.height);
  G.frogImg.resize(int(imgScale*G.frogImg.width), 0);
  G.engine = Matter.Engine.create();
  G.world = G.engine.world;
  
  G.bodies = new Set();
  let b = makeSprite(G.frogImg, x=width/2);
  G.bodies.add( b );
  
  G.grounds = new Set();
  G.grounds.add( Matter.Bodies.rectangle( width/2, height-10, width * 0.8, G.frogImg.height, {isStatic:true} ) );
  
  for (let g of G.grounds) {
    Matter.Composite.add( G.world, g );
  }
  for (let b of G.bodies) {
    Matter.Composite.add( G.world, b );
  }
  
  Matter.Runner.run(G.engine);
  
  console.log(millis()/1000);
  
  let t = millis();
  G.lastFrame = t;
  G.start = t;
  
  console.log(width, height);
  console.log(G);
}

function draw() {
  background(0);
  
  let t = millis();
  let e = (t - G.start)/1000;
  let d = (t - G.lastFrame)/1000;
  G.lastFrame = t;
  
  fill('white');
  noStroke();
  
  text(`FROGS: ${G.bodies.size}`, 10, 10);
  
  for (let g of G.grounds) {
    beginShape();
    for (let v of g.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
  
  noFill();
  let dropZoneClear = true;
  for (let b of G.bodies) {
    if (b.position.y < 0) {
      dropZoneClear = false;
    }
    
    // beginShape();
    // for (let v of b.vertices) {
    //   vertex(v.x, v.y);
    // }
    // endShape(CLOSE);
    // line(b.position.x, b.position.y, b.vertices[0].x, b.vertices[0].y);
    
    resetMatrix();
    translate(b.position.x, b.position.y);
    rotate(b.angle);
    image(b.image, -b.image.width/2, -b.image.height/2);
    resetMatrix();
  }
  
  if (dropZoneClear && random() > 0.5) {
    let x = width/2 + random(-G.frogImg.width/2, G.frogImg.width/2);
    let theta = random(2*PI);
    let b = makeSprite(G.frogImg, x, y=-G.frogImg.height);
    Matter.Body.rotate(b, theta);
    G.bodies.add(b);
    Matter.Composite.add(G.world, b);
    G.nextDrop = t + G.dropDelay;
  }
  
  for (let b of G.bodies) {
    if (b.position.y > height + G.spriteSize) {
      G.bodies.delete(b);
      Matter.Composite.remove(G.world, b);
    }
  }
}

function findBorder(im, subdiv = null) {
  if (subdiv == null) {
    subdiv = min(50, im.width/10);
    subdiv = min(subdiv, im.height/10);
    subdiv = max(int(subdiv), 1);
  }
  
  im.loadPixels();
  vertices = [];
  let last;
  
  // probe the top toward the right
  for(let x = 0; x < im.width; x += subdiv) {
    for(let y = 0; y < im.height; y++) {
      if (im.get(x,y)[3] > 127) {
        vertices.push({'x':x, 'y':y});
        last = y;
        break;
      }
    }
  }
  
  // probe the right toward the bottom
  for (let y = last + subdiv; y < im.height; y += subdiv) {
    for(let x = im.width-1; x >= 0; x--) {
      if (im.get(x,y)[3] > 127) {
        vertices.push({'x':x, 'y':y});
        last = x;
        break;
      }
    }
  }
  
  // probe the bottom toward the left
  for (let x = last - subdiv; x >= 0; x-= subdiv) {
    for (let y = im.height - 1; y >= 0; y--) {
      if (im.get(x,y)[3] > 127) {
        vertices.push({'x':x, 'y':y});
        last = y;
        break;
      }
    }
  }
  
  // probe the left toward the top
  for (let y = last - subdiv; y >= vertices[0][1]; y -= subdiv) {
    for (let x = 0; x < im.width; x++) {
      if (im.get(x,y)[3] > 127) {
        vertices.push({'x':x, 'y':y});
        last = y;
        break;
      }
    }
  }
  
  return vertices;
}

function makeSprite(im, x=0, y=0, subdiv = null) {
  let vertices = findBorder(im);
  
  let body = Matter.Bodies.fromVertices(x, y, [vertices]);
  body.image = im;
  
  return body;
}