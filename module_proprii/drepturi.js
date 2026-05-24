
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara

 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    adaugareProduse: Symbol("adaugareProduse"),
    modificareProduse: Symbol("modificareProduse"),
    stergereProduse: Symbol("stergereProduse"),
    cumparareProduse: Symbol("cumparareProduse"),
    vizualizareGrafice: Symbol("vizualizareGrafice")
};

module.exports = Drepturi;