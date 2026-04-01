document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const checkbox = document.getElementById('ch-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    checkbox.checked = !checkbox.checked;
  });
});