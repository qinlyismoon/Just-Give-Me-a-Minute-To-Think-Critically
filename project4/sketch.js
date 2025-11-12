let mx = 50;
let my;
let targetMy;
let radius = 24;
let speed = 2;

let pillars = [];
let passedPillars = [];
let currentPillarIndex = 0;

let passOsc;
let mic;
let pixelFont;

function preload() {
  pixelFont = loadFont("PixelFont.ttf");
}

function setup() {
  let canvas =createCanvas(800, 600);
  canvas.parent("canvas-container");
  
  noStroke();
  ellipseMode(RADIUS);
  rectMode(CORNERS);
  textFont(pixelFont);

  my = targetMy = height * 0.65;

  let startX = 180;
  let gap = 100;
  let pillarTop = 100;
  let pillarHeight = height - 200; // 蓝色区域高度

  // 初始化柱子，两端紧贴蓝色区域
  pillars.push({x: startX + gap * 0, y: pillarTop, w: 40, h: pillarHeight, holeY: 220, holeH: 100, label: "author?"});
  pillars.push({x: startX + gap * 1, y: pillarTop, w: 40, h: pillarHeight, holeY: 160, holeH: 100, label: "professional?"});
  pillars.push({x: startX + gap * 2, y: pillarTop, w: 40, h: pillarHeight, holeY: 240, holeH: 100, label: "purpose?"});
  pillars.push({x: startX + gap * 3, y: pillarTop, w: 40, h: pillarHeight, holeY: 180, holeH: 100, label: "bias?"});
  pillars.push({x: startX + gap * 4, y: pillarTop, w: 40, h: pillarHeight, holeY: 300, holeH: 100, label: "stereotypes?"});

  passedPillars = new Array(pillars.length).fill(false);

  passOsc = new p5.Oscillator('sine');
  passOsc.amp(0);
  passOsc.start();

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(230);
  mx += speed;

  // 调整音量响应阈值，更灵敏
  let vol = mic.getLevel();
  targetMy = map(vol, 0, 0.01, height - 100 - radius, 100 + radius, true);
  my += (targetMy - my) * 0.05; // 更平缓

  // 蓝色区域背景
  fill("#00b1f0");
  rect(100, 100, width - 100, height - 100);

  // 柱子绘制
  for (let i = 0; i <= currentPillarIndex && i < pillars.length; i++) {
    let p = pillars[i];

    fill(120);
    rect(p.x, p.y, p.x + p.w, p.y + p.h);

    fill("#00b1f0");
    rect(p.x, p.holeY, p.x + p.w, p.holeY + p.holeH);
  }

  // 显示当前问题文字
  if (currentPillarIndex < pillars.length) {
    let currentLabel = pillars[currentPillarIndex].label;
    fill(120);
    textSize(80);
    textAlign(CENTER, CENTER);
    text(currentLabel, width / 2, height - 40);
  }

  // 碰撞检测 + 判断通过
  if (currentPillarIndex < pillars.length) {
    let p = pillars[currentPillarIndex];

    let ballLeft = mx - radius;
    let ballRight = mx + radius;
    let ballTop = my - radius;
    let ballBottom = my + radius;

    let pillarLeft = p.x;
    let pillarRight = p.x + p.w;
    let pillarTop = p.y;
    let pillarBottom = p.y + p.h;
    let holeTop = p.holeY;
    let holeBottom = p.holeY + p.holeH;

    let inPillarX = ballRight > pillarLeft && ballLeft < pillarRight;
    let inPillarY = ballBottom > pillarTop && ballTop < pillarBottom;
    let overlapsSolidPart = !(
      ballTop > holeTop &&
      ballBottom < holeBottom
    );

    if (inPillarX && inPillarY && overlapsSolidPart) {
      mx -= speed;
    }

    if (!passedPillars[currentPillarIndex] && mx > pillarRight) {
      passedPillars[currentPillarIndex] = true;
      currentPillarIndex++;
      playPassSound();
    }
  }

  // 小球绘制
  fill(255);
  ellipse(mx, my, radius, radius);
}

function playPassSound() {
  passOsc.freq(700);
  passOsc.amp(0.3, 0.05);
  setTimeout(() => passOsc.amp(0, 0.2), 120);
}
