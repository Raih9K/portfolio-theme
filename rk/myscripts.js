var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

w = ctx.canvas.width = 800;
h = ctx.canvas.height = 230;

eyes = [];
tomoeArr = [];
config = {
  radius: 100,
  irisStep: 0.19,
  tomoeRings: 5,
  eyeDistance: 200,
  tomoeRotationSpeed: 1,
};

anim1Start = 0;
anim1Finish = 75;
anim2Start = 0;
anim2Finish = 30;

// Top Lid
anim1 = {
  on: true,
  time: 0,
  duration: 5,
  start: anim1Start,
  finish: anim1Finish,
  distance: anim1Finish - anim1Start,
  position: anim1Start,
  position2: anim1Start,
  flag: false,
};

// Bottom Lid
anim2 = {
  on: false,
  time: 0,
  duration: 5,
  start: anim2Start,
  finish: anim2Finish,
  distance: anim2Finish - anim2Start,
  position: anim2Start,
  position2: anim2Start,
  flag: false,
};

tomoePosC1 = {
  spx: -3,
  spy: 17,
  cp1x: -43,
  cp1y: 13,
  cp2x: -3,
  cp2y: -66,
  epx: 50,
  epy: -20,
};

tomoePosC2 = {
  cp1x: 40,
  cp1y: -30,
  cp2x: 15,
  cp2y: -30,
  epx: 20,
  epy: 4,
};

lidPosC1 = {
  // Top L
  cp1x: 150,
  cp1y: -47,
  cp2x: 24,
  cp2y: -14,
  epx: 150,
  epy: 150,
};

lidPosC2 = {
  // Bottom L
  cp1x: 60,
  cp1y: 37,
  cp2x: -63,
  cp2y: 150,
  epx: -149,
  epy: -102,
};

lidPosC3 = {
  // Top R
  cp1x: 150 * -1,
  cp1y: -47,
  cp2x: 24 * -1,
  cp2y: -14,
  epx: 150 * -1,
  epy: 150,
};

lidPosC4 = {
  // Bottom R
  cp1x: 60 * -1,
  cp1y: 37,
  cp2x: -63 * -1,
  cp2y: 150,
  epx: -149 * -1,
  epy: -102,
};

function render() {
  ctx.clearRect(0, 0, w, h);

  eyes.forEach((eye) => {
    eye.drawEye();
    eye.tomoeArr.forEach((tomoe) => {
      eye.drawTomoe(tomoe);
    });
    eye.drawEyeGlow();
    eye.drawEyeOverlay();
  });

  ctx.globalCompositeOperation = "lighten";
  calcField();
  noiseZ += noiseSpeed;
  drawParticles();
  ctx.globalCompositeOperation = "source-over";

  animEyeLids();

  requestAnimationFrame(render);
}

// ====== A N I M A T I O N

function animEyeLids() {
  anim1.time += 1 / 60;
  anim2.time += 1 / 60;

  if (!anim1.flag) {
    animF();
  } else {
    animB();
  }

  if (!anim2.flag) {
    //anim2F();
  } else {
    //anim2B();
  }
}

function animF() {
  anim1.position = easeInOutQuad(
    (anim1.time * 100) / anim1.duration,
    anim1.time,
    anim1.start,
    anim1.finish,
    anim1.duration
  );

  if (anim1.position >= anim1.finish) {
    anim1.time = 0;
    anim1.flag = true;
  }
}

function animB() {
  anim1.position2 = easeInOutQuad(
    (anim1.time * 100) / anim1.duration,
    anim1.time,
    anim1.start,
    anim1.finish,
    anim1.duration
  );

  if (anim1.position2 >= anim1.finish) {
    anim1.position = 0;
    anim1.position2 = 0;
    anim1.time = 0;
    anim1.flag = false;
  }
}

