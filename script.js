// Get references to everything we need on the page
const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");
const studentWrap = document.getElementById("studentWrap");
const shadowWrap = document.getElementById("shadowWrap");
const heart = document.getElementById("heart");
const heartbeatSound = document.getElementById("heartbeatSound");
const hand = document.getElementById("hand");
let heartTriggered = false;

let audioUnlocked = false;
let isTouching = false;

function unlockAudio() {
  if (audioUnlocked) return;

  heartbeatSound.muted = true;

  heartbeatSound.play().then(() => {
    audioUnlocked = true;

    heartbeatSound.pause();
    heartbeatSound.currentTime = 0;

    heartbeatSound.muted = false;

    const instruction = document.getElementById("soundInstruction");

if (instruction) {
  // wait a bit so user actually processes it
  setTimeout(() => {
    instruction.classList.add("fade-out");
  }, 1200); // 1.2 seconds delay before fading
}

    // 👇 start it immediately after unlocking
    heartbeatSound.play().catch(() => {});
  }).catch(() => {});
}

// real interactions browsers accept
window.addEventListener("click", unlockAudio);
window.addEventListener("keydown", unlockAudio);


shadowWrap.style.opacity = "1";
document.body.classList.add("shadow-active");

let cursorActive = false;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let proximity = 0;


scene.classList.add("idle");

// Start in the idle state
studentWrap.classList.add("idle");
shadowWrap.classList.add("idle");


// Track shadow movement and scale for easing
let currentMoveX = 0;
let currentMoveY = 0;
let currentScale = 1;
let isHugging = false;

// Color presets for environment emotion
const calmInner = { r: 159, g: 182, b: 217 };
const calmOuter = { r: 42, g: 79, b: 138 };


const dangerInner = { r: 160, g: 60, b: 60 };
const dangerOuter = { r: 60, g: 10, b: 10 };


// Utility for color interpolation
function mix(a, b, t) {
 return Math.round(a + (b - a) * t);
}

student.addEventListener("mouseenter", () => {
  isHugging = true;
  shadow.classList.add("hugging");
});

heart.addEventListener("mouseenter", () => {
  heart.style.transform = "translate(-50%, -50%) scale(1.3) rotate(45deg)";
});

heart.addEventListener("mouseleave", () => {
  heart.style.transform = "translate(-50%, -50%) scale(1) rotate(45deg)";
}); 

student.addEventListener("mouseleave", () => {
  isHugging = false;
  shadow.classList.remove("hugging");
});


  scene.addEventListener("mouseenter", () => {
  cursorActive = true;

  if (audioUnlocked) {
    heartbeatSound.currentTime = 0; // 🔥 start fresh every time
    heartbeatSound.play().catch(() => {});
  }
});

