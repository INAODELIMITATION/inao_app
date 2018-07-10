function filters(data){
    for(let i=0; i<data.length; i++){
       if(feature.get(data[i].type)== data[i].valeur){
           return styles.green;
       }
       else{
           return new ol.style.Style({});
       }
    }
}





/**
 * fonction permettant de créer un style
 * @param {string} couleur la couleur des traits
 * @param {string} code le code en rgba du remplissage 
 */
function styleColor(couleur, code) {
    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: couleur,
            width: 2
        }),
        fill: new ol.style.Fill({
            color: code
        })
    })];
}

// différentes couleur dans un objet 
var styles = {
    yellow: styleColor('yellow', 'rgba(255,255,0,0.6)'),
    red: styleColor('red', 'rgba(255,0,0,0.6)'),
    green: styleColor('green', 'rgba(0,128,0,0.6)'),
    blue: styleColor('blue', 'rgba(0,0,255,0.6)'),
    aqua: styleColor('aqua', 'rgba(0,255,255,0.6)'),
    fuchsia: styleColor('fuchsia', 'rgba(255,0,255,0.6)'),
    navy: styleColor('navy', 'rgba(0,0,128,0.6)'),
    olive: styleColor('olive', 'rgba(128,128,0,0.6)')
};