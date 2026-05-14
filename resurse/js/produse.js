
window.onload = function () {

  const inpPretMin = document.getElementById("inp-pret-min");
  const inpPretMax = document.getElementById("inp-pret-max");
  const valPretMin = document.getElementById("val-pret-min");
  const valPretMax = document.getElementById("val-pret-max");
  //Bonus 3
  let mesaj = document.createElement("p");
  mesaj.id = "mesaj-niciun-produs";
  mesaj.style.color = "red";
  mesaj.style.fontWeight = "bold";
  mesaj.style.display = "none";

  document.getElementById("produse").appendChild(mesaj);

  let produse = Array.from(document.getElementsByClassName("produs"));

  //Bonus 15 numa produse
  let afisNr = document.getElementById("nr-produse");

//Bonus 14 - ieftin
let minPeCategorie = {};

for (let prod of produse) {
  let tip = prod.querySelector(".val-tip").innerText.trim();
  let pret = parseFloat(prod.querySelector(".val-pret").innerText);

  if (!minPeCategorie[tip] || pret < minPeCategorie[tip].pret) {
    minPeCategorie[tip] = {
      produs: prod,
      pret: pret
    };
  }
}
for (let tip in minPeCategorie) {
  let produsMinim = minPeCategorie[tip].produs;

  let badge = produsMinim.querySelector(".badge-ieftin");
  badge.style.display = "block";
}

  inpPretMin.oninput = function () {
    valPretMin.innerHTML = `(${this.value})`;
  };
  inpPretMax.oninput = function () {
    valPretMax.innerHTML = `(${this.value})`;
  };
  function invalid(t) {
    return /[0-9]/.test(t);
  }

  document.getElementById("filtrare").onclick = function () {
    let nrproduse=0;
    let nrAfisate = 0;
    let inpNumeField = document.getElementById("inp-nume");

    if (/[0-9]/.test(inpNumeField.value)) {
      inpNumeField.classList.add("is-invalid");
      return;
    } else {
      inpNumeField.classList.remove("is-invalid");
    }
    let inpMaterialField = document.getElementById("inp-material");

    if (/[0-9]/.test(inpMaterialField.value)) {
      inpMaterialField.classList.add("is-invalid");
      return;
    } else {
      inpMaterialField.classList.remove("is-invalid");
    }

    let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()
      .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i").replace(/ș/g, "s").replace(/ț/g, "t");
    let pretMin = parseFloat(inpPretMin.value);
    let pretMax = parseFloat(inpPretMax.value);
    let inpCategorie = document.getElementById("inp-categorie").value;
    let descrMinLen = parseInt(document.getElementById("inp-len-min").value) || 0;
    let descrMaxLen = parseInt(document.getElementById("inp-len-max").value) || 1000000;
    let textarea = document.getElementById("inp-descriere");
    let textDescr = textarea.value.trim().toLowerCase();
    let doarElectric = document.getElementById("inp-electric").checked;
    let material = document.getElementById("inp-material").value;


    let radioTipuri = document.getElementsByName("gr_rad");
    let tipSelectat = "toate";
    for (let rad of radioTipuri) {
      if (rad.checked) {
        tipSelectat = rad.value
      .trim()
      .toLowerCase()
      .replace(/ă/g, "a")
      .replace(/â/g, "a")
      .replace(/î/g, "i")
      .replace(/ș/g, "s")
      .replace(/ț/g, "t");
        break;
      }
    }

    let selectMateriale = Array.from(document.getElementById("inp-materiale").selectedOptions)
      .map(opt => opt.value.toLowerCase());

    let regexNume = null;
    if (inpNume.includes("*")) {
      let pattern = "^" + inpNume.replace(/\*/g, ".*") + "$";
      regexNume = new RegExp(pattern, "i");
    }

    let produse = document.getElementsByClassName("produs");

    for (let prod of produse) {
      prod.style.display = "none";

      
      let materialeProdus = prod.querySelector(".val-materiale").innerHTML.trim().toLowerCase();

      let condMaterialeMultiple = true;
      if (selectMateriale.length > 0) {
        condMaterialeMultiple = selectMateriale.every(m => materialeProdus.includes(m));
      }

      let materiale = prod.querySelector(".val-materiale").innerHTML.trim().toLowerCase();
      //Bonus 7
      let nume = prod.querySelector(".val-nume").innerHTML.trim().toLowerCase().
        replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i").replace(/ș/g, "s").replace(/ț/g, "t");

      let pret = parseFloat(prod.querySelector(".val-pret").innerHTML);
      let catProdus = prod.querySelector(".val-categorie").innerHTML.trim().toLowerCase();
      let isElectric = prod.querySelector(".val-electric").innerHTML.trim().toLowerCase() == "true";

      let tip = prod.querySelector(".val-tip").innerText
        .trim()
        .toLowerCase()
        .replace(/ă/g, "a")
        .replace(/â/g, "a")
        .replace(/î/g, "i")
        .replace(/ș/g, "s")
        .replace(/ț/g, "t");
      let descriereStr = prod.querySelector(".val-descriere").innerHTML.trim();
      let descriere = descriereStr.toLowerCase();

      let condNume = false;
      if (inpNume === "") condNume = true;
      else if (regexNume) condNume = regexNume.test(nume);
      else condNume = nume.includes(inpNume);

      let condPret = (pret >= pretMin && pret <= pretMax);

      let condCat = (inpCategorie === "toate" || catProdus === inpCategorie);

      let condMaterial = (material == null || material.length == 0 || materiale.includes(material));

      let condTip = (tipSelectat === "toate" || tip === tipSelectat);

      let condLen = (descriereStr.length >= descrMinLen && descriereStr.length <= descrMaxLen);

      let condTextDescr = (textDescr === "" || descriere.includes(textDescr));
      if (!condTextDescr) {
        textarea.classList.add("is-invalid");
      } else {
        textarea.classList.remove("is-invalid");
      }

      let condElec = !doarElectric || (doarElectric && isElectric);

      if (condNume && condPret && condTip && condLen && condTextDescr && condElec &&
        condMaterial && condCat && condMaterialeMultiple) {
        prod.style.display = "block";
        nrAfisate++;
        nrproduse++
      }
    }
    afisNr.innerText = `Număr produse afișate: ${nrAfisate}`;
    //Bonus 3
    if (nrAfisate === 0) {
      mesaj.innerText = "Nu există produse conform filtrării curente";
      mesaj.style.display = "block";
    } else {
      mesaj.style.display = "none";
    }
  };
  //Bonus 8
  function getVal(prod, key) {
    if (key === "nume")
      return prod.querySelector(".val-nume").innerText.toLowerCase();
    if (key === "pret")
      return parseFloat(prod.querySelector(".val-pret").innerText);
    if (key === "categorie")
      return prod.querySelector(".val-categorie").innerText.toLowerCase();
    return "";
  }

  document.getElementById("sortare-avansata").onclick = function () {
    let key1 = document.getElementById("sort-key-1").value;
    let dir1 = parseInt(document.getElementById("sort-dir-1").value);

    let key2 = document.getElementById("sort-key-2").value;
    let dir2 = parseInt(document.getElementById("sort-dir-2").value);

    let produse = Array.from(document.getElementsByClassName("produs"));

    produse.sort((a, b) => {
      let a1 = getVal(a, key1);
      let b1 = getVal(b, key1);
      if (a1 > b1) return dir1;
      if (a1 < b1) return -dir1;

      let a2 = getVal(a, key2);
      let b2 = getVal(b, key2);
      if (a2 > b2) return dir2;
      if (a2 < b2) return -dir2;

      return 0;
    });

    let container = document.querySelector(".grid-produse");
    for (let p of produse) {
      container.appendChild(p);
    }
  };

  document.getElementById("resetare").onclick = function () {

    if (!confirm("Sigur vrei să resetezi filtrele?")) {
      return;
    }

    document.getElementById("inp-nume").value = "";
    document.getElementById("inp-categorie").value = "toate";

    document.querySelector('input[name="gr_rad"][value="toate"]').checked = true;

    document.getElementById("inp-material").value = "";
    document.getElementById("inp-descriere").value = "";
    document.getElementById("inp-electric").checked = false;
    document.getElementById("inp-materiale").selectedIndex = -1;

    document.getElementById("val-pret-min").innerHTML = "(0)";
    document.getElementById("inp-pret-min").value = "0";

    document.getElementById("val-pret-max").innerHTML = "(50000)";
    document.getElementById("inp-pret-max").value = "50000";


    let produse = document.getElementsByClassName("produs");
    let container = document.querySelector(".grid-produse");

    for (let prod of produse) {
      prod.style.display = "block";
    }

    let arr = Array.from(produse);

    arr.sort((a, b) => {
      return a.dataset.initialIndex - b.dataset.initialIndex;
    });

    arr.forEach(p => container.appendChild(p));
  };

  function sorteaza(semn) {

    let produse = document.getElementsByClassName("produs");
    let vProduse = Array.from(produse);

    vProduse.sort((a, b) => {

      let numeA = a.querySelector(".val-nume").innerText.trim().toLowerCase();
      let numeB = b.querySelector(".val-nume").innerText.trim().toLowerCase();

      let lenA = a.querySelector(".val-descriere").innerText.trim().length;
      let lenB = b.querySelector(".val-descriere").innerText.trim().length;

      let cmp = numeA.localeCompare(numeB);
      if (cmp !== 0) return semn * cmp;

      return semn * (lenA - lenB);

    });

    let container = document.querySelector(".grid-produse");
    vProduse.forEach(p => container.appendChild(p));
  }

  document.getElementById("sortCrescNume").onclick = function () {
    sorteaza(1);
  };

  document.getElementById("sortDescrescNume").onclick = function () {
    sorteaza(-1);
  };


  document.getElementById("calculeaza-suma").onclick = function () {

    let produse = document.getElementsByClassName("produs");
    let suma = 0;

    for (let prod of produse) {
      if (prod.style.display !== "none") {
        suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
      }
    }

    let div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "20px";
    div.style.background = "white";
    div.style.padding = "10px";
    div.style.border = "1px solid black";
    div.style.fontWeight = "bold";

    div.innerHTML = "Suma prețurilor: " + suma.toFixed(2);

    document.body.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, 2000);
  };
};
