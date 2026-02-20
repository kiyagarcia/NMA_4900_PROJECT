const scene = document.getElementById("scene");
const student = document.getElementById("student");
const shadow = document.getElementById("shadow");

scene.addEventListener("mousemove", (e) => {
  const studentRect = student.getBoundingClientRect();

  const studentX = studentRect.left + studentRect.width / 2;
  const studentY = studentRect.top + studentRect.height / 2;

  const dx = e.clientX - studentX;
  const dy = e.clientY - studentY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // Clamp distance range
  const maxDistance = 400;
  const normalized = Math.min(distance / maxDistance, 1);

  // Shadow gets closer as distance decreases
  const offset = -60 + (1 - normalized) * 40;

  shadow.style.transform = `translate(${offset}%, -50%)`;

  // Student fades slightly when shadow is close
  student.style.opacity = 0.6 + normalized * 0.4;
});
