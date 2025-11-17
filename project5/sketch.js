let img;
let slider;
let blurSlider;
let zoomSlider;
let pg;
let pixelFont;

function preload() {
  img = loadImage("TITAN_Introduction.png");
  pixelFont = loadFont("PixelFont.ttf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  img.resize(600, 600);
  pg = createGraphics(600, 600);

  slider = createSlider(50, 300, 150);
  slider.position(10, height + 10);
  slider.style("width", "180px");

  blurSlider = createSlider(0, 150, 50);
  blurSlider.position(200, height + 10);
  blurSlider.style("width", "180px");

  zoomSlider = createSlider(1, 4, 2, 0.1);
  zoomSlider.position(390, height + 10);
  zoomSlider.style("width", "180px");
}

function draw() {
  background(0);  // 🔥 整体变为黑色背景

  pg.clear();

  let radius = slider.value();
  let blurWidth = blurSlider.value();
  let zoom = zoomSlider.value();
  let zoomSize = radius * 2;

  let sx = constrain(mouseX - radius / zoom, 0, img.width - zoomSize / zoom);
  let sy = constrain(mouseY - radius / zoom, 0, img.height - zoomSize / zoom);

  let ctx = pg.drawingContext;


  ctx.save();
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
  ctx.clip();


  ctx.drawImage(
    img.canvas,
    sx, sy,
    zoomSize / zoom, zoomSize / zoom,
    mouseX - radius, mouseY - radius,
    zoomSize, zoomSize
  );
  ctx.restore();


  ctx.save();
  let innerRadius = max(0, radius - blurWidth);
  let outerRadius = radius;

  let glowGradient = ctx.createRadialGradient(mouseX, mouseY, innerRadius, mouseX, mouseY, outerRadius);
  glowGradient.addColorStop(0, 'rgba(255,255,255,0.0)');
  glowGradient.addColorStop(0.7, 'rgba(255,255,255,0.15)');
  glowGradient.addColorStop(1, 'rgba(255,255,255,0.5)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  image(pg, 0, 0); 

  // === 滑块说明文字 ===
  fill(255);
  textSize(14);
  textFont(pixelFont);
  textAlign(LEFT, CENTER);
  text(`Aperture radius: ${radius}px`, 10, height - 30);
  text(`Blurred edges: ${blurWidth}px`, 200, height - 30);
  text(`Zoom: ${zoom.toFixed(1)}x`, 390, height - 30);
}
