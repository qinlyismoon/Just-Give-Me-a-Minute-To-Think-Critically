let font;
let words = [];
let totalWords = 5;
let fontSize = 60;
let diskWidth = 80;
let diskHeight = 55;

function preload() {
  font = loadFont("PixelFont.ttf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  
  textFont(font);
  textSize(fontSize);
  textAlign(LEFT, CENTER); 
  noStroke();

  let spacing = fontSize + 20;
  let startY = 130;

  for (let i = 0; i < totalWords; i++) {
    let isDisinfo = random() < 0.5; 
    let y = startY + i * spacing;

    let infoWidth = textWidth("information");
    let disWidth = textWidth("dis");

    
    let minX = 20 + disWidth + 10; 
    let maxX = width - infoWidth - 20;
    let infoX = random(minX, maxX);

    let disX = infoX - disWidth - 10;

    // 创建灰色遮罩层
    let pg = createGraphics(diskWidth, diskHeight);
    pg.background(180);
    pg.noStroke();

    words.push({
      isDisinfo,
      infoX,
      y,
      disX,
      disY: y,
      mask: pg
    });
  }
}

function draw() {
  background("#00b1f0");

  for (let word of words) {
    let { infoX, y, isDisinfo, disX, disY, mask } = word;


    fill("white");
    textAlign(LEFT, CENTER);
    text("information", infoX, y);


    if (isDisinfo) {
      fill("#cb4a31");
      textAlign(LEFT, CENTER);
      text("dis", disX, disY + 2);
    }


    imageMode(CENTER);
    image(mask, disX + diskWidth / 2, disY);
    imageMode(CORNER);
  }
}

function mouseDragged() {
  for (let word of words) {
    let { disX, disY, mask } = word;

    let localX = mouseX - (disX);
    let localY = mouseY - (disY - diskHeight / 2);

    if (localX >= 0 && localX < diskWidth && localY >= 0 && localY < diskHeight) {
      mask.erase();
      mask.ellipse(localX, localY, 20, 20);
      mask.noErase();
    }
  }
}
