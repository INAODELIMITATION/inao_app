/**
 *@author Guiala Jean Roger
 *@module Plugin toutes les fonctions d'interaction et de création de vue
 */


/**
 * Fonction d'initialisation de notre carte lors du lancement de l'application
 */
function initialisation() {
    setIgnLayer("CADASTRALPARCELS.PARCELS", 0.7, 'parcelle Cadastrale', true);

   
    // setIgnLayer("CADASTRALPARCELS.PARCELS.L93", 0.7, 'parcelle Cadastrale', true);
    try {
        setIgnLayer("ADMINEXPRESS_COG_CARTO_2017", 0.8, "couche Administrative", false);
        setIgnLayer("ORTHOIMAGERY.ORTHOPHOTOS",0.7,"orthoPhotos",false);
        setIgnLayer("GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOPO.L93",0.7,"SCAN 25 Topographique",false);
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
        case "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.NIVEAUXGRIS.L93" : {return "image/png"; break}
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

/**
 * Fonction qui initialise une couche de l'IGN
 * @param {String} name 
 */
function setBrgmLayer(name,libelle,visibility,opacity) {
   // format = checkformat(name);
    map.addLayer(
        new ol.layer.Tile({
            name:name,
            source: new ol.source.TileWMS({
                url: 'https://geoservices.brgm.fr/geologie',
                params: {
                    LAYERS: 'SCAN_D_GEOL50', 
                    TRANSPARENT:true
                },
                projection:'EPSG:2154' 
            }),
            // visible: visibility,
            // opacity: opacity
        })

    );
    appendIgnparams(name, libelle);
}

function changeOpacity(name, opacity) {
    let lay = getLayer(name);
    if (lay) {
        lay.setOpacity(opacity);
    }
}


function appendIgnparams(name, libelle) {
    let little = name.substring(0, 4);
    let inp;
    if (little == "CADA") {
        inp = ' <input type="checkbox" checked  name="collapsemenu" class="onoffswitch-checkbox" id="' + little + '">';
    } else {
        inp = ' <input type="checkbox"    name="collapsemenu" class="onoffswitch-checkbox" id="' + little + '">';
    }
  
    appendIgn(libelle,little,inp,name);
   
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
    try {
        let layersData = JSON.parse(window.localStorage.getItem("layers"));  
        if (!layersData) {
            layersData = [];
        } else {
            layersData.reverse();
            layersData.forEach((item,i) => {
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
    } catch (error) {
        
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
    try {
        let layersData = JSON.parse(window.localStorage.getItem("layers"));
        if (!layersData) {
            layersData = [];
        }
        layersData.push(data);
        window.localStorage.setItem("layers", JSON.stringify(layersData));
    } catch (error) {
        
    }
   

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

function airegeoExist(id_aire, callback) {
    $.ajax({
        url: "/aire_geo/" + id_aire,
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

/**
 * 
 * @param {number} id_aire id aire
 * @param {string} name libelle 
 * @param {string} color 
 */
function tileLayerColorChanger(id_aire, name, color) {
    let layer = getLayer(name);
    if (layer != undefined) {
        let style = styleColorFill(color);
        layer.setStyle((feature => {
            if (feature.get("id_aire") === id_aire) {
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


/**
 * supprime une aire geographique ou une aire parcellaire en fonction du type
 * @author Jean Roger NIGOUMI Guiala
 * @param  {number} id_aire
 * @param  {string} type
 */
function deleteAire(id_aire, type) {
    if (type == "geo") {
        getAire_geo(id_aire, aire_geo => {
            if (aire_geo != false) {
                let nom = "geo" + id_aire;
                layerRemover(nom);
            }
        });
    }
    if (type == "par") {
        getAireParcellaire(id_aire, aire => {
            if (aire != false) {
                let nom = "airePar" + id_aire;
                layerRemover(nom);
            }
        });
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




/**
 * change la position d'une couche en fonction du nom de la couche et la position
 * @param {String} nom 
 * @param {number} position 
 */
function changeIndexLayer(nom, position) {
    try {
        let couche = getLayer(nom);
        couche.setZIndex(position);
    } catch (error) {
        console.log(error);
    }
}

/**
 * change la position d'une couche commune
 * @param {Object} layersData couches en cache
 * @param {Object} element element qui change de position
 */
function changeIndexCommune(layersData, element) {
    let commune = layersData.filter(layer => layer.type == "commune");

    if (commune.length > 0) {
        commune.forEach(communes => {
            if (communes.id == parseInt(element.id)) {
                changeIndexLayer("com" + communes.id, element.position);
            }


        });
    }
}

/**
 * change la position d'une couche parcelle
 * @param {array Object} layersData couches en cache
 * @param {*} element element qui change de position
 */
function changeIndexParcelle(layersData, element) {
    let parce = layersData.filter(layer => layer.type == "parcelle");
    if (parce.length > 0) {
        parce.forEach(parces => {
            if (parces.id == parseInt(element.id)) {
                changeIndexLayer("par" + parces.id, element.position);
            }
        });
    }
}

/**
 * change la position d'une couche d'aire parcellaire
 * @param {Object} element element qui change de position
 */
function changeIndexParcellaire(element) {
    getAireParcellaire(element.id_aire, aire => {
        if (aire == false) {
        } else {
            changeIndexLayer("airePar" + aire.id_aire, element.position);
        }
    });
}

/**
 * change la position d'une couche d'aire geographique
 * @param {Object} element  element qui change de position
 */
function changeIndexAireGeo(element) {
    airegeoExist(parseInt(element.id_aire), aire => {
        if (aire == false) {
        } else {
            changeIndexLayer("geo" + element.id_aire, element.position);
        }
    });
}
/**
 *change les positions de la liste des couches
 * @param {Array Object} tableau  Tableau contenant les élements qui change de position ainsi que leur position
 */
function changePositions(tableau){
    tableau.forEach(element => {
        if (element.type == "appellation") {
            changeIndexParcellaire(element);
            changeIndexAireGeo(element);

        } else {
            let layersData = JSON.parse(window.localStorage.getItem("layers"));
            changeIndexParcelle(layersData, element);

            changeIndexCommune(layersData, element);
        }

    });
}
/**
 * constitue un tableau des elements et positions en fonctions des id des couches
 * @param {Array} tableauID 
 */
function makeID(tableauID) {
    let tab = [];
    tableauID.forEach(element => {
        tab.push(element);
    });
    tab = tab.reverse();
    let tablePositions = makepositionTable(tab); 
    return tablePositions;
}

/**
 * crée le tableau des positions
 * @param {*} tab 
 */
function makepositionTable(tab){
    let data = [];
    tab.forEach((element, i) => {
        if (element.startsWith("couche")) {
            data.push({
                id_aire: element.substring(6),
                type: "appellation",
                position: i
            });
        }
        if (element.startsWith("autrecouche")) {
            data.push({
                id: element.substring(11),
                type: "autre",
                position: i
            });
        }

    });
    return data; 
}

function makeAppelList(coordinate){
    $("#listContent").empty();
        $("#listappel").hide();
    $.ajax({
        url: "listAppel/" + coordinate[0] + "/" + coordinate[1],
        dataType: "json",
        type: "GET",
        success: (data) => {
            data.forEach(element => {
                $("#listContent").append(
                    '<li><a id="appel'+element.id_aire+'">' + element.lbl_aire + '</a></li>'
                );
                $("#appel"+element.id_aire).on('click',()=>{
                    try {
                        LayerCreator(element);
                        storageAdder(element);
                    } catch (error) {
                        console.log(error);
                    }
                });
            });
           
            $("#listappel").show();
        }
    });
}

function closeList(){
    $("#closerlist").on('click', () => {
        vectorSource.clear();
        $("#listappel").hide();
    });
}

function mapOnClick(){
    map.on('click', function (evt) {
        addMarker(evt.coordinate);
        makeAppelList(map.getCoordinateFromPixel(evt.pixel));
    });

}

