/**
 *@author Guiala Jean Roger
 *@module Plugin toutes les fonctions d'interaction et de création de vue
 * Fichier contenant les fonctions et les variables de base relatif à la carte, ces fonctions sont appellées et utilisées par d'autres fichier 
 * Javascript
 */




/**
 * En fonction du format, initialise la carte IGN
 * @param {String} name 
 */
function checkformat(name) {
    switch (name) {
        case "CADASTRALPARCELS.PARCELS.L93": { return "image/png"; break; }
        case "CADASTRALPARCELS.PARCELS": { return "image/png"; break; }
        case "ADMINEXPRESS_COG_CARTO_2017": { return "image/png"; break; }
        default: { return "image/jpeg"; break; }
    }
}

/**
 * Fonction qui initialise une couche de l'IGN
 * @param {String} name 
 */
function setIgnLayer(name) {
    format = checkformat(name);
    map.addLayer(
        new ol.layer.Tile({
            name: name,
            source: new ol.source.GeoportalWMTS({
                layer: name,
                olParams: {
                    format: format
                }
            })
        })

    );
}



/**
 * fonction qui retire les doublons dans un tableau d'objet
 */
function removeDuplicates(arr, key) {
    if (!(arr instanceof Array) || key && typeof key !== 'string') {
        return false;
    }
    if (key && typeof key === 'string') {
        return arr.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
        });
    }
}

/**
 * charge les couches en session
 * @param {Array} val tableau de couches en session
 */
function loadLayersess(val) {
    for (var i = 0; i < val.length; i++) {
        layerAdder(val[i]);
    }
    fitToextent(val[val.length - 1].valeur);
}
/**
 * Fonction qui charge la session
 * @param {*} handleData 
 */