function anim2F() {
  anim2.position = easeInOutQuad(
    (anim2.time * 100) / anim2.duration,
    anim2.time,
    anim2.start,
    anim2.finish,
    anim2.duration
  );

  if (anim2.position >= anim2.finish) {
    anim2.time = 0;
    anim2.flag = true;
  }
}

function anim2B() {
  anim2.position2 = easeInOutQuad(
    (anim2.time * 100) / anim2.duration,
    anim2.time,
    anim2.start,
    anim2.finish,
    anim2.duration
  );

  if (anim2.position2 >= anim2.finish) {
    anim2.position = 0;
    anim2.position2 = 0;
    anim2.time = 0;
    anim2.flag = false;
  }
}

function init() {
  var eyeL = new Rinnegan("left");
  var eyeR = new Rinnegan("right");
  eyes.push(eyeL, eyeR);

  eyes.forEach((eye) => {
    eye.createTomoe();
  });
}

function easeInOutQuad(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t + b;
  } else {
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  }
}

// ====== R I N N E G A N

class Rinnegan {
  constructor(side) {
    this.side = side;
    if (side == "left") {
      this.centerX = w / 2 - config.eyeDistance;
    } else if (side == "right") {
      this.centerX = w / 2 + config.eyeDistance;
    }
    this.centerY = h / 2;
    this.tomoeArr = this.createTomoe();
  }

  createTomoe() {
    var tomoeTempArr = [];

    // Inner
    var t1 = new Tomoe(this.side, 0, 60, 1 * config.irisStep, 1);
    var t2 = new Tomoe(this.side, 120, 180, 1 * config.irisStep, 1);
    var t3 = new Tomoe(this.side, 240, 300, 1 * config.irisStep, 1);

    // Outer
    var t4 = new Tomoe(this.side, 60, 120, 2 * config.irisStep, 1);
    var t5 = new Tomoe(this.side, 180, 240, 2 * config.irisStep, 1);
    var t6 = new Tomoe(this.side, 300, 0, 2 * config.irisStep, 1);
    tomoeTempArr.push(t1, t2, t3, t4, t5, t6);

    return tomoeTempArr;
  }

