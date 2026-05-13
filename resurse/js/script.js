console.log("Script ruleaza");
document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.getElementById('hamburger');
  const checkbox = document.getElementById('ch-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    checkbox.checked = !checkbox.checked;
  });

  const themeSwitch = document.getElementById('theme-switch');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(isDark) {
    document.documentElement.setAttribute(
      "data-bs-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeIcon) {
      themeIcon.className = isDark
        ? "fa-solid fa-moon"
        : "fa-solid fa-sun";
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  const isDark = savedTheme === "dark";

  applyTheme(isDark);

  if (themeSwitch) {
    themeSwitch.checked = isDark;

    themeSwitch.addEventListener('change', () => {
      console.log("CLICK pe switch");
      applyTheme(themeSwitch.checked);
    });
  }

  // GALERIE DIN EJS (cerință)

  const imaginiDinamice = document.querySelectorAll(".galerie-dinamica .slide img");
  animareGalerie(imaginiDinamice);

  // GALERIE DIN FETCH (fragment)



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

