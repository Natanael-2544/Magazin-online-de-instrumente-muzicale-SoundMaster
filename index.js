const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const sharp = require("sharp");

const ejs = require('ejs');
const pg = require("pg");

//etapa 6
client = new pg.Client({
    database: "cti_2026",
    user: "natanael",
    password: "natanael",
    host: "localhost",
    port: 5432
})

client.connect()


app = express();
app.set("view engine", "ejs")

//a) pregatire
obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

let vect_folder = ["temp", "logs", "backup", "fisiere_uploadate"];
for (let folder of vect_folder) {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder, { recursive: true });
    }
}

app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/dist", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));


app.get(["/", "/index", "/home"], function (req, res) {
    let oraCurenta = new Date().getHours();

    let imaginiFiltrate = obGlobal.obImagini.imagini.filter((img, index) => {
        if (!img.intervale_ore) return true;
        return img.intervale_ore.some(interval => {
            return oraCurenta >= interval[0] && oraCurenta <= interval[1];
        });
    });

    let imaginiIndicePar = obGlobal.obImagini.imagini.filter((img, index) => index % 2 === 0);

    let imaginiUnice = [...new Map(imaginiIndicePar.map(img => [img.cale_relativa, img])).values()];

    const puteri = [2, 4, 8, 16];
    let n = puteri[Math.floor(Math.random() * puteri.length)];

    n = Math.min(n, imaginiUnice.length);

    let imaginiFinale = imaginiUnice.slice(0, n);

    const caleSassVars = path.join(obGlobal.folderScss, "_galerie_variabile.scss");
    fs.writeFileSync(caleSassVars, `$nr-imagini: ${n};`);

    compileazaScss("galerie_animata.scss");

    res.render("pagini/index", {
        imagini: imaginiFinale,
        nrImagini: n
    });
});

app.get("/galerie", (req, res) => {
    res.render("pagini/galerie_statica");
});

app.get("/galerie-dinamica", (req, res) => {
    let imaginiDinJSON = obGlobal.obImagini.imagini;
    let imaginiProcesate = imaginiDinJSON.map(img => {
        let numeFis = path.parse(img.cale_relativa).name;

        return {
            ...img,
            fisier: path.join("/", obGlobal.obImagini.cale_galerie, img.cale_relativa).replace(/\\/g, "/")
        };
    });

    res.render("pagini/galerie_dinamica", {
        imagini: imaginiProcesate
    });
});


//Etapa 6
app.get("/produse", function (req, res) {

    client.query(
        "SELECT unnest(enum_range(NULL::categ_instrument)) AS tipuri",
        function (err, rezEnum) {
            let tip = req.query.tip;
            let query = "SELECT * FROM instrumente";
            let params = [];

            if (tip && tip !== "toate") {
                query += " WHERE tip_produs = $1";
                params.push(tip);
            }

            client.query(query, params, function (err, rez) {
                if (err) {
                    console.log(err);
                    afisareEroare(res, 2);
                    return;
                }

                res.render("pagini/produse", {
                    produse: rez.rows,
                    optiuni: rezEnum.rows.map(o => o.tipuri)
                });
            });
        }
    );

});


app.get("/produs/:id", function (req, res) {

    client.query(`select * from instrumente where id=${req.params.id}`, function (err, rez) {
        if (err) {
            console.log("Eroare", err)
            afisareEroare(res, 2)
        }
        else {
            if (rez.rowCount == 0) {
                afisareEroare(res, 404, "Produs inexistent")
            }
            else {
                res.render("pagini/produs", {
                    prod: rez.rows[0]
                })

            }

        }
    })

})


app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/ico/favicon.ico"))
});

app.get("/cale", function (req, res) {
    console.log("Salut, ai\najuns pe <b style='color: red;'>calea /cale</b>");
    res.send("Salut, ai\najuns pe <b style='color: red;'>calea /cale</b>");
});

