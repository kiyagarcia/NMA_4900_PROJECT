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

function unlockAudio() {
  if (audioUnlocked) return;

  heartbeatSound.volume = 0;
  heartbeatSound.play().then(() => {
    heartbeatSound.pause();
    heartbeatSound.currentTime = 0;
    audioUnlocked = true;
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
    heartbeatSound.volume = 0.05;
    heartbeatSound.play().catch(() => {});
  }
});

// Cursor interaction
scene.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  hand.style.left = e.clientX + "px";
hand.style.top = e.clientY + "px";

  

  scene.style.filter = "none";

  if (cursorActive) {
  // make sure it's playing
  if (heartbeatSound.paused) {
    heartbeatSound.currentTime = 0;
    heartbeatSound.play().catch(() => {});
  }

  // smoother + audible volume curve
  heartbeatSound.volume = Math.max(0.05, proximity * 0.8);

  // slow → fast
  heartbeatSound.playbackRate = 0.6 + proximity * 1.6;
}


scene.style.setProperty('--distort', proximity);
scene.style.setProperty("--glow", Math.max(0, proximity));


 // Stop idle floating
 studentWrap.classList.remove("idle");
 shadowWrap.classList.remove("idle");
 scene.classList.remove("idle");


 // Get student center
 const rect = student.getBoundingClientRect();
 const centerX = rect.left + rect.width / 2;
 const centerY = rect.top + rect.height / 2;


 // Cursor distance from student
 const dx = e.clientX - centerX;
 const dy = e.clientY - centerY;
 const distance = Math.sqrt(dx * dx + dy * dy);

 const eyes = document.querySelectorAll(".shadow-eye");

eyes.forEach(eye => {
  const moveX = dx * 0.01;
  const moveY = dy * 0.01;
  const scale = 1 + proximity * 1.2;

const angle = proximity > 0.4 ? 25 : 0;

eye.style.transform = `
  translate(${moveX}px, ${moveY}px)
  scale(${scale})
  rotate(${eye.classList.contains('left-eye') ? angle : -angle}deg)
`;});


 const maxDistance = 400;
 const clamped = Math.min(distance, maxDistance);

 proximity = 1 - clamped / maxDistance;
 
 const shield = document.getElementById("shield");

const shieldStart = 0.45;
const shieldEnd = 0.85;

let shieldStrength = 0;

if (proximity > shieldStart) {
  shieldStrength = (proximity - shieldStart) / (shieldEnd - shieldStart);
  shieldStrength = Math.min(shieldStrength, 1);
}

// opacity grows clearly
shield.style.opacity = shieldStrength * 0.8;

// slight scale up makes it feel like it's "activating"
const shieldScale = 1 + shieldStrength * 0.05;
shield.style.transform = `translate(-50%, -50%) scale(${shieldScale})`;

 if (proximity > 0.6 && !heartTriggered) {
  heartTriggered = true;

  // restart visual
  heart.style.animation = "none";
  heart.offsetHeight;
  heart.style.animation = "heartbeat 2.2s ease-in-out infinite";

  // 🔥 THIS is what you add
  heartbeatSound.currentTime = 0;

  // make sure it plays
  heartbeatSound.play().catch(() => {});
}

if (cursorActive) {
  if (heartbeatSound.paused) {
    heartbeatSound.play().catch(() => {});
  }

  heartbeatSound.volume = Math.max(0.05, proximity * 0.8);
  heartbeatSound.playbackRate = 0.6 + proximity * 1.6;
}

 if (proximity > 0.5) {
  hand.style.transform = "translate(-50%, -50%) rotate(90deg) scale(1.1)";
} else {
  hand.style.transform = "translate(-50%, -50%) rotate(90deg) scale(1)";
}

let targetMoveX = 0;
let targetMoveY = 0;
let targetScale = 1;

// TRUE HUG STATE
if (isHugging) {
  targetMoveX = 0;
  targetMoveY = 0;
  targetScale = 1.75;
}

targetMoveX = 0;
targetMoveY = 0;

if (isHugging) {
  targetScale = 1.75;
} else {
  targetScale = 1 + proximity * 0.2;
}


 // Easing
const ease = isHugging ? 0.05 : 0.08;
currentMoveX += (targetMoveX - currentMoveX) * ease;
currentMoveY += (targetMoveY - currentMoveY) * ease;
currentScale += (targetScale - currentScale) * ease;


 // Apply shadow transform
shadow.style.transform =
  `translate(-50%, -50%) scale(${currentScale})`;


 // Student fades slightly
student.style.opacity = 1 - proximity * 0.9;
 // Environment color shift
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
  // same shieldStrength we calculated earlier
  core.style.background = `rgba(15, 15, 34, ${0.6 - shieldStrength * 0.1})`;
}

 // Heart response
 if (heart) {
  const beatSpeed = 2.6 - proximity * 2.0;
  const scale = 1 + proximity * 0.15;

  heart.style.animationDuration = `${beatSpeed}s`;
  heart.style.opacity = 0.5 + proximity * 0.5;
  heart.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(45deg)`;
}

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
