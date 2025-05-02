let cols = 75;
let rows = 75;
let spacing = 6;
let particles = [];
let img;
let imgReady = false;

function preload() {
  img = loadImage("image.png");, () => {
    console.log("Image loaded successfully");
    imgReady = true;
  }, () => {
    console.log("Image failed to load");
  });
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch-holder");

  colorMode(HSB, 255); // Needed for brightness()
  noStroke();

  if (!imgReady) return;

  img.resize(cols, rows);
  img.loadPixels();

  for (let i = 0; i < cols; i++) {
    particles[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = width / 2 - cols * spacing / 2 + i * spacing;
      let y = height / 2 - rows * spacing / 2 + j * spacing;
      let c = img.get(i, j);
      let b = brightness(color(c));
      particles[i][j] = new Particle(x, y, b);
    }
  }
}

function draw() {
  if (!imgReady) return;
  background(20);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles[i][j].interactWithNeighbors(i, j);
      particles[i][j].update();
      particles[i][j].show();
    }
  }
}

class Particle {
  constructor(x, y, b) {
    this.pos = createVector(x, y);
    this.origin = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.brightnessValue = b;
    this.influenceRadius = 100;
    this.bounceRadius = spacing * 1.5;
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();

    if (d < this.influenceRadius) {
      dir.normalize();
      let force = pow(max(0, 1 - sq(d / this.influenceRadius)), 2);
      dir.mult(force * 3);
      this.applyForce(dir);
    }

    let lift = map(this.brightnessValue, 0, 255, 0, -2);
    this.applyForce(createVector(0, lift * 0.3));

    let returnForce = p5.Vector.sub(this.origin, this.pos);
    returnForce.mult(0.08);
    this.applyForce(returnForce);

    let jitter = createVector(random(-0.05, 0.05), random(-0.05, 0.05));
    this.applyForce(jitter);

    this.vel.add(this.acc);
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  interactWithNeighbors(i, j) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let ni = i + dx;
        let nj = j + dy;
        if (
          ni >= 0 && nj >= 0 &&
          ni < cols && nj < rows &&
          (dx !== 0 || dy !== 0)
        ) {
          let other = particles[ni][nj];
          let d = p5.Vector.dist(this.pos, other.pos);
          if (d < this.bounceRadius && d > 0) {
            let repel = p5.Vector.sub(this.pos, other.pos);
            repel.normalize();
            rep
