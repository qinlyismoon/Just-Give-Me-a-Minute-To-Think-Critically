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
  
  img.resize(width, height); 
  pg = createGraphics(width, height);

  slider = createSlider(50, 300, 150);
  slider.parent("slider-holder");
  slider.style("width", "180px");
  
  blurSlider = createSlider(0, 150, 50);
  blurSlider.parent("slider-holder");
  blurSlider.style("width", "180px");
  
  colorSlider = createSlider(0, 255, 128);
  colorSlider.parent("slider-holder");
  colorSlider.style("width", "180px");
}

function draw() {
  image(img, 0, 0);

  pg.clear();
  pg.background(0); 

  let ctx = pg.drawingContext;
  let radius = slider.value();
  let blurWidth = blurSlider.value();
  let gray = colorSlider.value(); 

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
  let grayGradient = ctx.createRadialGradient(mouseX, mouseY, innerRadius, mouseX, mouseY, outerRadius);
  grayGradient.addColorStop(0, `rgba(${gray},${gray},${gray}, 0.5)`);
  grayGradient.addColorStop(1, `rgba(${gray},${gray},${gray}, 0)`);
  ctx.fillStyle = grayGradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  image(pg, 0, 0);

  fill(255);
  textSize(14);
  textFont(pixelFont);
  textAlign(LEFT, CENTER);
  text(`Aperture radius: ${radius}px`, 10, height - 30);
  text(`Blurred edges: ${blurWidth}px`, 200, height - 30);
  text(`Gray level: ${gray}`, 390, height - 30);
}