  drawEye() {
    // Inner Purple
    var eyeInnerGrd = ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      config.radius
    );
    eyeInnerGrd.addColorStop(0, "#eab6ff");
    eyeInnerGrd.addColorStop(0.2, "#eab6ff");
    eyeInnerGrd.addColorStop(1, "#8a49a7");

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, config.radius, 0, Math.PI * 2);
    ctx.fillStyle = eyeInnerGrd;
    ctx.fill();
    ctx.closePath();

    // Iris
    ctx.beginPath();
    ctx.arc(
      this.centerX,
      this.centerY,
      config.radius * (1 - config.irisStep * (config.tomoeRings - 1)),
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#b962dd";
    ctx.fill();
    ctx.closePath();

    // Pupil
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, config.radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();

    // Draw the inner Lines
    for (var i = 0; i < config.tomoeRings; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.arc(
        this.centerX,
        this.centerY,
        config.radius * (1 - i * config.irisStep),
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.closePath();
    }
  }

  drawTomoe(tomoe) {
    tomoe.pos.x = tomoe.radius * Math.cos(tomoe.angle * (Math.PI / 180));
    tomoe.pos.y = tomoe.radius * Math.sin(tomoe.angle * (Math.PI / 180));
    var tpx = this.centerX + tomoe.pos.x;
    var tpy = this.centerY + tomoe.pos.y;

    ctx.save();
    ctx.translate(tpx, tpy);
    ctx.rotate(tomoe.angle2 * (Math.PI / 180));
    ctx.scale(0.28, 0.28);

    // Center
    ctx.beginPath();
    ctx.arc(0, 0, tomoe.size, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();

    // Curve
    ctx.beginPath();
    ctx.moveTo(0 + tomoePosC1.spx, 0 + tomoePosC1.spy);
    ctx.bezierCurveTo(
      0 + tomoePosC1.cp1x,
      0 + tomoePosC1.cp1y,
      0 + tomoePosC1.cp2x,
      0 + tomoePosC1.cp2y,
      0 + tomoePosC1.epx,
      0 + tomoePosC1.epy
    );
    ctx.bezierCurveTo(
      0 + tomoePosC2.cp1x,
      0 + tomoePosC2.cp1y,
      0 + tomoePosC2.cp2x,
      0 + tomoePosC2.cp2y,
      0 + tomoePosC2.epx,
      0 + tomoePosC2.epy
    );
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    if (this.side == "left") {
      tomoe.angle2 += tomoe.speed;
      tomoe.angle += tomoe.speed;
    } else if (this.side == "right") {
      tomoe.angle2 -= tomoe.speed;
      tomoe.angle -= tomoe.speed;
    }
  }

  drawEyeGlow() {
    var egr = 25;
    var egx = this.centerX - 50;
    var egy = this.centerY - 20;
    var eyeGlow = ctx.createRadialGradient(egx, egy, 0, egx, egy, egr);
    eyeGlow.addColorStop(0, "rgba(255,255,255,0.8)");
    eyeGlow.addColorStop(0.4, "rgba(255,255,255,0.8)");
    eyeGlow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(egx, egy, egr, 0, Math.PI * 2);
    ctx.fillStyle = eyeGlow;
    ctx.fill();
    ctx.closePath();
  }

  drawEyeOverlay() {
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10;

    if (this.side == "left") {
      var lidPosTop = lidPosC1;
      var lidPosBot = lidPosC2;
      var topTL = this.centerX - (config.radius - config.radius * 0);
      var tr = this.centerY - (config.radius - config.radius * 0.5);
      var tl2 = this.centerX + config.radius * 1.5;
      var tr2 = this.centerY + config.radius * 0.35;
      var offsetX = 50;
      var anim1Val = lidPosTop.cp1x - (anim1.position - anim1.position2);
      var anim2Val = lidPosBot.cp2x + (anim2.position - anim2.position2);
    } else if (this.side == "right") {
      var lidPosTop = lidPosC3;
      var lidPosBot = lidPosC4;
      var topTL = this.centerX + config.radius;
      var tr = this.centerY - (config.radius - config.radius * 0.5);
      var tl2 = this.centerX - config.radius * 1.5;
      var tr2 = this.centerY + config.radius * 0.35;
      var offsetX = -50;
      var anim1Val = lidPosTop.cp1x + (anim1.position - anim1.position2);
      var anim2Val = lidPosBot.cp2x - (anim2.position - anim2.position2);
    }

    // Top Part
    ctx.beginPath();
    ctx.moveTo(topTL, tr);
    ctx.bezierCurveTo(
      this.centerX + anim1Val,
      this.centerY + lidPosTop.cp1y,
      this.centerX + lidPosTop.cp2x,
      this.centerY + lidPosTop.cp2y,
      this.centerX + lidPosTop.epx,
      this.centerY + lidPosTop.epy
    );
    ctx.lineTo(this.centerX + lidPosTop.epx + offsetX, 0); // top right
    ctx.lineTo(topTL, 0); // top left
    ctx.closePath();

    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#000";
    ctx.fill();
    //ctx.stroke();

    // Bottom Part
    ctx.beginPath();
    ctx.moveTo(tl2, tr2);
    ctx.bezierCurveTo(
      this.centerX + lidPosBot.cp1x,
      this.centerY + lidPosBot.cp1y,
      this.centerX + lidPosBot.cp2x,
      this.centerY + lidPosBot.cp2y,
      this.centerX + lidPosBot.epx + offsetX,
      this.centerY + lidPosBot.epy
    );
    ctx.lineTo(this.centerX + lidPosBot.epx, h); // bot left
    ctx.lineTo(tl2, h); // top left
    ctx.closePath();

    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#000";
    ctx.fill();
    //ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

// ====== T O M O E

class Tomoe {
  constructor(side, ang, ang2, rad, dir) {
    this.pos = {
      x: 0,
      y: 0,
    };
    this.radius = config.radius * rad * 1.15;
    this.angle = ang;
    this.angle2 = ang2;
    this.speed = dir * config.tomoeRotationSpeed;
    this.size = 20;
    this.side = side;
  }
}

// ===== P A R T I C L E S
let field, fieldSize, columns, rows, noiseZ, particles, hue;
noiseZ = 0;
emitRate = 30;
emitCount = 5;
particleSize = 2;
fieldSize = 30;
fieldForce = 0.1;
noiseSpeed = 0.0005;
sORp = true;
trailLength = 0.5;
hueBase = 10;
hueRange = 10;
maxSpeed = 1;
glow = true;
lifetime = 750;

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
    this.acc = new Vector(0, 0);
    this.hue = Math.random() * (285 - 265) + 265;
    this.lif = Date.now();
    this.dur =
      Math.random() * (lifetime + lifetime / 2 - lifetime / 2) + lifetime / 2;
  }

  move(acc) {
    if (acc) {
      this.acc.addTo(acc);
    }
    this.vel.addTo(this.acc);
    this.pos.addTo(this.vel);
    if (this.vel.getLength() > maxSpeed) {
      this.vel.setLength(maxSpeed);
    }
    this.acc.setLength(0);
  }

  wrap() {
    if (this.pos.x > w) {
      this.pos.x = 0;
    } else if (this.pos.x < -this.fieldSize) {
      this.pos.x = w - 1;
    }
    if (this.pos.y > h) {
      this.pos.y = 0;
    } else if (this.pos.y < -this.fieldSize) {
      this.pos.y = h - 1;
    }
  }
}

function initParticles() {
  particles = [];
  let numberOfParticles = 1;
  for (let i = 0; i < numberOfParticles; i++) {
    var side = Math.random() < 0.5;
    let particle;
    if (side) {
      particle = new Particle(w / 2 + config.eyeDistance, h / 2);
    } else {
      particle = new Particle(w / 2 - config.eyeDistance, h / 2);
    }
    particles.push(particle);
  }
}

function pushParticles() {
  for (var i = 1; i < emitCount; i++) {
    var angle = Math.random() * Math.PI * 2;
    var dist = Math.random() * config.radius;
    var cx = Math.cos(angle) * dist;
    var cy = Math.sin(angle) * dist;

    var side = Math.random() < 0.5;
    let particle;
    if (side) {
      particle = new Particle(w / 2 + config.eyeDistance + cx, h / 2 + cy);
    } else {
      particle = new Particle(w / 2 - config.eyeDistance + cx, h / 2 + cy);
    }
    particles.push(particle);
  }
}

function initField() {
  field = new Array(columns);
  for (let x = 0; x < columns; x++) {
    field[x] = new Array(rows);
    for (let y = 0; y < rows; y++) {
      let v = new Vector(0, 0);
      field[x][y] = v;
    }
  }
}

function calcField() {
  if (sORp) {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let angle = noise.simplex3(x / 2, y / 2, noiseZ) * Math.PI * 2;
        let length =
          noise.simplex3(x / 40 + 40000, y / 40 + 40000, noiseZ) * fieldForce;
        field[x][y].setLength(length);
        field[x][y].setAngle(angle);
      }
    }
  } else {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let angle = noise.perlin3(x / 2, y / 2, noiseZ) * Math.PI * 2;
        let length =
          noise.perlin3(x / 40 + 40000, y / 40 + 40000, noiseZ) * fieldForce;
        field[x][y].setLength(length);
        field[x][y].setAngle(angle);
      }
    }
  }
}

