let dom_replay = document.querySelector("#replay");
let dom_score = document.querySelector("#score");
let dom_canvas = document.createElement("canvas");
document.querySelector("#canvas").appendChild(dom_canvas);
let CTX = dom_canvas.getContext("2d");

const W = (dom_canvas.width = 500);
const H = (dom_canvas.height = 500);

let snake,
  food,
  currentHue,
  cells = 20,
  cellSize,
  isGameOver = false,
  score = 0,
  maxScore = window.localStorage.getItem("maxScore") || 0,
  particles = [],
  splashingParticleCount = 20,
  cellsCount,
  lastFrameTime = performance.now(),
  deltaTime = 0;

let helpers = {
  Vec: class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    mult(v) {
      if (v instanceof helpers.Vec) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
      } else {
        this.x *= v;
        this.y *= v;
        return this;
      }
    }
  },
  isCollision(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y;
  },
  garbageCollector() {
    particles = particles.filter(p => p.size > 0);
  },
  drawGrid() {
    CTX.lineWidth = 0.2;
    CTX.strokeStyle = "#a9d995";
    CTX.shadowBlur = 0;
    for (let i = 1; i < cells; i++) {
      let f = (W / cells) * i;
      CTX.beginPath();
      CTX.moveTo(f, 0);
      CTX.lineTo(f, H);
      CTX.stroke();
      CTX.beginPath();
      CTX.moveTo(0, f);
      CTX.lineTo(W, f);
      CTX.stroke();
      CTX.closePath();
    }
  },
  randHue() {
    return ~~(Math.random() * 360);
  },
  hsl2rgb(hue, saturation, lightness) {
    if (hue === undefined) {
      return [0, 0, 0];
    }
    var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    var huePrime = hue / 60;
    var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
    huePrime = ~~huePrime;
    var red, green, blue;
    if (huePrime === 0) {
      red = chroma;
      green = secondComponent;
      blue = 0;
    } else if (huePrime === 1) {
      red = secondComponent;
      green = chroma;
      blue = 0;
    } else if (huePrime === 2) {
      red = 0;
      green = chroma;
      blue = secondComponent;
    } else if (huePrime === 3) {
      red = 0;
      green = secondComponent;
      blue = chroma;
    } else if (huePrime === 4) {
      red = secondComponent;
      green = 0;
      blue = chroma;
    } else if (huePrime === 5) {
      red = chroma;
      green = 0;
      blue = secondComponent;
    }
    var lightnessAdjustment = lightness - chroma / 2;
    red += lightnessAdjustment;
    green += lightnessAdjustment;
    blue += lightnessAdjustment;
    return [
      Math.round(red * 255),
      Math.round(green * 255),
      Math.round(blue * 255)
    ];
  },
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }
};

let KEY = {
  ArrowUp: false,
  ArrowRight: false,
  ArrowDown: false,
  ArrowLeft: false,
  resetState() {
    this.ArrowUp = false;
    this.ArrowRight = false;
    this.ArrowDown = false;
    this.ArrowLeft = false;
  },
  listen() {
    addEventListener(
      "keydown",
      (e) => {
        if (e.key === "ArrowUp" && this.ArrowDown) return;
        if (e.key === "ArrowDown" && this.ArrowUp) return;
        if (e.key === "ArrowLeft" && this.ArrowRight) return;
        if (e.key === "ArrowRight" && this.ArrowLeft) return;
        this[e.key] = true;
        Object.keys(this)
          .filter((f) => f !== e.key && f !== "listen" && f !== "resetState")
          .forEach((k) => {
            this[k] = false;
          });
      },
      false
    );
  }
};

// Define variables to track touch start and end positions
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Function to handle touch start event
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

