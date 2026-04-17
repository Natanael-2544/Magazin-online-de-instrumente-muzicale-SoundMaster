document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.getElementById('hamburger');
  const checkbox = document.getElementById('ch-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    checkbox.checked = !checkbox.checked;
  });

  // =========================
  // GALERIE DIN EJS (cerință)
  // =========================
  const imaginiDinamice = document.querySelectorAll(".galerie-dinamica .slide img");
  animareGalerie(imaginiDinamice);

  // =========================
  // GALERIE DIN FETCH (fragment)
  // =========================
  fetch("/galerie.fragment.html")
    .then(r => r.text())
    .then(html => {
      const container = document.getElementById("galerie-container");
      if (!container) return;

      container.innerHTML = html;

      const imaginiFragment = container.querySelectorAll(".slide img");
      animareGalerie(imaginiFragment);
    });

  function animareGalerie(imagini) {
    if (!imagini || imagini.length === 0) return;

    let index = 0;
    imagini[0].classList.add("activ");

    setInterval(() => {
      imagini[index].classList.remove("activ");
      index = (index + 1) % imagini.length;
      imagini[index].classList.add("activ");
    }, 2000);
  }

});