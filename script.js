const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");

scene.addEventListener("mousemove", (e) => {
  const rect = student.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance = 400;
  const clamped = Math.min(distance, maxDistance);
  const proximity = 1 - clamped / maxDistance;
  // proximity = 0 far away, 1 very close

  // SHADOW: move closer and grow
  const moveX = proximity * 40;
  const scale = 1 + proximity * 0.3;

  shadow.style.transform = `translate(calc(-50% + ${moveX}px), -50%) scale(${scale})`;

  // STUDENT: fade when shadow is close
  student.style.opacity = 1 - proximity * 0.4;

  // ENVIRONMENT: darken when close
  scene.style.filter = `brightness(${1 - proximity * 0.2})`;
});