// Function to handle touch end event
function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;
  
  // Calculate swipe direction based on start and end positions
  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;
  
  // Determine the dominant direction of the swipe
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0) {
      // Right swipe
      KEY.ArrowRight = true;
    } else {
      // Left swipe
      KEY.ArrowLeft = true;
    }
  } else {
    // Vertical swipe
    if (deltaY > 0) {
      // Down swipe
      KEY.ArrowDown = true;
    } else {
      // Up swipe
      KEY.ArrowUp = true;
    }
  }
}

// Add event listeners for touch events
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchend", handleTouchEnd, false);

class Snake {
  constructor(i, type) {
    this.pos = new helpers.Vec(W / 2, H / 2);
    this.dir = new helpers.Vec(0, 0);
    this.type = type;
    this.index = i;
    this.delay = 5;
    this.size = W / cells;
    this.color = "#a9d995";
    this.history = [];
    this.total = 1;
  }
  draw() {
    let { x, y } = this.pos;
    CTX.fillStyle = this.color;
    CTX.shadowBlur = 30;
    CTX.shadowColor = "rgba(255,255,255,0.5)";
    CTX.fillRect(x, y, this.size, this.size);
    CTX.shadowBlur = 10;
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i];
        CTX.lineWidth = 1;
        CTX.fillStyle = "rgba(225,225,225,1)";
        CTX.fillRect(x, y, this.size, this.size);
      }
    }
  }
  walls() {
    let { x, y } = this.pos;
    if (x + cellSize > W) {
      this.pos.x = 0;
    }
    if (y + cellSize > W) {
      this.pos.y = 0;
    }
    if (y < 0) {
      this.pos.y = H - cellSize;
    }
    if (x < 0) {
      this.pos.x = W - cellSize;
    }
  }
  controlls() {
    let dir = this.size;
    if (KEY.ArrowUp) {
      this.dir = new helpers.Vec(0, -dir);
    }
    if (KEY.ArrowDown) {
      this.dir = new helpers.Vec(0, dir);
    }
    if (KEY    .ArrowLeft) {
      this.dir = new helpers.Vec(-dir, 0);
    }
    if (KEY.ArrowRight) {
      this.dir = new helpers.Vec(dir, 0);
    }
  }
  selfCollision() {
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      if (helpers.isCollision(this.pos, p)) {
        isGameOver = true;
      }
    }
  }
  update(deltaTime) {
    this.walls();
    this.draw();
    this.controlls();
    if (!this.delay) {
      if (helpers.isCollision(this.pos, food.pos)) {
        incrementScore();
        particleSplash();
        food.spawn();
        this.total++;
      }
      this.history[this.total - 1] = new helpers.Vec(this.pos.x, this.pos.y);
      for (let i = 0; i < this.total - 1; i++) {
        this.history[i] = this.history[i + 1];
      }
      this.pos.add(this.dir);
      this.delay = 5;
      this.total > 3 ? this.selfCollision() : null;
    } else {
      this.delay--;
    }
  }
}

class Food {
  constructor() {
    this.pos = new helpers.Vec(
      ~~(Math.random() * cells) * cellSize,
      ~~(Math.random() * cells) * cellSize
    );
    this.color = currentHue = `hsl(${~~(Math.random() * 360)},100%,50%)`;
    this.size = cellSize;
  }

  draw() {
    let { x, y } = this.pos;

    // Create pulsating animation
    let pulse = Math.sin(Date.now() * 0.01) * 0.1 + 1; // Sinusoidal pulsation
    let newSize = this.size * pulse;
    let offset = (this.size - newSize) / 2;
    CTX.globalCompositeOperation = "lighter";
    CTX.shadowBlur = 20;
    CTX.shadowColor = this.color;
    CTX.fillStyle = this.color;
    CTX.globalCompositeOperation = "source-over";
    CTX.shadowBlur = 0;

    // Draw the pulsating food
    CTX.beginPath();
    CTX.arc(x + this.size / 2, y + this.size / 2, newSize / 2, 0, Math.PI * 2);
    CTX.fillStyle = this.color;
    CTX.fill();
  }

