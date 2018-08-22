var keylocal ="1g3c8evz5w5tcus9a7oawl77"; //local
var keyServer ="67wjh2d43oo2ibtn0dqsjel0"; //server
var keycadastre ="aontlb42mham5v1jtqyo8ncg";


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
  //setIgnLayer("CADASTRALPARCELS.PARCELS",0.5);
   setIgnLayer("ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO.L93",0.5);
  
    crinaoHover(map);
   
    //setIgnLayer("CADASTRALPARCELS.PARCELS");
    LoadLayers();
    map.getView().fit(extent, map.getSize());
   
}


/**
 * en cas d'echec de chargement 
 */
function fail() {
    swal({
        title: "ERREUR!",
        text: "Service  indisponible!!! Veuillez contacter votre administrateur (BDDC)",
        type: "warning",
        showConfirmButton: false,
    });
}

Gp.Services.getConfig({
    apiKey: keyServer,
    onSuccess: initialisation,
    onFailure: fail,
});


