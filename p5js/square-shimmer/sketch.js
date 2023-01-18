const G = Object(null);
G.width = 500;
G.height = 500;
G.pitch = 5;
G.swing = 10;

function setup() {
  G.dotsW = int(G.width/G.pitch) + 1;
  G.dotsH = int(G.height/G.pitch) + 1;
  G.gridR = [];
  G.gridG = [];
  G.gridB = [];
  for (let i = 0; i <= G.dotsW * G.dotsH + G.dotsW; i++ ) {
    G.gridR[i] = 127;
    G.gridG[i] = 127;
    G.gridB[i] = 127;
  }
  
  createCanvas(G.width, G.height);
  G.im = createImage(G.width, G.height);
  frameRate(60);
}

function draw() {
  background(0);
  updateGrid();
  updateImage();
  image(G.im, 0, 0);
}

function updateGrid() {
  for (let dotGrid of [G.gridR, G.gridG, G.gridB]) {
    for (let i = 0; i < dotGrid.length; i++) {
      let r = random(-G.swing, G.swing);
      let c = dotGrid[i] + r;
      if (c > 255) {
        c = 255 - (c - 255);
      }
      if (c < 0) {
        c = -c;
      }
      dotGrid[i] = c;
    }
  }
}

function updateImage() {
  G.im.loadPixels();
  for (let y = 0; y < G.height; y++) {
    for (let x = 0; x < G.width; x++) {
      let gridCoordX = x / G.pitch + 0.5;
      let gridCoordY = y / G.pitch + 0.5;
      let gx1 = int(gridCoordX);
      let gy1 = int(gridCoordY);
      let gxp = gridCoordX - gx1;
      let gyp = gridCoordY - gy1;
      let gx2 = gx1 + 1;
      let gy2 = gy1 + 1;
      
      let d11 = gxp*gxp + gyp*gyp;
      let d12 = gxp*gxp + (1-gyp)*(1-gyp);
      let d21 = (1-gxp)*(1-gxp) + gyp*gyp;
      let d22 = (1-gxp)*(1-gxp) + (1-gyp)*(1-gyp);
      let dScale = 1 / (d11+d12+d21+d22);
      d11 = d11 * dScale;
      d12 = d12 * dScale;
      d21 = d21 * dScale;
      d22 = d22 * dScale;
      
      let g11 = gy1 * G.dotsW + gx1;
      let g12 = gy2 * G.dotsW + gx1;
      let g21 = gy1 * G.dotsW + gx2;
      let g22 = gy2 * G.dotsW + gx2;
      
      let r = G.gridR[g11] * d11 + G.gridR[g12] * d12 + G.gridR[g21] * d21 + G.gridR[g22] * d22;
      let g = G.gridG[g11] * d11 + G.gridG[g12] * d12 + G.gridG[g21] * d21 + G.gridG[g22] * d22;
      let b = G.gridB[g11] * d11 + G.gridB[g12] * d12 + G.gridB[g21] * d21 + G.gridB[g22] * d22;
      let c = [r,g,b,255];
      
      G.im.set(x, y, c);
    }
  }
  G.im.updatePixels();
}