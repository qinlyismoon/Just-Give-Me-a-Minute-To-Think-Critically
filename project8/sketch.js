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
  createCanvas(700, 600);
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
    let step = 1 / 12.0;

    // top edge
    for (let t = 0; t <= 1; t += step) {
      let px = this.w * t;
      let py = sin(t * TWO_PI * 2 + random(PI)) * 6;
      path.push([px, py]);
    }

    // right edge
    for (let t = 0; t <= 1; t += step) {
      let px = this.w + cos(t * TWO_PI * 2 + random(PI)) * 6;
      let py = this.h * t;
      path.push([px, py]);
    }

    // bottom edge
    for (let t = 0; t <= 1; t += step) {
      let px = this.w * (1 - t);
      let py = this.h + sin(t * TWO_PI * 2 + random(PI)) * 6;
      path.push([px, py]);
    }

    // left edge
    for (let t = 0; t <= 1; t += step) {
      let px = -cos(t * TWO_PI * 2 + random(PI)) * 6;
      let py = this.h * (1 - t);
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
