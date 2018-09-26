/**
 * @author GUIALA JEAN ROGER
 * @module Initializer
 */

/**
 * chargement des variables générale et des fonctions qui vont etre utilisé par d'autres pages JS
 */

var extent = [-378305.8099675195, 6008151.219241469, 1320649.5712336518, 7235612.7247730335];
var projection = new ol.proj.Projection({
    code: 'EPSG:2154',
    extent: extent,
    units: 'm',
    axisOrientation: 'neu'
}); // definition du EPSG 2154
var zoom = 2.2;
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
//setup source couche qui va etre utilisé pour toute les aire parcellaires
var sourceL = new ol.source.VectorTile({
    tilePixelRatio: 1,
    format: new ol.format.MVT(),
    tileGrid: ol.tilegrid.createXYZ({
        extent: extent, 
        resolutions: resolutions,
        origin: ol.extent.getTopLeft(projectionExtent),

    }),
  
    url: 'http://geoserver.sig-inao.fr/geoserver/gwc/service/tms/1.0.0/inao:aire_parcellaire@EPSG:2154@pbf/{z}/{x}/{-y}.pbf',
    crossOrigin: 'anonymous',
});
var view = new ol.View({ 
    projection: "EPSG:2154",
    center: [489353.59, 6587552.20], //coord en 2154
    //minZoom:1.5,
    //maxZoom: 14,
    //zoom: zoom
});
/**
 * Déclaration de la carte ici, ol::Map
 */
var map = new ol.Map({  
    target: 'map',
    renderer: 'canvas', //canvas,WebGL,DOM
    view:view
});