  spawn() {
    let randX = ~~(Math.random() * cells) * this.size;
    let randY = ~~(Math.random() * cells) * this.size;
    for (let path of snake.history) {
      if (helpers.isCollision(new helpers.Vec(randX, randY), path)) {
        return this.spawn();
      }
    }
    this.color = currentHue;
    this.pos = new helpers.Vec(randX, randY);
  }
}

class Particle {
  constructor(pos, color, size, vel) {
    this.pos = pos;
    this.color = color;
    this.size = Math.abs(size / 2);
    this.ttl = 0;
    this.gravity = -0.2;
    this.vel = vel;
  }
  draw() {
    let { x, y } = this.pos;
    let hsl = this.color
      .split("")
      .filter((l) => l.match(/[^hsl()$% ]/g))
      .join("")
      .split(",")
      .map((n) => +n);
    let [r, g, b] = helpers.hsl2rgb(hsl[0], hsl[1] / 100, hsl[2] / 100);
    CTX.shadowColor = `rgb(${r},${g},${b},${1})`;
    CTX.shadowBlur = 0;
    CTX.globalCompositeOperation = "lighter";
    CTX.fillStyle = `rgb(${r},${g},${b},${1})`;
    CTX.fillRect(x, y, this.size, this.size);
    CTX.globalCompositeOperation = "source-over";
  }
  update() {
    this.draw();
    this.size -= 0.3;
    this.ttl += 1;
    this.pos.add(this.vel);
    this.vel.y -= this.gravity;
  }
}

function incrementScore() {
  score++;
  dom_score.innerText = score.toString().padStart(2, "0");
}

function particleSplash() {
  const particleCount = 50; // Number of particles to create

  for (let i = 0; i < particleCount; i++) {
    let size = Math.random() * 10 + 5; // Random size between 5 and 15
    let vel = new helpers.Vec(Math.random() * 6 - 3, Math.random() * 6 - 3); // Random velocity
    let position = new helpers.Vec(food.pos.x + food.size / 2, food.pos.y + food.size / 2); // Position at the center of the food

    let hue = currentHue; // Use the hue of the current food

    particles.push(new Particle(position, hue, size, vel)); // Create and add particle to the particles array
  }
}

function clear() {
  CTX.clearRect(0, 0, W, H);
}

function initialize() {
  CTX.imageSmoothingEnabled = false;
  KEY.listen();
  cellsCount = cells * cells;
  cellSize = W / cells;
  snake = new Snake();
  food = new Food();
  dom_replay.addEventListener("click", reset, false);
  loop();
}

function loop() {
  let currentTime = performance.now();
  deltaTime = (currentTime - lastFrameTime) / 1000; // Convert milliseconds to seconds
  lastFrameTime = currentTime;
  
  clear();
  if (!isGameOver) {
    requestAnimationFrame(loop);
    helpers.drawGrid();
    snake.update(deltaTime);
    food.draw();
    for (let p of particles) {
      p.update();
    }
    helpers.garbageCollector();
  } else {
    clear();
    gameOver();
  }
}

function gameOver() {
  maxScore = Math.max(score, maxScore);
  window.localStorage.setItem("maxScore", maxScore);
  CTX.fillStyle = "#a9d995";
  CTX.textAlign = "center";
  CTX.font = "bold 30px Poppins, sans-serif";
  CTX.fillText("GAME OVER", W / 2, H / 2);
  CTX.font = "15px Poppins, sans-serif";
  CTX.fillText(`SCORE   ${score}`, W / 2, H / 2 + 60);
  CTX.fillText(`MAXSCORE   ${maxScore}`, W / 2, H / 2 + 80);
}

function reset() {
  dom_score.innerText = "00";
  score = 0;
  snake = new Snake();
  food.spawn();
  KEY.resetState();
  isGameOver = false;
  loop();
}

initialize();

