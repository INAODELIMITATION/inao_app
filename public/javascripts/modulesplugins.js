/**
 *@author Guiala Jean Roger
 *@module Plugin toutes les fonctions d'interaction et de création de vue
 */


/**
 * Fonction d'initialisation de notre carte lors du lancement de l'application
 */
function initialisation() {
    //setIgnLayer("CADASTRALPARCELS.PARCELS", 0.7, 'parcelle Cadastrale', true);
   
  

    setIgnLayer("CADASTRALPARCELS.PARCELS.L93", 0.7, 'parcelle Cadastrale', true);
    try {
        setIgnLayer("ADMINEXPRESS_COG_CARTO_2017", 0.8, "couche Administrative", false);
    } catch (error) {
       console.log(error); 
    }
   
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
function setIgnLayer(name, opacity, libelle, visibility) {
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
            visible: visibility,
            opacity: opacity
        })

    );


    appendIgnparams(name, libelle);



}

function appendIgnparams(name, libelle) {
    let little = name.substring(0,4);
    let inp;
    if(little == "CADA"){
        inp =   ' <input type="checkbox" checked  name="collapsemenu" class="onoffswitch-checkbox" id="' +little + '">';
    }else{
        inp =   ' <input type="checkbox"   name="collapsemenu" class="onoffswitch-checkbox" id="' +little + '">';
    }
    $("#coucheIGN").append(
        ' <div class="setings-item">' +
        ' <span>' +
        libelle +
        ' </span>' +
        ' <div class="switch">' +
        ' <div class="onoffswitch">' +
        inp+
        ' <label class="onoffswitch-label" for="' + little + '">' +
        '     <span class="onoffswitch-inner"></span>' +
        '   <span class="onoffswitch-switch"></span>' +
        '    </label>' +
        '    </div>' +
        ' </div>' +
        '   </div>'
    );
    let id = "#"+little;
    console.log(id);
    $("" + id+"").on('click', () => {
        ignLayerswitcher(name);
    });
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
 * Charge la carte de base et affiche les couches en session si il y en a 
 */
function LoadLayers() {
    let layersData = JSON.parse(window.localStorage.getItem("layers"));
    if (!layersData) {
        layersData = [];
    } else {
        layersData.forEach(item => {
            if (item.type == "appellation") {
                LayerCreator(item);
            }
            if (item.type == "parcelle") {
                makeParcelle(item.id);
            }
            if (item.type == "commune") {
                makeCommune(item.id);
            }
        });
    }

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

function storageAdder(data) {
    let layersData = JSON.parse(window.localStorage.getItem("layers"));
    if (!layersData) {
        layersData = [];
    }
    layersData.push(data);
    window.localStorage.setItem("layers", JSON.stringify(layersData));

}

function storagedeleterAppel(id_aire) {
    let layersData = JSON.parse(window.localStorage.getItem("layers"));
    if (layersData) {
        let filtered = layersData.filter(layer => layer.id_aire != id_aire);
        window.localStorage.setItem("layers", JSON.stringify(filtered));
    }
}
function storagedeleterOther(id) {
    let layersData = JSON.parse(window.localStorage.getItem("layers"));
    if (layersData) {
        let filtered = layersData.filter(layer => layer.id != id);
        window.localStorage.setItem("layers", JSON.stringify(filtered));
    }
}

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
                if (feature.get("id_aire") === data.id_aire) {
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
        makeLayerTypeByCoord(commune.geom, "yellow", "com", commune.code_insee);
        SearchRow(commune, "commune");
    });
}

function loadCommune(insee) {
    makeCommune(insee);
    let data = {
        id: insee,
        type: "commune"
    };
    storageAdder(data);
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
        makeLayerTypeByCoord(parcelle.geom, "yellow", "par", parcelle.id);
        SearchRow(parcelle, "parcelle");

    });
}


function loadParcelle(id) {
    makeParcelle(id);
    let data = {
        id: id,
        type: "parcelle"
    };
    storageAdder(data);
    map.updateSize();

}