app.get("/cale2", function (req, res) {
    res.write("ceva\n");
    res.write("altceva");
    res.end();
});

app.get("/*pagina", function (req, res) {
    console.log("Cale pagina", req.url);

    let pagina = req.url.substring(1);
    if (pagina == "")
        pagina = "index";

    if (req.url.startsWith("/resurse") && path.extname(req.url) == "") {
        afisareEroare(res, 403);
        return;
    }
    if (path.extname(req.url) == ".ejs") {
        afisareEroare(res, 400);
        return;
    }

    res.render("pagini/" + pagina, function (eroare, rezultatRandare) {
        if (eroare) {
            if (eroare.message && eroare.message.startsWith("Failed to lookup view")) {
                afisareEroare(res, 404);
            }
            else {
                afisareEroare(res, 500); //eroare server
            }
            return;
        }
        res.send(rezultatRandare);
    });
});

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    let erori = obGlobal.obErori = JSON.parse(continut)
    let err_default = erori.eroare_default
    err_default.imagine = path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori) {
        eroare.imagine = path.join(erori.cale_baza, eroare.imagine)
    }
}
initErori()

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find((elem) => elem.identificator == identificator);
    let errDefault = obGlobal.obErori.eroare_default
    if (identificator)
        res.status(identificator);
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text
    });
}


//Bonus
function valideazaEroriJSON() {
    const caleFisier = path.join(__dirname, "resurse/json/erori.json");
    //a)
    if (!fs.existsSync(caleFisier)) {
        console.error("EROARE: Fișierul erori.json lipsește!");
        process.exit(1);
    }
    let continut, ob;
    try {
        continut = fs.readFileSync(caleFisier, "utf-8");
        ob = JSON.parse(continut);
    } catch (err) {
        console.error("EROARE: Fișierul nu poate fi citit sau JSON-ul este invalid:", err.message);
        process.exit(1);
    }

    //b)
    const propsObligatorii = ["info_erori", "cale_baza", "eroare_default"];
    for (let prop of propsObligatorii) {
        if (ob[prop] === undefined) {
            console.error(`EROARE: lipsește proprietatea obligatorie '${prop}'`);
            process.exit(1);
        }
    }

    // c)
    const def = ob.eroare_default;
    for (let prop of ["titlu", "text", "imagine"]) {
        if (def[prop] === undefined) {
            console.error(`EROARE: eroare_default nu are '${prop}'`);
            process.exit(1);
        }
    }

    // d)
    const folderBaza = path.join(__dirname, ob.cale_baza);
    if (!fs.existsSync(folderBaza)) {
        console.error("EROARE: folderul din cale_baza nu există:", folderBaza);
        process.exit(1);
    }

    //e)
    const fisiereDinFolder = new Set(fs.readdirSync(folderBaza));
    for (let eroare of ob.info_erori) {
        const img = path.basename(eroare.imagine);
        if (!fisiereDinFolder.has(img)) {
            console.error(`EROARE: imagine lipsă pentru eroarea ${eroare.identificator}: ${eroare.imagine}`);
            process.exit(1);
        }
    }

    //g)
    const map = {};
    for (let eroare of ob.info_erori) {
        if (!map[eroare.identificator]) {
            map[eroare.identificator] = [];
        }
        map[eroare.identificator].push(eroare);
    }
    for (let id in map) {
        if (map[id].length > 1) {
            console.error(`EROARE: identificator duplicat -> ${id}`);

            for (let e of map[id]) {
                console.error({
                    titlu: e.titlu,
                    text: e.text,
                    imagine: e.imagine,
                    status: e.status
                });
            }
            process.exit(1);
        }
    }

    //f)
    const obiecte = continut.match(/\{[\s\S]*?\}/g);
    if (obiecte) {
        for (let obj of obiecte) {
            const props = obj.match(/"([^"]+)"\s*:/g);
            if (!props) continue;
            const seen = new Set();
            for (let p of props) {
                const prop = p.replace(/["\s:]/g, "");

                if (seen.has(prop)) {
                    console.error("EROARE: proprietate duplicată în același obiect:", prop);
                    console.error("Obiect problematic:\n", obj);
                    process.exit(1);
                }
                seen.add(prop);
            }
        }
    }
    console.log("erori.json valid");
    return ob;
}

app.get("/eroare", function (req, res) {
    afisareEroare(res, 404, "Eroare 404");
});


//Etapa 5
function compileazaScss(caleScss, caleCss) {
    //b)
    if (!caleCss) {
        let numeFis = path.basename(caleScss, path.extname(caleScss));
        caleCss = numeFis + ".css";
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);

    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);
    //c)
    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true });
    }
    //Bonus 3
    let numeFisCss = path.basename(caleCss);

    if (fs.existsSync(caleCss)) {
        try {
            let nume = path.parse(numeFisCss).name;
            let extensie = path.parse(numeFisCss).ext;
            let timestamp = Date.now();

            let numeBackup = `${nume}_${timestamp}${extensie}`;

            fs.copyFileSync(
                caleCss,
                path.join(caleBackup, numeBackup)
            );
        } catch (err) {
            console.error("Eroare la backup CSS:", err.message);
        }
    }
    //b)
    let rez = sass.compile(caleScss, { sourceMap: true });
    fs.writeFileSync(caleCss, rez.css);
}

