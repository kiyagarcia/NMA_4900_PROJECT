// Get references to everything we need on the page
const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");
const studentWrap = document.getElementById("studentWrap");
const shadowWrap = document.getElementById("shadowWrap");
const heart = document.getElementById("heart");
const arms = document.querySelectorAll(".arm");
const bubbleCount = 12;


let cursorActive = false;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let proximity = 0;

function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  // RANDOM SIZE
const size = Math.random() * 30 + 20;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  // RANDOM X POSITION
  bubble.style.left = `${Math.random() * 100}%`;

  // RANDOM SPEED
  const duration = Math.random() * 4 + 5;
  bubble.style.animationDuration = `${duration}s`;

  scene.appendChild(bubble);

  // REMOVE + RESPAWN (INFINITE LOOP)
  setTimeout(() => {
    bubble.remove();
    createBubble();
  }, duration * 1000);
}

function spawnDangerBubble() {
  if (Math.random() > 0.08) return;

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "danger");

const size = Math.random() * 35 + 25;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.top = `-20px`;

  scene.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 1500);
}

for (let i = 0; i < bubbleCount; i++) {
  setTimeout(() => {
    createBubble();
  }, Math.random() * 2000);
}

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
  document.body.classList.add("hugging-arms");
});

student.addEventListener("mouseleave", () => {
  isHugging = false;
  shadow.classList.remove("hugging");
  document.body.classList.remove("hugging-arms");
});


  scene.addEventListener("mouseenter", () => {
  cursorActive = true;
});

// Cursor interaction
scene.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  scene.style.filter = "none";

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

  eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
});


 const maxDistance = 400;
 const clamped = Math.min(distance, maxDistance);


 // 0 far, 1 close
proximity = 1 - clamped / maxDistance;
 const shapes = document.querySelectorAll(".bg-shape");

shapes.forEach(shape => {
  shape.style.transform = `scale(${1 - proximity * 0.5})`;
  shape.style.opacity = 0.2 - proximity * 0.2;
});


 eyes.forEach(eye => {
  const scale = 1 + proximity * 1.2;
  eye.style.transform += ` scale(${scale})`;
});



let targetMoveX = 0;
let targetMoveY = 0;
let targetScale = 1;

// TRUE HUG STATE
if (isHugging) {
  targetMoveX = 0;
  targetMoveY = 0;
  targetScale = 1.75;
}

// PROXIMITY RESPONSE
else if (proximity > 0.1) {
targetMoveX = dx * 0.08;
targetMoveY = dy * 0.08;
targetScale = 1 + proximity * 0.3;}


 // Easing
const ease = isHugging ? 0.05 : 0.08;
currentMoveX += (targetMoveX - currentMoveX) * ease;
currentMoveY += (targetMoveY - currentMoveY) * ease;
currentScale += (targetScale - currentScale) * ease;


 // Apply shadow transform
shadow.style.transform =
  `translate(${currentMoveX}px, ${currentMoveY}px) scale(${currentScale})`;


 // Student fades slightly
 student.style.opacity = 1 - proximity * 0.5;


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

shadow.querySelector(".shadow-core").style.background =
  `rgba(15, 15, 34, ${0.6 + proximity * 0.4})`;

 // Heart response
 if (heart) {
   heart.style.animationDuration = `${2.2 - proximity * 1.2}s`;
   heart.style.opacity = 0.4 + proximity * 0.4;
 }

});


// Cursor leaves scene
scene.addEventListener("mouseleave", () => {

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

function handleBubbleStates(proximity) {
  const bubbles = document.querySelectorAll(".bubble");

  bubbles.forEach(bubble => {

    // BEFORE CURSOR → ONLY FLOAT
    if (!cursorActive) {
      bubble.classList.remove("freeze", "danger");
      bubble.style.animationPlayState = "running";
      return;
    }

    // FAR
    if (proximity < 0.4) {
bubble.classList.remove("freeze", "danger", "warning");
      bubble.style.animationPlayState = "running";
    }

    // MID (freeze)
    else if (proximity >= 0.4 && proximity < 0.75) {
  bubble.classList.add("freeze");
  bubble.classList.add("warning");
  bubble.style.animationPlayState = "paused";
}

    // CLOSE (transform)
    else {
      if (!bubble.classList.contains("danger")) {
        bubble.classList.remove("freeze");
        bubble.classList.add("danger");
      }
    }

  });

  // 🚫 BLOCK SPAWN BEFORE CURSOR
  if (cursorActive && proximity > 0.75) {
    spawnDangerBubble();
  }
}

function update() {

  const rect = student.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance = 400;
  const clamped = Math.min(distance, maxDistance);

  proximity = 1 - clamped / maxDistance;

if (cursorActive) {
  handleBubbleStates(proximity);
}
  requestAnimationFrame(update);
}

update();
