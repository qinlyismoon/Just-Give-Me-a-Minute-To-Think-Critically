let gridButtons = [];
let cols = 4;
let rows = 4;
let phrases = ["TITAN", "Socratic Method", "Experiential Learning", "Conversational AI"];
let colors;
let midiNotes = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86];
let osc, pixelFont;

function preload() {
  pixelFont = loadFont("PixelFont.ttf");
}

function setup() {
  let canvas =  createCanvas(600, 600);
  canvas.parent("canvas-container"); 
 
  textFont(pixelFont);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noStroke();


  colors = ["#ED3F27", "#48B3AF", "#FDF4E3", "#FF9013"];
  let cellW = width / cols;
  let cellH = height / rows;
  let index = 0;

  for (let y = cellH / 2; y < height; y += cellH) {
    for (let x = cellW / 2; x < width; x += cellW) {
      let button = new PhraseButton(x, y, min(cellW, cellH) * 0.8, index);
      button.setWord("TITAN", true);
      gridButtons.push(button);
      index++;
    }
  }

  osc = new p5.TriOsc();
  osc.start();
  osc.amp(0);
}

function draw() {
  background("#00b1f0");
  for (let btn of gridButtons) {
    btn.display();
  }
}

function mouseClicked() {
  for (let btn of gridButtons) {
    if (btn.isHovered(mouseX, mouseY)) {
      let phrase = random(phrases);
      btn.setWord(phrase, false);
      playNote(btn.index);
    }
  }
}

class PhraseButton {
  constructor(x, y, size, index) {
    this.cx = x;
    this.cy = y;
    this.size = size;
    this.word = "";
    this.color = "#000000";
    this.index = index;
  }

  setWord(text, isGray = false) {
    this.word = text;
    this.color = isGray ? "#FEB21A" : random(colors);
  }

  display() {
    fill(this.color);
    textFont(pixelFont);

    let parts = this.word.split(" ");
    let padding = 6; // 上下边距
    let availableHeight = this.size - padding * 2;
    let availableWidth = this.size * 0.9; // 左右边距

    if (parts.length === 2) {
      // 双行处理
      let fontSize = availableHeight / 2.4;
      textSize(fontSize);

      // 取两行最长宽度
      let maxWidth = max(textWidth(parts[0]), textWidth(parts[1]));
      if (maxWidth > availableWidth) {
        fontSize *= availableWidth / maxWidth;
      }

      fontSize *= 0.9; // 安全缩放
      let lineSpacing = fontSize * 1.3;

      textSize(fontSize);
      text(parts[0], this.cx, this.cy - lineSpacing / 2);
      text(parts[1], this.cx, this.cy + lineSpacing / 2);
    } else {
      // 单行处理
      let fontSize = this.size * 0.45;
      textSize(fontSize);

      let wordWidth = textWidth(this.word);
      if (wordWidth > availableWidth) {
        fontSize *= availableWidth / wordWidth;
      }

      textSize(fontSize);
      text(this.word, this.cx, this.cy);
    }
  }

  isHovered(mx, my) {
    let w = width / cols;
    let h = height / rows;
    return abs(mx - this.cx) < w / 2 && abs(my - this.cy) < h / 2;
  }
}

function getColorPalette(url) {
  let arr = url.slice(url.lastIndexOf("/") + 1).split("-");
  return arr.map(s => "#" + s);
}

function playNote(index) {
  let midiVal = midiNotes[index % midiNotes.length];
  let freq = midiToFreq(midiVal);
  osc.freq(freq);
  osc.amp(0.5, 0.05);  // Attack
  osc.amp(0, 0.8);     // Release
}
