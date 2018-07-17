/**
 * fonction permettant d'afficher le nom du crinao lors du passage sur la carte
 * @param {ol:map} map la carte 
 */
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
/**
 * Fonction d'initialisation de notre carte lors du lancement de l'application
 */
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
    successMessage('Chargement terminé','Bienvenue sur la plateforme de visualisation cartographique');
   
}


function fail(){
    swal({
        title:"ERREUR!",
        text:"Service  indisponible!!! Veuillez contacter votre administrateur (BDDC)",
        type:"warning",
        showConfirmButton:false,
    });
}
Gp.Services.getConfig({
    apiKey: "1g3c8evz5w5tcus9a7oawl77",
    onSuccess: initialisation,
    onFailure:fail,
});


