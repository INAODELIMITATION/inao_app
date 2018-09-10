
/**
 * fonction permettant de créer un style
 * @param {string} couleur la couleur des traits
 * @param {string} code le code en rgba du remplissage 
 */
function styleColor(couleur, code) {
    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: couleur,
            width: 1
        }),
        fill: new ol.style.Fill({
            color: code
        })
    })];
}


/**
 * Création de style sans remplissage
 * @param {String} couleur 
 */
function styleColorStroke(couleur) {
    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: couleur,
            width: 4
        }),

    })];
}


function styleColorFill(code) {
    return [new ol.style.Style({
        fill: new ol.style.Fill({
            color: code
        })
    })];
}





function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



function RandomcolorHexRgba(){
    let rint = Math.floor(0x100000000 * Math.random());
    return {
        rgba:'rgba(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ',' + 0.6+ ')',
        hex: '#' + ('00000' + rint.toString(16)).slice(-6).toUpperCase(),
        hex1: rgbToHex((rint & 255),(rint >> 8 & 255),(rint >> 16 & 255)).toUpperCase(),
    };
}
