// Get references to everything we need on the page
const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");
const studentWrap = document.getElementById("studentWrap");
const shadowWrap = document.getElementById("shadowWrap");
const heart = document.getElementById("heart");
const arms = document.querySelectorAll(".arm");


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


// Cursor interaction
scene.addEventListener("mousemove", (e) => {


 // Stop idle floating
 studentWrap.classList.remove("idle");
 shadowWrap.classList.remove("idle");


 // Get student center
 const rect = student.getBoundingClientRect();
 const centerX = rect.left + rect.width / 2;
 const centerY = rect.top + rect.height / 2;


 // Cursor distance from student
 const dx = e.clientX - centerX;
 const dy = e.clientY - centerY;
 const distance = Math.sqrt(dx * dx + dy * dy);


 const maxDistance = 400;
 const clamped = Math.min(distance, maxDistance);


 // 0 far, 1 close
 const proximity = 1 - clamped / maxDistance;


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
  targetScale = 1 + proximity * 0.4;
}


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

shadow.style.background = isHugging
  ? "rgba(15, 15, 34, 0.9)"
  : "rgba(15, 15, 34, 0.7)";

 // Heart response
 if (heart) {
   heart.style.animationDuration = `${2.2 - proximity * 1.2}s`;
   heart.style.opacity = 0.4 + proximity * 0.4;
 }
});


// Cursor leaves scene
scene.addEventListener("mouseleave", () => {


 // Resume idle floating
 studentWrap.classList.add("idle");
 shadowWrap.classList.add("idle");


 // Reset visuals
 student.style.opacity = "1";
 shadow.style.transform = "translate(0px, 0px) scale(1)";


 scene.style.background =
   "radial-gradient(circle at center, #9fb6d9, #2a4f8a)";


 if (heart) {
   heart.style.animationDuration = "2.2s";
   heart.style.opacity = "0.6";
 }


 currentMoveX = 0;
 currentScale = 1;
});
