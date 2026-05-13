window.addEventListener("DOMContentLoaded", function () {

    const switchTema = document.getElementById("theme-switch");
    const selectTema = document.getElementById("theme-select");

    let dark = localStorage.getItem("dark") === "true";
    let tema = localStorage.getItem("tema") || "default";

    // aplicare initială
    if (dark) {
        document.body.classList.add("dark");
        switchTema.checked = true;
    }

    if (tema !== "default") {
        document.body.classList.add(tema);
    }

    selectTema.value = tema;

    // 🔥 SWITCH DARK/LIGHT
    switchTema.addEventListener("change", function () {

        if (this.checked) {
            document.body.classList.add("dark");
            localStorage.setItem("dark", "true");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("dark", "false");
        }
    });

    // 🎨 SELECT TEME
    selectTema.addEventListener("change", function () {

        // scoatem doar temele de culoare (NU dark)
        document.body.classList.remove("blue", "green", "christmas");

        if (this.value !== "default") {
            document.body.classList.add(this.value);
        }

        localStorage.setItem("tema", this.value);
    });

});