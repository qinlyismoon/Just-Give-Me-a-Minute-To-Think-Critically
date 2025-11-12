let font;
let fontsize = 60;
let infoList = [];
let disinfoList = [];
let totalInfo = 5;
let totalDisinfo = 5;
let shatterSound;

function preload() {
  font = loadFont('PixelFont.ttf');
  soundFormats('mp3', 'wav');
  shatterSound = loadSound('shatter.mp3');
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  textFont(font);
  textSize(fontsize);
  noCursor();

  for (let i = 0; i < totalInfo; i++) {
    infoList.push({
      word: 'Information',
      x: random(50, width - 250),
      y: random(100, height - 50),
      bounds: null
    });
  }

  for (let i = 0; i < totalDisinfo; i++) {
    disinfoList.push({
      word: 'Disinformation',
      x: random(50, width - 250),
      y: random(100, height - 50),
      bounds: null,
      isShattered: false,
      fragments: []
    });
  }
}

function draw() {
  background(240);
  textFont(font);
  textSize(fontsize);

  // Draw info
  for (let info of infoList) {
    info.bounds = {
      x: info.x,
      y: info.y - fontsize,
      w: textWidth(info.word),
      h: fontsize
    };

    if (isMouseInBounds(info.bounds)) {
      info.x += random(-0.3, 0.3);
      info.y += random(-0.3, 0.3);
    }

    fill(0);
    text(info.word, info.x, info.y);
  }

  // Draw disinfo
  for (let i = disinfoList.length - 1; i >= 0; i--) {
    let disinfo = disinfoList[i];
    disinfo.bounds = {
      x: disinfo.x,
      y: disinfo.y - fontsize,
      w: textWidth(disinfo.word),
      h: fontsize
    };

    if (disinfo.isShattered) {
      updateAndDrawFragments(disinfo);
      if (disinfo.fragments.every(f => f.alpha <= 0)) {
        disinfoList.splice(i, 1);
      }
      continue;
    }

    if (isMouseInBounds(disinfo.bounds)) {
      disinfo.x += random(-5, 5);
      disinfo.y += random(-5, 5);
      fill("#ab2734");
    } else {
      fill(0);
    }

    text(disinfo.word, disinfo.x, disinfo.y);
  }

  // Draw TITAN cursor
  fill("#0061f0");
  textSize(30);
  textFont(font);
  text("TITAN", mouseX + 10, mouseY + 5);
  textSize(fontsize);
}

function mousePressed() {
  userStartAudio(); // Ensure sound is allowed
  for (let disinfo of disinfoList) {
    if (!disinfo.isShattered && isMouseInBounds(disinfo.bounds)) {
      disinfo.isShattered = true;
      createFragments(disinfo);
      if (shatterSound && shatterSound.isLoaded()) {
        shatterSound.play();
      }
    }
  }
}

function createFragments(disinfo) {
  let chars = disinfo.word.split('');
  let offsetX = 0;
  for (let ch of chars) {
    let w = textWidth(ch);
    disinfo.fragments.push({
      char: ch,
      x: disinfo.x + offsetX,
      y: disinfo.y,
      vx: random(-2, 2),
      vy: random(-3, -1),
      alpha: 255
    });
    offsetX += w;
  }
}

function updateAndDrawFragments(disinfo) {
  for (let frag of disinfo.fragments) {
    frag.x += frag.vx;
    frag.y += frag.vy;
    frag.vy += 0.15;
    frag.alpha -= 4;
    fill(171, 39, 52, frag.alpha);
    text(frag.char, frag.x, frag.y);
  }
}

function isMouseInBounds(bounds) {
  return (
    mouseX >= bounds.x &&
    mouseX <= bounds.x + bounds.w &&
    mouseY >= bounds.y &&
    mouseY <= bounds.y + bounds.h
  );
}