// 🔥 MAIN INTERACTION FUNCTION (mouse + touch both use this)
function handleMove(x, y) {

  mouseX = x;
  mouseY = y;

  hand.style.left = x + "px";
  hand.style.top = y + "px";

  scene.style.filter = "none";

  if (cursorActive && audioUnlocked) {
    heartbeatSound.play().catch(() => {});
    heartbeatSound.volume = Math.max(0.08, proximity * 0.8);
    heartbeatSound.playbackRate = 0.7 + proximity * 1.6;
  }

  scene.style.setProperty('--distort', proximity);
  scene.style.setProperty("--glow", Math.max(0, proximity));

  studentWrap.classList.remove("idle");
  shadowWrap.classList.remove("idle");
  scene.classList.remove("idle");

  // 📍 get center of student
  const rect = student.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance = 700;
  const clamped = Math.min(distance, maxDistance);

  let raw = 1 - clamped / maxDistance;
  proximity = Math.pow(raw, 1.5);

  // 👁️ EYES FOLLOW
  const eyes = document.querySelectorAll(".shadow-eye");

  eyes.forEach(eye => {
  const moveX = dx * 0.01;
  const moveY = dy * 0.01;

  // 👇 make eyes grow
  const scale = 1 + proximity * 1.4;

  // 👇 stronger angles
  const angle = proximity > 0.65 ? 55 : proximity > 0.35 ? 25 : 0;

  // 👇 THIS is the key part
  if (proximity > 0.6) {
    // angry eye shape
    eye.style.borderRadius = "0 0 100px 100px";
    eye.style.height = "10px"; 
  } else {
    // normal circle
    eye.style.borderRadius = "50%";
    eye.style.height = "16px";
  }

  eye.style.transform = `
    translate(${moveX}px, ${moveY}px)
    scale(${scale})
    rotate(${eye.classList.contains('left-eye') ? angle : -angle}deg)
  `;
});

  // 🔁 SWITCH STUDENT IMAGE
  const studentImg = document.querySelector(".student-img");

  if (proximity > 0.85) {
    studentImg.src = "The_Self_Design_crossed.svg";
  } else {
    studentImg.src = "The_Self_Design_2.svg";
  }

  // 🛡️ SHIELD
  const shield = document.getElementById("shield");

  const shieldStart = 0.3;
  const shieldEnd = 0.85;

  let shieldStrength = 0;

  if (proximity > shieldStart) {
    shieldStrength = (proximity - shieldStart) / (shieldEnd - shieldStart);
    shieldStrength = Math.min(shieldStrength, 1);
  }

  shield.style.opacity = shieldStrength * 0.8;

  const shieldScale = 1 + shieldStrength * 0.05;
  shield.style.transform = `translate(-50%, -50%) scale(${shieldScale})`;

  // ❤️ HEART
  if (proximity > 0.6 && !heartTriggered) {
    heartTriggered = true;

    heart.style.animation = "none";
    heart.offsetHeight;
    heart.style.animation = "heartbeat 2.2s ease-in-out infinite";
  }

  const beatSpeed = 2.6 - proximity * 2.0;
  const heartScale = 1 + proximity * 0.15;

  heart.style.animationDuration = `${beatSpeed}s`;
  heart.style.opacity = 0.5 + proximity * 0.5;
  heart.style.transform = `translate(-50%, -50%) scale(${heartScale}) rotate(45deg)`;

  // ✋ HAND SCALE
  if (proximity > 0.5) {
    hand.style.transform = "translate(-50%, -50%) rotate(90deg) scale(1.1)";
  } else {
    hand.style.transform = "translate(-50%, -50%) rotate(90deg) scale(1)";
  }

  // 🌑 SHADOW SCALE
  let targetScale;

if (proximity > 0.7) {
  targetScale = 1.9; // 🔥 BIG defensive mode
} else if (proximity > 0.4) {
  targetScale = 1.3; // mid alert
} else {
  targetScale = 1; // calm
}

  const ease = isHugging ? 0.05 : 0.08;
  if ("ontouchstart" in window) {
  currentScale = targetScale; // 🔥 instant for touch
} else {
  currentScale += (targetScale - currentScale) * ease;
}

  shadow.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

  // 👤 STUDENT FADE
  student.style.opacity = 1 - proximity * 0.9;

  // 🎨 BACKGROUND COLOR SHIFT
  const t = proximity;

  const innerColor = `rgb(
    ${mix(calmInner.r, dangerInner.r, t)},
    ${mix(calmInner.g, dangerInner.g, t)},
    ${mix(calmInner.b, dangerInner.b, t)}
  )`;

  const outerColor = `rgb(
    ${mix(calmOuter.r, dangerOuter.r, t)},
    ${mix(calmOuter.g, dangerOuter.g, t)},
    ${mix(calmOuter.b, dangerOuter.b, t)}
  )`;

  scene.style.background =
    `radial-gradient(circle at center, ${innerColor}, ${outerColor})`;

  const core = shadow.querySelector(".shadow-core");

  if (core) {
    core.style.background = `rgba(15, 15, 34, ${0.6 + proximity * 0.3})`;
  }
}


scene.addEventListener("mousemove", (e) => {
  handleMove(e.clientX, e.clientY);
});

// TOUCH START
scene.addEventListener("touchstart", (e) => {
  isTouching = true;
  cursorActive = true;

  const touch = e.touches[0];

  mouseX = touch.clientX;
  mouseY = touch.clientY;

  handleMove(mouseX, mouseY);

}, { passive: false });

// TOUCH MOVE
scene.addEventListener("touchmove", (e) => {
  if (!isTouching) return;

  e.preventDefault();

  const touch = e.touches[0];

  // 🔥 THIS LINE IS THE FIX
  mouseX = touch.clientX;
  mouseY = touch.clientY;

  handleMove(mouseX, mouseY);

}, { passive: false });

// TOUCH END (this is IMPORTANT)
scene.addEventListener("touchend", () => {
  isTouching = false;
});

// Cursor leaves scene
scene.addEventListener("mouseleave", () => {

  heartbeatSound.pause();
heartbeatSound.currentTime = 0;

cursorActive = false;

 // Resume idle floating
 studentWrap.classList.add("idle");
 shadowWrap.classList.add("idle");




 // Reset visuals
 student.style.opacity = "1";
 shadow.style.transform = "translate(0px, 0px) scale(1)";
scene.classList.add("idle");


 scene.style.background =
   "radial-gradient(circle at center, #9fb6d9, #2a4f8a)";


 if (heart) {
   heart.style.animationDuration = "2.2s";
   heart.style.opacity = "0.6";
 }


 currentMoveX = 0;
 currentScale = 1;
});
