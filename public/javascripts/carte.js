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
    setIgnLayer("CADASTRALPARCELS.PARCELS");
    setIgnLayer("ADMINEXPRESS_COG_CARTO_2017");

    // setIgnLayer("CADASTRALPARCELS.PARCELS.L93");
    //crinaoHover(map);
   
  
    LoadLayers();
    map.getView().fit(extent, map.getSize());
    // var popup = new ol.Overlay({
    //     element: document.getElementById('popup')
    //   });
    //   map.addOverlay(popup);
    //   popup.setPosition( [690294.769471, 6206792.476654]);
}


/**
 * en cas d'echec du chargement 
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
    serverUrl : "/javascripts/autoconf/local.json", //local
    //serverUrl: "/GPautoconf/autoconf.json", //server
    callbackSuffix : "",
    //apiKey: keylocal,
    onSuccess: initialisation,
    onFailure: fail,
});


