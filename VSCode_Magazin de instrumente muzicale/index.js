const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

// app.get("/resurse/css/general.css", function(req, res){
//     res.sendFile(path.join(__dirname, "resurse/css/general.css"));
// });

app.use("/resurse", express.static(path.join(__dirname, "resurse")));  //pt orice fisier din folderul resurse, se va cauta in folderul resurse din proiect si il face el send file

app.get("/", function(req, res){
    res.render("pagini/index");
});


app.get("/cale", function(req, res){
    console.log("Salut, ai\najuns pe <b style='color: red;'>calea /cale</b>");
    res.send("Salut, ai\najuns pe <b style='color: red;'>calea /cale</b>");
});



app.get("/cale2", function(req, res){
    res.write("ceva\n");
    res.write("altceva");
    res.end();
});

app.listen(8080);
console.log("Serverul a pornit!");