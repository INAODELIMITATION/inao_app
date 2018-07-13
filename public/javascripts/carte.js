var extent = [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772];
var projection = new ol.proj.Projection({
    code: 'EPSG:2154',
    extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
    units: 'm',
    axisOrientation: 'neu'
}); // definition du EPSG 2154

ol.proj.addProjection(projection); //inclusion du EPSG dans openlayer
var proj2154 = ol.proj.get('EPSG:2154'); //recupération de la projection
proj2154.setExtent(extent);
var projectionExtent = proj2154.getExtent(); //recupération de l'étendu de la projection 
var variable = 21;
var resolutions = new Array(variable);
var matrixIds = new Array(variable);
var maxResolution = ol.extent.getWidth(projectionExtent) / 256; //recupérationd des résolutions
for (var i = 0; i < variable; ++i) {
    matrixIds[i] = 'EPSG:2154:' + i;
    resolutions[i] = (maxResolution) / Math.pow(2, i);
    //alert(resolutions[i]);

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

//setup source couche aire_parcellaire
var sourceL = new ol.source.VectorTile({
    tilePixelRatio: 1,
    format: new ol.format.MVT(),
    tileGrid: ol.tilegrid.createXYZ({
        extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
        resolutions: resolutions,
        origin: ol.extent.getTopLeft(projectionExtent),

    }),
    url: 'http://127.0.0.1:8080/geoserver/gwc/service/tms/1.0.0/test:aire_p@EPSG:2154@pbf/{z}/{x}/{-y}.pbf',
    crossOrigin: 'anonymous',
});


var map = new ol.Map({
    target: 'map',
    renderer: 'canvas' //canvas,WebGL,DOM
});
var layerMVT = new ol.layer.VectorTile({
    style: InitStyle,
    opacity: 0.8,
    source: sourceL,
});
var features = [];
/**
 * fonction exécutant la carte de base
 */
function InitStyle(feature,resolution) {
    //console.log(feature);
    features.push(feature);
    switch (feature.get("crinao")) {
        case "Provence Corse": { return styles.yellow; break; }
        case "Bourgogne, Beaujolais, Savoie, Jura": { return styles.red; break; }
        case "Val de Loire": { return styles.green; break; }
        case "Sud-Ouest": { return styles.bluebreak; }
        case "Languedoc-Roussillon": { return styles.aqua; break; }
        case "Alsace et Est": { return styles.fuchsia; break; }
        case "Vallée du Rhône": { return styles.navy; break; }
        case "Aquitaine": { return styles.olive; break }
        default: { return 'polygon'; break; }
    }
}
function crinaoHover(map) {
    var info = document.createElement('div');
    var overlay = new ol.Overlay({ element: info });
    map.addOverlay(overlay);
    map.on('pointermove', (e) => {
        var crin = map.forEachFeatureAtPixel(e.pixel, function (feature) {
            return feature.get('crinao');
        });
        info.style.display = crin ? '' : 'none';
        info.innerHTML = crin;
        overlay.setPosition(e.coordinate);
    });
}
function initialisation() {
    var coucheIGN = new ol.layer.Tile({ //setup coucheIGN
        source: new ol.source.GeoportalWMTS({
            projection: proj2154,
            layer: "CADASTRALPARCELS.PARCELS",
            style: "normal",
        }),
        opacity: 0.8
    });
    map.addLayer(coucheIGN);
    map.addLayer(layerMVT); //ajout de la couche à la carte
    map.setView(new ol.View({ //center: [320729.77, 5305952.76], //coordonnées en 3857   //projection: "EPSG:3857",
        projection: proj2154,
        center: [690294.769471, 6206792.476654], //coord en 2154
        zoom: 3
    }));
    crinaoHover(map);
}

Gp.Services.getConfig({
    apiKey: "1g3c8evz5w5tcus9a7oawl77",
    onSuccess: initialisation
});


