// Get references to everything we need on the page
const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");
const studentWrap = document.getElementById("studentWrap");
const shadowWrap = document.getElementById("shadowWrap");
const heart = document.getElementById("heart");


// Start in the idle state
studentWrap.classList.add("idle");
shadowWrap.classList.add("idle");


// Track shadow movement and scale for easing
let currentMoveX = 0;
let currentScale = 1;


// Color presets for environment emotion
const calmInner = { r: 159, g: 182, b: 217 };
const calmOuter = { r: 42, g: 79, b: 138 };


const dangerInner = { r: 160, g: 60, b: 60 };
const dangerOuter = { r: 60, g: 10, b: 10 };


// Utility for color interpolation
function mix(a, b, t) {
 return Math.round(a + (b - a) * t);
}


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


 let targetMoveX;
 let targetScale;


 // Approach state
 if (proximity < 0.75) {
   targetMoveX = proximity * 40;
   targetScale = 1 + proximity * 0.3;
 }
 // Hug state
 else {
   targetMoveX = 0;
   targetScale = 1.45;
 }


 // Easing
 const ease = 0.08;
 currentMoveX += (targetMoveX - currentMoveX) * ease;
 currentScale += (targetScale - currentScale) * ease;


 // Apply shadow transform
 shadow.style.transform =
   `translate(${currentMoveX}px, 0px) scale(${currentScale})`;


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
