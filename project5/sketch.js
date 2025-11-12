let img;
let slider;       
let blurSlider;    
let colorSlider;  
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
  slider.style("display", "inline-block");
  slider.style("margin-right", "10px");

  blurSlider = createSlider(0, 150, 50);
  blurSlider.position(200, height + 10);
  blurSlider.style("width", "180px");
  blurSlider.style("display", "inline-block");
  blurSlider.style("margin-right", "10px");

  colorSlider = createSlider(0, 255, 255);
  colorSlider.position(390, height + 10);
  colorSlider.style("width", "180px");
  colorSlider.style("display", "inline-block");
}

function draw() {

  image(img, 0, 0);


  pg.clear();
  pg.background(0); 

  let ctx = pg.drawingContext;
  let radius = slider.value();
  let blurWidth = blurSlider.value();
  let colorOffset = colorSlider.value();

  // 颜色映射：蓝→中性→红
  let r = map(colorOffset, 0, 255, 0, 255);
  let g = map(colorOffset, 0, 255, 0, 100);
  let b = map(colorOffset, 0, 255, 255, 0);

  let innerRadius = max(0, radius - blurWidth);
  let outerRadius = radius;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  let eraseGradient = ctx.createRadialGradient(mouseX, mouseY, innerRadius, mouseX, mouseY, outerRadius);
  eraseGradient.addColorStop(0, 'rgba(0,0,0,1)');
  eraseGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = eraseGradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();


  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  let colorGradient = ctx.createRadialGradient(mouseX, mouseY, innerRadius, mouseX, mouseY, outerRadius);
  colorGradient.addColorStop(0, `rgba(${r},${g},${b}, 0.5)`);
  colorGradient.addColorStop(1, `rgba(${r},${g},${b}, 0)`);
  ctx.fillStyle = colorGradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();


  image(pg, 0, 0);

  // ---文字 ---
  fill(255);
  textSize(14);
  textFont(pixelFont);
  textAlign(LEFT, CENTER);
  text(`Aperture radius: ${radius}px`, 10, height - 30);
  text(`Blurred edges: ${blurWidth}px`, 200, height - 30);
  text(`Color offset: ${colorSlider.value()}`, 390, height - 30);
}
