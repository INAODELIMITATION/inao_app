/**
 *@author Guiala Jean Roger
 *@module Plugin toutes les fonctions d'interaction et de création de vue
 */


/**
 * Fonction d'initialisation de notre carte lors du lancement de l'application
 */
function initialisation() {
    // setIgnLayer("CADASTRALPARCELS.PARCELS", 0.7);
    // setIgnLayer("ADMINEXPRESS_COG_CARTO_2017", 0.8);

    setIgnLayer("CADASTRALPARCELS.PARCELS.L93");

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
function setIgnLayer(name, opacity) {
    format = checkformat(name);
    map.addLayer(
        new ol.layer.Tile({
            name: name,
            source: new ol.source.GeoportalWMTS({
                layer: name,
                olParams: {
                    format: format
                }
            }),
            opacity: opacity
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





// /**
//  * 
//  * @param {string} valeur ce qui est recherché, dénomination ou appellation 
//  * 
//  */
// function fitToextent(valeur) {
//     $.ajax({
//         url: "/extendTest/" + valeur,
//         type: 'GET',
//         dataType: "json",
//         success: function (data) {

//             var ex = [data[0].st_xmin, data[0].st_ymin, data[0].st_xmax, data[0].st_ymax];

//             map.getView().fit(ex, map.getSize());
//         }
//     });

// }

/**
 * vérifie si on a cliqué ou pas sur la barre de menu
 * @param {number} checker 
 */
function sidebarClicked() {
    if (this.clicked == 0) {
        clickSidebar();
        this.clicked = 1;
    }
    if (this.clicked == 1) {
        clickSidebar();
        clickSidebar();
    }
}

// /**
//  * Fonction qui crée une couche sur la carte en fonction du type et de la valeur
//  * @param {Objec{type,valeur}} element contient le type et le nom de la couche
// */
// function layerAdder(element) {
//     var colors = RandomcolorHexRgba();
//     try {
//         map.addLayer(new ol.layer.VectorTile({
//             opacity: 0.8,
//             source: sourceL,
//             name: element.valeur, // nom dela couche
//             style: (feature => {
//                 if (feature.get(element.type) === element.valeur) {
//                     return styleColorFill(colors.rgba);
//                 } else {
//                     return new ol.style.Style({});
//                 }
//             }),
//         }));
//         loadLayerEvents(element, colors.hex1);
//     } catch (e) {
//         swal({
//             title: "ERREUR lors du chargement de la couche : " + element.valeur + " " + e,
//             text: "Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
//             type: "warning",
//             showConfirmButton: true,
//         });
//     }
// }




function LayerCreator(data) {
    let color = RandomcolorHexRgba();
    createAppelationRow(data);
    aire_geoCreator(data.id_aire, color.hex1);
    aire_parcellaireCreator(data.id_aire, color);
    successMessage("ajout termnié avec succès", "ajout de la couche " + data.lbl_aire);

}


function aire_geoCreator(id_aire, color) {
    getAire_geo(id_aire, aire_geo => {
        if (aire_geo == false) {
            $("#options" + id_aire).prepend(
                '' + rowInexistant("Aire Geographique")
            );
        } else {
            makeLayerTypeByCoord(aire_geo[0].geom, color, "geo", aire_geo[0].id_aire);
            airegeoParams(id_aire, color);

        }
    });
}

/**
 * crée une couche de vectorTile
 * @param {*} data 
 * @param {*} color 
 */
function tileLayerCreator(data, color) {
    let name = "airePar" + data.id_aire;
    try {
        map.addLayer(new ol.layer.VectorTile({
            opacity: 0.8,
            source: sourceL,
            name: name, // nom dela couche
            style: (feature => {
                if (feature.get("denomination") === data.lbl_aire) {
                    return styleColorFill(color.rgba);
                } else {
                    return new ol.style.Style({});
                }
            }),
        }));
        getextent(data.id_aire);
    } catch (e) {
        swal({
            title: "ERREUR lors du chargement de la couche : " + data.lbl_aire + " " + e,
            text: "Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
            type: "warning",
            showConfirmButton: true,
        });
    }
}

function aire_parcellaireCreator(id_aire, color) {
    getAireParcellaire(id_aire, aire => {
        if (aire == false) {
            $("#options" + id_aire).append(
                '' + rowInexistant("Aire Parcellaire")
            );
        } else {
            tileLayerCreator(aire, color);

            aireParcParams(aire, color);
        }
    });
}
function getAireParcellaire(id_aire, callback) {
    $.ajax({
        url: "/zone/aire_parcellaire/" + id_aire,
        type: 'GET',
        dataType: "json",
        success: function (data) {
            callback(data)
        }
    });
}


/**
 * 
 * @param {string} valeur ce qui est recherché, dénomination ou appellation 
 * 
 */
function getextent(id_aire) {
    $.ajax({
        url: "/getExtendParcellaire/" + id_aire,
        type: 'GET',
        dataType: "json",
        success: function (data) {

            var ex = [data[0].st_xmin, data[0].st_ymin, data[0].st_xmax, data[0].st_ymax];

            map.getView().fit(ex, map.getSize());
        }
    });

}

function getAire_geo(id_aire, callback) {
    $.ajax({
        url: "/zone/aire_geo/" + id_aire,
        type: 'GET',
        dataType: "json",
        success: function (data) {
            callback(data);

        }
    });
}


// function loadLayerEvents(element, hex) {
//     makeAireGeo(element.valeur, aire => {
//         if (typeof aire !== 'undefined' && aire.length > 0) {
//             makeLayerByCoord(aire, element.valeur, hex);
//             createRow(element, "aireGeo", hex);
//         } else {
//             createRow(element, "pasAireGeo", hex);
//         }
//     });

//     successMessage("ajout termnié avec succès", "ajout de la couche " + element.valeur);
//     fitToextent(element.valeur);
//     sidebarClicked();
// }


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

// /**
//  * Si la couche existe,il la supprime
//  * @param {*} nom 
//  */
// function rmAiregeo(nom) {
//     let aire_geo = getLayer("geo" + nom);
//     if (aire_geo != undefined) {
//         map.removeLayer(aire_geo);
//     }
// }

// /**
//  * Supprime une couche chargée ainsi que l'aire geo associé
//  * @param {String} nom Nom de la couche
//  */
// function removeLayer(nom, id) {
//     let layer = getLayer(nom);
//     if (layer != undefined) {
//         if (layer instanceof ol.layer.VectorTile) {
//             rmAiregeo(nom);
//         }
//         try {
//             map.removeLayer(layer);
//             deleteSessLayer(id);
//             fetchSess(dat => {
//                 let data = dat.filter;
//                 if (data.length > 0) {
//                     fitToextent(data[data.length - 1].valeur); //zoom sur le dernier élément du tableau
//                 } else {

//                     LoadLayers();
//                 }

//             });
//             map.updateSize();
//             successMessage("Couche retiré avec succès", "Suppression de la couche " + nom);

//         } catch (e) {
//             alert("error " + e);
//         }
//     }

// }
/**
 * Nom de la couche
 * @param {String} nom 
 */
function layerRemover(nom) {
    try {
        let layer = getLayer(nom);
        if (layer != undefined) {
            map.removeLayer(layer);
        }
        map.updateSize();
        successMessage("Couche retiré avec succès", "Suppression de la couche ");
    } catch (error) {
        console.log(error);
    }
}


// /**
//  * Change la coueleur d'une couche
//  * @param {String} layerName 
//  * @param {String} couleur 
//  * @param {String} code 
//  */
// function ChangeLayerColor(type, layerName, code) {
//     let layer = getLayer(layerName);
//     if (layer != undefined) {
//         let style = styleColorFill(code);
//         layer.setStyle((feature => {
//             if (feature.get(type) === layerName) {
//                 return style;
//             } else {
//                 return new ol.style.Style({});
//             }
//         }));
//         map.updateSize();
//     }
// }

function tileLayerColorChanger(lbl_aire, name, color) {
    let layer = getLayer(name);
    if (layer != undefined) {
        let style = styleColorFill(color);
        layer.setStyle((feature => {
            if (feature.get("denomination") === lbl_aire) {
                return style;
            } else {
                return new ol.style.Style({});
            }
        }));
        map.updateSize();
    }
}
/**
 * Change la couleur de l'aire géographique
 * @param {*} layerName 
 * @param {*} code 
 */
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

// /**
//  * 
//  * @param {*} denomination 
//  * @param {*} callback 
//  */
// function makeAireGeo(denomination, callback) {
//     $.ajax({
//         url: "/aire_geo/" + denomination,
//         type: 'GET',
//         dataType: "json",
//         success: coord => {
//             callback(coord);

//         }
//     });
// }

// /**
//  * 
//  * @param {*} denomination 
//  * @param {*} callback 
//  */
// function fetchAireGeo(denomination, callback) {
//     $.ajax({
//         url: "/aire_geo/getInfo/" + denomination,
//         type: 'GET',
//         dataType: "json",
//         success: aire_geo => {
//             callback(aire_geo);
//         }
//     });
// }

// /**
//  * 
//  * @param {*} coord 
//  * @param {*} denom 
//  * @param {*} hex 
//  */
// function makeLayerByCoord(coord, denom, hex) {
//     let name = String("geo" + denom);
//     try {
//         map.addLayer(new ol.layer.Vector({
//             projection: "EPSG:2154",
//             name: name,
//             source: new ol.source.Vector({
//                 projection: "EPSG:2154",
//                 features: (new ol.format.GeoJSON()).readFeatures(coord[0].geom)
//             }),
//             style: styleColorStroke(hex),
//         }));
//     } catch (e) {
//         console.log("erreur " + e);
//     }

// }

/**
 * 
 * @param {*} coord 
 * @param {*} couleur 
 * @param {*} type 
 * @param {*} nom 
 */
function makeLayerTypeByCoord(coord, couleur, type, id) {
    let name = String(type + '' + id);
    try {
        map.addLayer(new ol.layer.Vector({
            projection: "EPSG:2154",
            name: name,
            source: new ol.source.Vector({
                projection: "EPSG:2154",
                features: (new ol.format.GeoJSON()).readFeatures(coord)
            }),
            style: styleColorStroke(couleur),
        }));
        let extent = getLayer(name).getSource().getExtent();
        map.getView().fit(extent, map.getSize());
        map.updateSize();
    } catch (e) {
        console.log("erreur " + e);
    }
}



/*
 * recupère la parcelle
 * @param {*} denomination 
 * @param {*} callback 
 */
function fetchCommune(insee, callback) {
    $.ajax({
        url: "/communes/" + insee,
        type: 'GET',
        dataType: "json",
        success: commune => {
            callback(commune);

        }
    });
}




/*
 * recupère la parcelle
 * @param {*} denomination 
 * @param {*} callback 
 */
function fetchParcelle(id, callback) {
    $.ajax({
        url: "/parcelles/" + id,
        type: 'GET',
        dataType: "json",
        success: parcelle => {
            callback(parcelle);

        }
    });
}



/**
 * retourne la liste des parcelles en fonction de la recherche
 */
function AjaxParcelle() {
    $.ajax({
        url: "/parcelles",
        data: {
            'insee': $("#sectionID").val(),
            'section': $("#Parsection").val(),
            'numpar': $("#numpar").val()
        },
        dataType: "json",
        type: "POST",
        success: function (data) {
            resetParcelleSearch();
            data.forEach((parcelle) => {

                appendParcelle(parcelle);
            });

        }

    });
}


function makeCommune(insee) {
    fetchCommune(insee, commune => {
        makeLayerTypeByCoord(commune.geom,"yellow","com",commune.code_insee);
        SearchRow(commune, "commune");
    });
}

function loadCommune(insee) {
    makeCommune(insee);
}

function zoomExtentVectorLayer(name) {
    try {
        let couche = getLayer(name);
        if (couche) {
            let extent = couche.getSource().getExtent();
            map.getView().fit(extent, map.getSize());
            map.updateSize();
        }
    } catch (error) {
        console.log(error);
    }

}
function makeParcelle(id) {
    fetchParcelle(id, parcelle => {
        makeLayerTypeByCoord(parcelle.geom,"yellow","par",parcelle.id);
        SearchRow(parcelle, "parcelle");
    });
}


function loadParcelle(id) {
    makeParcelle(id);
    map.updateSize();

}