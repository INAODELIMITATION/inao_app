
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

const stylesStroke = {
    red: styleColorStroke('red'),
    green: styleColorStroke('green'),
    blue: styleColorStroke('blue'),
    yellow: styleColorStroke('yellow'),
    fuchsia: styleColorStroke('fuchsia'),
    orange: styleColorStroke('orange'),
    kelly: styleColorStroke('#4CBB17'),
};

function styleColorFill(code) {
    return [new ol.style.Style({
        fill: new ol.style.Fill({
            color: code
        })
    })];
}
const stylesFill = {
    red: styleColorFill('rgba(255,0,0,0.4)'),
    green: styleColorFill('rgba(0,128,0,0.4)'),
    blue: styleColorFill('rgba(0,0,255,0.4)'),
    yellow: styleColorFill('rgba(255,255,0,0.4)'),
    fuchsia: styleColorFill('rgba(255,0,255,0.4)'),
    orange: styleColorFill('rgba(255,165,0,0.4)'),
    kelly: styleColorFill('rgb(76,187,23,0.4)'),
};

const colortab = ['red', 'green', 'blue', 'yellow', 'fuchsia', 'orange'];

function random_color(format) {
    var rint = Math.floor(0x100000000 * Math.random());
    switch (format) {
        case 'hex':
            return '#' + ('00000' + rint.toString(16)).slice(-6).toUpperCase();
        case 'hexa':
            return '#' + ('0000000' + rint.toString(16)).slice(-8).toUpperCase();
        case 'rgb':
            return 'rgb(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ')';
        case 'rgba':
            return 'rgba(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ',' + (rint >> 24 & 255) / 255 + ')';
        default:
            return rint;
    }
}

function RandomcolorHexRgba(){
    let rint = Math.floor(0x100000000 * Math.random());
    return {
        rgba:'rgba(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ',' + 0.6+ ')',
        hex: '#' + ('00000' + rint.toString(16)).slice(-6).toUpperCase(),
        hex1: rgbToHex((rint & 255),(rint >> 8 & 255),(rint >> 16 & 255)).toUpperCase(),
    };
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

