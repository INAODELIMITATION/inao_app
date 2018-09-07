
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
            width: 3
        }),
       
    })];
}

const stylesStroke = {
    red: styleColorStroke('red'),
    green:styleColorStroke('green'),
    blue:styleColorStroke('blue'),
    yellow: styleColorStroke('yellow'),
    fuchsia:styleColorStroke('fuchsia'),
    orange:styleColorStroke('orange'),
    kelly: styleColorStroke('#4CBB17'),
};

function styleColorFill(code){
    return [new ol.style.Style({
        fill: new ol.style.Fill({
            color: code
        })
    })];
}
const stylesFill = {
    red:    styleColorFill('rgba(255,0,0,0.4)'),
    green:  styleColorFill('rgba(0,128,0,0.4)'),
    blue:   styleColorFill('rgba(0,0,255,0.4)'),
    yellow: styleColorFill('rgba(255,255,0,0.4)'),
    fuchsia:styleColorFill('rgba(255,0,255,0.4)'),
    orange: styleColorFill('rgba(255,165,0,0.4)'),  
    kelly:  styleColorFill('rgb(76,187,23,0.4)'),
};

const colortab = ['red','green','blue','yellow','fuchsia','orange'];