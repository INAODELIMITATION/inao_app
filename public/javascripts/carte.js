


/**
 * Fonction d'initialisation de notre carte lors du lancement de l'application
 */
function initialisation() {
    setIgnLayer("CADASTRALPARCELS.PARCELS");
    setIgnLayer("ADMINEXPRESS_COG_CARTO_2017");

    // setIgnLayer("CADASTRALPARCELS.PARCELS.L93");
   
   
  
    LoadLayers();
    map.getView().fit(extent, map.getSize());
    
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
    onSuccess: initialisation,
    onFailure: fail,
});


