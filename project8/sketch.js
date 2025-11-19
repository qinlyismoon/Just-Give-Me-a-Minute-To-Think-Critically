let handposeModel;
let video;
let predictions = [];
let boxes = [];
let labels = ["Information", "Disinformation"];
let pixelFont;
let palette = ["#CE7A51", "#EFE7D3", "#BEC8AF", "#7BA4AA"];

function preload() {
  pixelFont = loadFont("PixelFont.ttf");
}

function setup() {
  let canvas = createCanvas(700, 580);
  canvas.parent("canvas-container");
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handposeModel = ml5.handpose(video, () => {
    console.log("✅ Handpose model loaded (ml5 v0.6.0)!");
  });

  handposeModel.on("predict", results => {
    predictions = results;
  });

  initializeBoxes();
}

function draw() {
  background("#D1E7F2");

  let frameX = 30;
  let frameY = 20;
  let frameW = 640;
  let frameH = 480;

  noStroke();
  fill("#D1E7F2");
  rect(frameX - 3, frameY - 3, frameW + 6, frameH + 80, 12);

  // 镜像摄像头
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, width - frameX - frameW, frameY, frameW, frameH);
  pop();

  // TITAN 标题
  fill("#48AFEE");
  textFont(pixelFont);
  textSize(80);
  textAlign(CENTER, CENTER);
  text("TITAN", width / 2, frameY + frameH + 40);

  // 显示拼图方框
  for (let box of boxes) {
    box.update();
    box.display();
  }

  // 手势识别
  if (predictions.length > 0) {
    let hand = predictions[0];
    let finger = hand.annotations.indexFinger[3];
    let thumb = hand.annotations.thumb[3];

    let fx = width - finger[0];
    let fy = finger[1];
    let tx = width - thumb[0];
    let ty = thumb[1];

    fill("#48AFEE");
    noStroke();
    ellipse(fx, fy, 20);
    ellipse(tx, ty, 20);

    let pinchX = (fx + tx) / 2;
    let pinchY = (fy + ty) / 2;
    let pinchDist = dist(fx, fy, tx, ty);

    if (pinchDist < 40) {
      for (let box of boxes) {
        if (
          pinchX > box.x &&
          pinchX < box.x + box.w &&
          pinchY > box.y &&
          pinchY < box.y + box.h
        ) {
          box.dragging = true;
          box.x = pinchX - box.w / 2;
          box.y = pinchY - box.h / 2;
        }
      }
    } else {
      for (let box of boxes) {
        box.dragging = false;
      }
    }
  }
}

function initializeBoxes() {
  for (let i = 0; i < 18; i++) {
    let w = random(140, 200);
    let h = random(60, 100);
    let x = random(width - w);
    let y = random(height - h - 50);
    let label = random(labels);
    let col = color(random(palette));
    boxes.push(new DraggableBox(x, y, w, h, col, label));
  }
}

class DraggableBox {
  constructor(x, y, w, h, col, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.label = label;
    this.dragging = false;

    this.path = this.generatePuzzleShape();
  }

generatePuzzleShape() {
  let path = [];

  let edges = [
    floor(random(-1, 2)), // top
    floor(random(-1, 2)), // right
    floor(random(-1, 2)), // bottom
    floor(random(-1, 2))  // left
  ];

  let tabSize = min(this.w, this.h) * 0.25;
  let tabDepth = tabSize * 0.55;

  let segments = 20;

  // ----- TOP EDGE -----
  for (let i = 0; i <= segments; i++) {
    let t = i / segments;
    let px = this.w * t;
    let py = 0;

    if (edges[0] !== 0 && t > 0.25 && t < 0.75) {
      let tt = map(t, 0.25, 0.75, -1, 1);
      let curve = sqrt(1 - tt * tt) * tabDepth;
      py = edges[0] === 1 ? -curve : curve;
    }
    path.push([px, py]);
  }

  // ----- RIGHT EDGE -----
  for (let i = 0; i <= segments; i++) {
    let t = i / segments;
    let px = this.w;
    let py = this.h * t;

    if (edges[1] !== 0 && t > 0.25 && t < 0.75) {
      let tt = map(t, 0.25, 0.75, -1, 1);
      let curve = sqrt(1 - tt * tt) * tabDepth;
      px = edges[1] === 1 ? this.w + curve : this.w - curve;
    }
    path.push([px, py]);
  }

  // ----- BOTTOM EDGE -----
  for (let i = 0; i <= segments; i++) {
    let t = i / segments;
    let px = this.w * (1 - t);
    let py = this.h;

    if (edges[2] !== 0 && t > 0.25 && t < 0.75) {
      let tt = map(t, 0.25, 0.75, -1, 1);
      let curve = sqrt(1 - tt * tt) * tabDepth;
      py = edges[2] === 1 ? this.h + curve : this.h - curve;
    }
    path.push([px, py]);
  }

  // ----- LEFT EDGE -----
  for (let i = 0; i <= segments; i++) {
    let t = i / segments;
    let px = 0;
    let py = this.h * (1 - t);

    if (edges[3] !== 0 && t > 0.25 && t < 0.75) {
      let tt = map(t, 0.25, 0.75, -1, 1);
      let curve = sqrt(1 - tt * tt) * tabDepth;
      px = edges[3] === 1 ? -curve : curve;
    }
    path.push([px, py]);
  }

  return path;
}

  display() {
    push();
    translate(this.x, this.y);
    fill(this.col);
    noStroke();

    beginShape();
    for (let [px, py] of this.path) {
      vertex(px, py);
    }
    endShape(CLOSE);
    pop();

    textFont(pixelFont);
    textSize(this.label === "Information" ? 28 : 26);
    textAlign(CENTER, CENTER);
    fill("#333333");
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  update() {}
}