function fetchSess(handleData) {
    $.ajax({
        url: "/session/couches/NULL",
        type: 'GET',
        dataType: "json",
        success: data => {
            handleData(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });
}

/**
 * mis à jour de la sesison
 * NE FONCTIONNE PAS ENCORE
 * @param {*} data 
 */
function updateSess(data) {
    $.ajax({
        url: "/session/couches/NULL",
        type: 'POST',
        data: 'session=' + data,
        // dataType:"json",
        success: filter => {
            alert("changement");
            console.log(filter);
        }

    });
}


/**
 * Charge la carte de base et affiche les couches en session si il y en a 
 */
function LoadLayers() {
    fetchSess(data => {
        let sess = data.filter;
        if (sess.length > 0) {
            let filtered = removeDuplicates(sess, 'valeur');
            loadLayersess(filtered);

        } else {
            //map.addLayer(layerMVT); //ajout de la couche à la carte
            map.getView().setZoom(zoom);
            successMessage('Chargement terminé', 'Bienvenue sur la plateforme de visualisation cartographique');
        }

    });
}




/**
 * Fonction qui affiche un message une fois que la carte a chargé pour la premiere fois.
 * @param {libelle} string titre du message
 * @param {valeur} string contenu du message
 */
function successMessage(libelle, valeur) {
    setTimeout(function () {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 2500
        };
        toastr.success(libelle, valeur);
    }, 1300);
}





/**
 * 
 * @param {string} valeur ce qui est recherché, dénomination ou appellation 
 * 
 */
function fitToextent(valeur) {
    $.ajax({
        url: "/extendTest/" + valeur,
        type: 'GET',
        dataType: "json",
        success: function (data) {

            var ex = [data[0].st_xmin, data[0].st_ymin, data[0].st_xmax, data[0].st_ymax];

            map.getView().fit(ex, map.getSize());
        }
    });

}

/**
 * vérifie si on a cliqué ou pas sur la barre de menu
 * @param {number} checker 
 */
function sidebarClicked(checker) {
    if (checker == 0) {
        clickSidebar();
        checker = 1;
    }
}
/**
 * Fonction qui crée une couche sur la carte en fonction du type et de la valeur
 * @param {Objec{type,valeur}} element contient le type et le nom de la couche
 
 * utilise les fonctions:
 * createLayerRow,
 * SucessMessage,
 * fitToextent,
 * clickSidebar
 */
function layerAdder(element) {
    var colors = RandomcolorHexRgba();
    try {
        map.addLayer(new ol.layer.VectorTile({
            opacity: 0.8,
            source: sourceL,
            name: element.valeur, // nom dela couche
            style: (feature => {
                if (feature.get(element.type) === element.valeur) {
                    return styleColorFill(colors.rgba);
                } else {
                    return new ol.style.Style({});
                }
            }),
        }));
        loadLayerEvents(element, colors.hex1);
    } catch (e) {
        swal({
            title: "ERREUR lors du chargement de la couche : " + element.valeur + " " + e,
            text: "Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
            type: "warning",
            showConfirmButton: true,
        });
    }
}
function loadLayerEvents(element, hex) {
    makeAireGeo(element.valeur, aire => {
        if (typeof aire !== 'undefined' && aire.length > 0) {
            makeLayerByCoord(aire, element.valeur, hex);
            createRow(element, "aireGeo", hex);
        } else {
            createRow(element, "pasAireGeo", hex);
        }
    });

    successMessage("ajout termnié avec succès", "ajout de la couche " + element.valeur);
    fitToextent(element.valeur);
    sidebarClicked(clicked);
}


function deleteSessLayer(id) {
    $.ajax({
        type: 'delete',
        url: "/session/couches/" + id,
    });
}

/**
 * Retourne la couche vectorielle en fonction de son nom
 * @param {String} name 
 */
function getLayer(name) {
    let couche;
    map.getLayers().forEach(layer => {

        if (layer.get('name') != undefined && layer.get('name') == name) {
            couche = layer;
        }

    });
    return couche;
}

/**
 * Si la couche existe,il la supprime
 * @param {*} nom 
 */
function rmAiregeo(nom) {
    let aire_geo = getLayer("geo" + nom);
    if (aire_geo != undefined) {
        map.removeLayer(aire_geo);
    }
}

/**
 * Supprime une couche chargée ainsi que l'aire geo associé
 * @param {String} nom Nom de la couche
 */
function removeLayer(nom, id) {
    let layer = getLayer(nom);
    if (layer != undefined) {
        if (layer instanceof ol.layer.VectorTile) {
            rmAiregeo(nom);
        }
        try {
            map.removeLayer(layer);
            deleteSessLayer(id);
            fetchSess(dat => {
                let data = dat.filter;
                if (data.length > 0) {
                    fitToextent(data[data.length - 1].valeur); //zoom sur le dernier élément du tableau
                } else {

                    LoadLayers();
                }

            });
            map.updateSize();
            successMessage("Couche retiré avec succès", "Suppression de la couche " + nom);

        } catch (e) {
            alert("error " + e);
        }
    }

}


/**
 * Change la couche d'une couche
 * @param {String} layerName 
 * @param {String} couleur 
 * @param {String} code 
 */
function ChangeLayerColor(type, layerName, code) {
    let layer = getLayer(layerName);
    if (layer != undefined) {
        let style = styleColorFill(code);
        layer.setStyle((feature => {
            if (feature.get(type) === layerName) {
                return style;
            } else {
                return new ol.style.Style({});
            }
        }));
        map.updateSize();
    }
}

function changeAireColor(layerName, code) {

    let layer = getLayer(layerName);

    if (layer != undefined) {

        let style = styleColorStroke(code);
        layer.setStyle((feature => {
            return style;
        }));
        map.updateSize();
    } else {

    }
}

function makeAireGeo(denomination, callback) {
    $.ajax({
        url: "/aire_geo/" + denomination,
        type: 'GET',
        dataType: "json",
        success: coord => {
            callback(coord);

        }
    });
}

function fetchAireGeo(denomination, callback) {
    $.ajax({
        url: "/aire_geo/getInfo/" + denomination,
        type: 'GET',
        dataType: "json",
        success: aire_geo => {
            callback(aire_geo);
        }
    });
}

function makeLayerByCoord(coord, denom, hex) {
    let name = String("geo" + denom);
    try {
        map.addLayer(new ol.layer.Vector({
            projection: "EPSG:2154",
            name: name,
            source: new ol.source.Vector({
                projection: "EPSG:2154",
                features: (new ol.format.GeoJSON()).readFeatures(coord[0].geom)
            }),
            style: styleColorStroke(hex),
        }));
    } catch (e) {
        console.log("erreur " + e);
    }

}