function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;
    let caleGalerie = obGlobal.obImagini.cale_galerie;

    let caleAbs = path.join(__dirname, caleGalerie);

    let caleAbsMediu = path.join(caleAbs, "mediu");
    let caleAbsMic = path.join(caleAbs, "mic");

    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    for (let imag of vImagini) {

        let numeFis = path.parse(imag.cale_relativa).name;

        let caleFisAbs = path.join(caleAbs, imag.cale_relativa);

        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        let caleFisMicAbs = path.join(caleAbsMic, numeFis + ".webp");

        if (!fs.existsSync(caleFisMediuAbs)) {
            sharp(caleFisAbs)
                .resize(300)
                .toFile(caleFisMediuAbs);
        }

        if (!fs.existsSync(caleFisMicAbs)) {
            sharp(caleFisAbs)
                .resize(150)
                .toFile(caleFisMicAbs);
        }

        imag.fisier_mediu = path.join("/", caleGalerie, "mediu", numeFis + ".webp").replace(/\\/g, "/");
        imag.fisier_mic = path.join("/", caleGalerie, "mic", numeFis + ".webp").replace(/\\/g, "/");
        imag.fisier = path.join("/", caleGalerie, imag.cale_relativa).replace(/\\/g, "/");
    }
}
initImagini();

function verificaGalerie(dataGalerie) {
    // 1
    if (!fs.existsSync(dataGalerie.cale_galerie)) {
        console.error(
            `Eroare: Folderul specificat în 'cale_galerie' (${dataGalerie.cale_galerie}) nu există în sistemul de fișiere.`
        );
        return false;
    }

    // 2
    let imaginiLipsa = [];
    for (let img of dataGalerie.imagini) {
        let caleImg = path.join(dataGalerie.cale_galerie, img.cale_relativa);

        if (!fs.existsSync(caleImg)) {
            imaginiLipsa.push(img.cale_relativa);
        }
    }
    if (imaginiLipsa.length > 0) {
        console.error(
            `Eroare: Următoarele fișiere imagine specificate în JSON NU există în sistemul de fișiere:\n- ${imaginiLipsa.join("\n- ")}`
        );
        return false;
    }
    return true;
}
verificaGalerie(obGlobal.obImagini);

//d)
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss" && !numeFis.startsWith("_")) {
        compileazaScss(numeFis);
    }
}
//e)
fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    if (numeFis && !numeFis.startsWith("_") && (eveniment == "change" || eveniment == "rename")) {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
})



app.listen(8080);
console.log("Serverul a pornit!");
