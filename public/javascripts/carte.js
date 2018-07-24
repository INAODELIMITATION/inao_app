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
            projection: "IGNF:RGF93G",
            layer: "CADASTRALPARCELS.PARCELS",
            style: "normal",
        }),
        opacity: 0.8
    });
    map.setView(new ol.View({ //center: [320729.77, 5305952.76], //coordonnées en 3857   //projection: "EPSG:3857",
        projection: "EPSG:2154",
        center: [489353.59, 6587552.20], //coord en 2154
        zoom: 2.5
    }));
    crinaoHover(map);
    map.addLayer(coucheIGN);
    $.ajax({
        url: "/session/aireCharge",
        type: 'GET',
        dataType: "json",
        success: function (session) {
            var sess = session.filter;
            if (sess.length > 0) {
                var filtered = removeDuplicates(sess, 'valeur');
                initSession(filtered);

            } else {
                map.addLayer(layerMVT); //ajout de la couche à la carte

                successMessage('Chargement terminé', 'Bienvenue sur la plateforme de visualisation cartographique');
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });

}

function initSession(val) {
    var valeurExtent = [];
    for (var i = 0; i < val.length; i++) {
       let iterator = i;
        try {
            map.addLayer(new ol.layer.VectorTile({
                opacity: 0.8,
                source: sourceL,
                style: (feature => {
                    if (feature.get(val[iterator].type) === val[iterator].valeur) {
                        return styles.red;
                    } else {
                        return new ol.style.Style({});
                    }
                }),
            }));
            successMessage("ajout termnié avec succès", "ajout de la couche " + val[i].valeur);
            valeurExtent.push(val[i].valeur);
        } catch (e) {
            swal({
                title: "ERREUR lors du chargement de la couche : " + val[i].valeur + " " + e,
                text: "Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
                type: "warning",
                showConfirmButton: true,
            });
        }
    }
    
    fitToextent(val[val.length-1].valeur);
}


function fail() {
    swal({
        title: "ERREUR!",
        text: "Service  indisponible!!! Veuillez contacter votre administrateur (BDDC)",
        type: "warning",
        showConfirmButton: false,
    });
}
Gp.Services.getConfig({
    apiKey: "1g3c8evz5w5tcus9a7oawl77",
    onSuccess: initialisation,
    onFailure: fail,
});