function reset() {
  //ctx.strokeStyle = fieldColor;
  noise.seed(Math.random());
  columns = Math.round(w / fieldSize) + 1;
  rows = Math.round(h / fieldSize) + 1;
  initParticles();
  initField();
}

function drawParticles() {
  particles.forEach((p) => {
    if (p.lif + p.dur < Date.now()) {
      particles.splice(particles.indexOf(p), 1);
    }
    //var ps = p.fieldSize = Math.abs(p.vel.x + p.vel.y)*particleSize + 0.3;
    ctx.beginPath();
    var pcol =
      "hsl(" +
      (hueBase + p.hue + (p.vel.x + p.vel.y) * hueRange) +
      ", 100%, 60%)";
    ctx.fillStyle = pcol;
    ctx.fillRect(p.pos.x, p.pos.y, particleSize, particleSize);
    ctx.closePath();
    let pos = p.pos.div(fieldSize);
    let v;
    if (pos.x >= 0 && pos.x < columns && pos.y >= 0 && pos.y < rows) {
      v = field[Math.floor(pos.x)][Math.floor(pos.y)];
    }
    p.move(v);
    //p.wrap();
  });
}

var emitter = setInterval(pushParticles, emitRate);

init();
reset();
render();
!(function (t) {
  var o = (t.noise = {});
  function r(t, o, r) {
    (this.x = t), (this.y = o), (this.z = r);
  }
  (r.prototype.dot2 = function (t, o) {
    return this.x * t + this.y * o;
  }),
    (r.prototype.dot3 = function (t, o, r) {
      return this.x * t + this.y * o + this.z * r;
    });
  var n = [
      new r(1, 1, 0),
      new r(-1, 1, 0),
      new r(1, -1, 0),
      new r(-1, -1, 0),
      new r(1, 0, 1),
      new r(-1, 0, 1),
      new r(1, 0, -1),
      new r(-1, 0, -1),
      new r(0, 1, 1),
      new r(0, -1, 1),
      new r(0, 1, -1),
      new r(0, -1, -1),
    ],
    e = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
      120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
      71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
      133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
      135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
      226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
      152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
      246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ],
    a = new Array(512),
    i = new Array(512);
  (o.seed = function (t) {
    t > 0 && t < 1 && (t *= 65536), (t = Math.floor(t)) < 256 && (t |= t << 8);
    for (var o = 0; o < 256; o++) {
      var r;
      (r = 1 & o ? e[o] ^ (255 & t) : e[o] ^ ((t >> 8) & 255)),
        (a[o] = a[o + 256] = r),
        (i[o] = i[o + 256] = n[r % 12]);
    }
  }),
    o.seed(0);
  var d = 0.5 * (Math.sqrt(3) - 1),
    f = (3 - Math.sqrt(3)) / 6,
    h = 1 / 6;
  function u(t) {
    return t * t * t * (t * (6 * t - 15) + 10);
  }
  function s(t, o, r) {
    return (1 - r) * t + r * o;
  }
  (o.simplex2 = function (t, o) {
    var r,
      n,
      e = (t + o) * d,
      h = Math.floor(t + e),
      u = Math.floor(o + e),
      s = (h + u) * f,
      l = t - h + s,
      w = o - u + s;
    l > w ? ((r = 1), (n = 0)) : ((r = 0), (n = 1));
    var v = l - r + f,
      M = w - n + f,
      c = l - 1 + 2 * f,
      p = w - 1 + 2 * f,
      y = i[(h &= 255) + a[(u &= 255)]],
      x = i[h + r + a[u + n]],
      m = i[h + 1 + a[u + 1]],
      q = 0.5 - l * l - w * w,
      z = 0.5 - v * v - M * M,
      A = 0.5 - c * c - p * p;
    return (
      70 *
      ((q < 0 ? 0 : (q *= q) * q * y.dot2(l, w)) +
        (z < 0 ? 0 : (z *= z) * z * x.dot2(v, M)) +
        (A < 0 ? 0 : (A *= A) * A * m.dot2(c, p)))
    );
  }),
    (o.simplex3 = function (t, o, r) {
      var n,
        e,
        d,
        f,
        u,
        s,
        l = (t + o + r) * (1 / 3),
        w = Math.floor(t + l),
        v = Math.floor(o + l),
        M = Math.floor(r + l),
        c = (w + v + M) * h,
        p = t - w + c,
        y = o - v + c,
        x = r - M + c;
      p >= y
        ? y >= x
          ? ((n = 1), (e = 0), (d = 0), (f = 1), (u = 1), (s = 0))
          : p >= x
          ? ((n = 1), (e = 0), (d = 0), (f = 1), (u = 0), (s = 1))
          : ((n = 0), (e = 0), (d = 1), (f = 1), (u = 0), (s = 1))
        : y < x
        ? ((n = 0), (e = 0), (d = 1), (f = 0), (u = 1), (s = 1))
        : p < x
        ? ((n = 0), (e = 1), (d = 0), (f = 0), (u = 1), (s = 1))
        : ((n = 0), (e = 1), (d = 0), (f = 1), (u = 1), (s = 0));
      var m = p - n + h,
        q = y - e + h,
        z = x - d + h,
        A = p - f + 2 * h,
        b = y - u + 2 * h,
        g = x - s + 2 * h,
        j = p - 1 + 0.5,
        k = y - 1 + 0.5,
        B = x - 1 + 0.5,
        C = i[(w &= 255) + a[(v &= 255) + a[(M &= 255)]]],
        D = i[w + n + a[v + e + a[M + d]]],
        E = i[w + f + a[v + u + a[M + s]]],
        F = i[w + 1 + a[v + 1 + a[M + 1]]],
        G = 0.6 - p * p - y * y - x * x,
        H = 0.6 - m * m - q * q - z * z,
        I = 0.6 - A * A - b * b - g * g,
        J = 0.6 - j * j - k * k - B * B;
      return (
        32 *
        ((G < 0 ? 0 : (G *= G) * G * C.dot3(p, y, x)) +
          (H < 0 ? 0 : (H *= H) * H * D.dot3(m, q, z)) +
          (I < 0 ? 0 : (I *= I) * I * E.dot3(A, b, g)) +
          (J < 0 ? 0 : (J *= J) * J * F.dot3(j, k, B)))
      );
    }),
    (o.perlin2 = function (t, o) {
      var r = Math.floor(t),
        n = Math.floor(o);
      (t -= r), (o -= n);
      var e = i[(r &= 255) + a[(n &= 255)]].dot2(t, o),
        d = i[r + a[n + 1]].dot2(t, o - 1),
        f = i[r + 1 + a[n]].dot2(t - 1, o),
        h = i[r + 1 + a[n + 1]].dot2(t - 1, o - 1),
        l = u(t);
      return s(s(e, f, l), s(d, h, l), u(o));
    }),
    (o.perlin3 = function (t, o, r) {
      var n = Math.floor(t),
        e = Math.floor(o),
        d = Math.floor(r);
      (t -= n), (o -= e), (r -= d);
      var f = i[(n &= 255) + a[(e &= 255) + a[(d &= 255)]]].dot3(t, o, r),
        h = i[n + a[e + a[d + 1]]].dot3(t, o, r - 1),
        l = i[n + a[e + 1 + a[d]]].dot3(t, o - 1, r),
        w = i[n + a[e + 1 + a[d + 1]]].dot3(t, o - 1, r - 1),
        v = i[n + 1 + a[e + a[d]]].dot3(t - 1, o, r),
        M = i[n + 1 + a[e + a[d + 1]]].dot3(t - 1, o, r - 1),
        c = i[n + 1 + a[e + 1 + a[d]]].dot3(t - 1, o - 1, r),
        p = i[n + 1 + a[e + 1 + a[d + 1]]].dot3(t - 1, o - 1, r - 1),
        y = u(t),
        x = u(o),
        m = u(r);
      return s(s(s(f, v, y), s(h, M, y), m), s(s(l, c, y), s(w, p, y), m), x);
    });
})(this);
