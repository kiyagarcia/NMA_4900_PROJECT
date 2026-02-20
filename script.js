// Get references to everything we need on the page.
// scene = the full environment
// student = the visible self
// shadow = the protector that moves and scales
// studentWrap / shadowWrap = containers that handle floating when idle
const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");
const studentWrap = document.getElementById("studentWrap");
const shadowWrap = document.getElementById("shadowWrap");

// Start in the idle state.
// Idle means: cursor is not interacting,
// so both figures gently float and just "exist".
studentWrap.classList.add("idle");
shadowWrap.classList.add("idle");

// These track the current position and size of the shadow.
// We use these to smoothly ease movement instead of snapping.
let currentMoveX = 0;
let currentScale = 1;

// This runs whenever the cursor moves inside the scene.
// Cursor presence = attention = potential threat,
// so the protector begins responding.
scene.addEventListener("mousemove", (e) => {

  // Stop idle floating as soon as the user interacts.
  // Freezes both figures exactly where they are.
  studentWrap.classList.remove("idle");
  shadowWrap.classList.remove("idle");

  // Get the student’s position on screen
  const rect = student.getBoundingClientRect();

  // Calculate the exact center point of the student
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Measure how far the cursor is from the student
  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Limit how far distance calculations go
  // so behavior stays controlled
  const maxDistance = 400;
  const clamped = Math.min(distance, maxDistance);

  // Convert distance into proximity:
  // 0 = far away, 1 = very close
  const proximity = 1 - clamped / maxDistance;

  let targetMoveX;
  let targetScale;

  // APPROACH STATE
  // When the cursor is nearby but not extremely close,
  // the shadow slowly moves toward the student and grows.
  if (proximity < 0.75) {
    targetMoveX = proximity * 40;
    targetScale = 1 + proximity * 0.3;
  }

  // HUG STATE
  // When the cursor is very close,
  // the protector fully centers and encloses the student.
  else {
    targetMoveX = 0;
    targetScale = 1.45;
  }

  // Easing value.
  // Lower = slower, heavier movement.
  // This prevents snapping and creates emotional weight.
  const ease = 0.08;

  // Smoothly move current values toward the target values
  currentMoveX += (targetMoveX - currentMoveX) * ease;
  currentScale += (targetScale - currentScale) * ease;

  // Apply movement and size to the shadow.
  // Shadow moves relative to its wrapper,
  // so it feels like it is approaching, not teleporting.
  shadow.style.transform =
    `translate(${currentMoveX}px, 0px) scale(${currentScale})`;

  // As the protector gets closer,
  // the student becomes less visible.
  student.style.opacity = 1 - proximity * 0.5;

  // The environment darkens as proximity increases,
  // reinforcing containment and pressure.
  scene.style.filter =
    `brightness(${1 - proximity * 0.35})`;
});

// When the cursor leaves the scene entirely,
// interaction ends and the system returns to idle.
scene.addEventListener("mouseleave", () => {

  // Resume gentle floating for both figures
  studentWrap.classList.add("idle");
  shadowWrap.classList.add("idle");

  // Restore clarity and openness
  student.style.opacity = "1";
  scene.style.filter = "brightness(1)";
});
