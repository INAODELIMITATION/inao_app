/**
 * @file Plugin toutes les fonctions métier
 * @copyright INAO 2018
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @version 1.0.0
 * @module ModulePlugin 
 */

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function GeoportailConfig
 * @description configuration du geoportail et lancement application
 */
function GeoportailConfig(){
 try {
        Gp.Services.getConfig({
            //serverUrl: "/javascripts/autoconf/local.json", //local
            serverUrl: "/GPautoconf/autoconf-https.json", //server
            callbackSuffix: "",
            onSuccess: initialisation,
            onFailure: fail,
        });
    } catch (error) {
        fail();
    }
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function initialisation
 * @description Fonction d'initialisation de notre carte lors du lancement de l'application
 */
function initialisation() {
 
    //setIgnLayer("CADASTRALPARCELS.PARCELS", 0.7, 'parcelle Cadastrale', true);
    setIgnLayer("CADASTRALPARCELS.PARCELS.L93", 0.7, 'parcelle Cadastrale', true);
 
    try {

        //setIgnLayer("ADMINEXPRESS_COG_CARTO_2017", 0.7, "couche Administrative", true);
        createOSM("opensmap", "OpenstreetMap", false, 0.7);
        setIgnLayer("ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO.L93", 0.7, "orthoPhotos", false);
        setIgnLayer("GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOPO.L93", 0.7, "SCAN 25 Topographique", false);
    } catch (error) {
        console.log(error);
    }

    LoadLayers();

    map.getView().fit(extent, map.getSize());


}


/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function createOSM
 * @description crée la couche OSM
 * @param {String} name nom de la couche
 * @param {String} libelle nom qui s'affiche a l'écran
 * @param {Boolean} visibility visibilité prend la valeur true ou false
 * @param {float} opacity opacité entre 0 et 1
 */
function createOSM(name, libelle, visibility, opacity) {

    map.addLayer(new ol.layer.Tile({
        name: name,
        source: new ol.source.OSM(),
        opacity: opacity,
        visible: visibility
    }));
    appendIgnparams(name, libelle, visibility);

}



/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function fail en cas d'echec du chargement 
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function checkformat En fonction du format, initialise la carte IGN
 * @param {String} name nom de la couche 
 */
function checkformat(name) {
    let format;
    switch (name) {
        case "CADASTRALPARCELS.PARCELS.L93": { format= "image/png"; break;}
        case "CADASTRALPARCELS.PARCELS": {  format= "image/png"; break;}
        case "ADMINEXPRESS_COG_CARTO_2017": {  format= "image/png"; break;}
        case "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.L93": {  format= "image/png"; break; }
        default: {  format= "image/jpeg"; }
    }
    return format;
}


/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function setIgnLayer Fonction qui initialise une couche de l'IGN
 * @param {string} name  nom de la couche
 * @param {Float} opacity Opacité, valeur entre 0 et 1
 * @param {string} libelle nom de la couche affiché à l'écran
 * @param {Boolean} visibility visibilité
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
    appendIgnparams(name, libelle, visibility);
}

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function changeOpacity
 * @description change l'opacité d'une couche
 * @param {String} name nom de la couche
 * @param {Float} opacity Opacité, valeur entre 0 et 1
 */
function changeOpacity(name, opacity) {
    let lay = getLayer(name);
    if (lay) {
        lay.setOpacity(opacity);
    }
}


/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function appendIgnparams
 * @description ajoute dans le volet de droite la visibilité
 * @param {String} name nom de la couche
 * @param {String} libelle nom de la couche qui s'affiche à l'écran
 * @param {Boolean} visibility visibilité de la couche prend les valeurs {true} ou false
 */
function appendIgnparams(name, libelle, visibility) {
    /**le nom réduit de la couche utilisé comme id du champ */
    let little = name.substring(0, 4);
    let inp;
    if (visibility == true) {
        inp = ' <input type="checkbox" checked  name="collapsemenu" class="onoffswitch-checkbox" id="' + little + '">';
    } else {
        inp = ' <input type="checkbox"    name="collapsemenu" class="onoffswitch-checkbox" id="' + little + '">';
    }

    /**
     * @description crée une ligne contenant les parametres de la couche
     * @param {string} little nom de la couche réduit
     * @param {string} inp ligne contenant le visibility switcher
     *
     */
    appendIgn(libelle, little, inp, name, visibility);

}






/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function LoadLayers
 * @description Charge la carte de base et affiche les couches en session si il y en a 
 */
function LoadLayers() {
    try {
        /**liste des couches chargées en local sur le navigateur */
        let layersData = JSON.parse(window.localStorage.getItem("layers"));
       
      
        
        if (!layersData) {
            layersData = [];
        } else {
            layersData.reverse();
            layersData.forEach((item, i) => {
                if (item.type == "appellation") {
                    /**si c'est une appellation, alors on appelle la fonction qui crée l'appellation */
                    LayerCreator(item);
                }
                if (item.type == "parcelle") {
                    /**si c'est une parcelle, alors on appelle la fonction qui crée la parcelle */
                    makeParcelle(item.id);
                }
                if (item.type == "commune") {
                    /**si c'est une commune, alors on appelle la fonction qui crée la commune */
                    makeCommune(item.id);
                }
            });
        }
        /** en cas d'erreur */
    } catch (error) {

    }



}




/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function successMessage
 * @description Fonction qui affiche un message une fois que la carte a chargé pour la premiere fois.
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
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function sidebarClicked
 * @description vérifie si on a cliqué ou pas sur la barre de menu
 *
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

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function storageAdder
 * @description ajoute en cache une couche chargée
 * @param {JSON} data  couche a achouté
 */
function storageAdder(data) {
    try {
        /**liste des couches chargées en local sur le navigateur */
        let layersData = JSON.parse(window.localStorage.getItem("layers"));
        if (!layersData) {
            layersData = [];
        }
        layersData.push(data);
        window.localStorage.setItem("layers", JSON.stringify(layersData));

    } catch (error) {

    }


}

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function storagedeleterAppel
 * @description supprime en cahce une appellation
 * @param {int} id_aire identifiant de la zone
 */
function storagedeleterAppel(id_aire) {
    /**liste des couches chargées en local sur le navigateur */
    let layersData = JSON.parse(window.localStorage.getItem("layers"));
    if (layersData) {
        let filtered = layersData.filter(layer => layer.id_aire != id_aire);
        window.localStorage.setItem("layers", JSON.stringify(filtered));
    }
}
/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function storagedeleterOther
 * @description supprime en cache une parcelle ou une commune
 * @param {int} id id dela commune ou la parcelle
 */
function storagedeleterOther(id) {
    let layersData = JSON.parse(window.localStorage.getItem("layers"));
    if (layersData) {
        let filtered = layersData.filter(layer => layer.id != id);
        window.localStorage.setItem("layers", JSON.stringify(filtered));
    }
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function LayerCreator
 * @description crée une couche d'appellation (aire géo et/ou aire parcellaire)
 * @param {Array} data id nom et type de la couche
 */
function LayerCreator(data) {
    let color = RandomcolorHexRgba();
    createAppelationRow(data);
    aire_geoCreator(data.id_aire, color.hex1);
    aire_parcellaireCreator(data.id_aire, color);
    successMessage("ajout termnié avec succès", "ajout de la couche " + data.lbl_aire);
}



/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function aire_geoCreator
 * @description crée une aire géographique
 * @param {int} id_aire id de la zone 
 * @param {String} color couleur en hexadécimal
 */
function aire_geoCreator(id_aire, color) {
    getAire_geo(id_aire, aire_geo => {
        if (aire_geo == false) {
            $("#options" + id_aire).prepend(
                '' + rowInexistant("Aire Geographique")
            );
        } else {
            $("#geoextend" + id_aire).on('click', () => {
                try {
                    let extent = getLayer("geo" + id_aire).getSource().getExtent();
                    map.getView().fit(extent, map.getSize());
                    map.updateSize();
                } catch (e) {
                    console.log(e);
                }
            });
            /**création de l'aire géographique */
            makeLayerTypeByCoord(aire_geo[0].geom, color, "geo", aire_geo[0].id_aire);
            /**Paramétres couleur et visibilité */
            airegeoParams(id_aire, color);
           

        }
    });
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function tileLayerCreator
 * @description crée une couche de vectorTile
 * @param {*} data parametre de la couche 
 * @param {*} color couleur
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

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function aire_parcellaireCreator
 * @description crée une aire parcellaire
 * @param {int} id_aire id de la zone
 * @param {String} color couleur
 */
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
/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function getAireParcellaire
 * @description recupere une aire parcellaire si elle existe
 * @param {int} id_aire id de la zone
 * @param {callback} callback callback pour exécuter une fonction par la suite lors de l'appel
 */
function getAireParcellaire(id_aire, callback) {
    $.ajax({
        url: "/zone/aire_parcellaire/" + id_aire,
        type: 'GET',
        dataType: "json",
        success: function (data) {
            callback(data);
        }
    });
}

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function addRequest
 * @description ajoute dans la table request la requete de l'utilisateur
 * @param {int} id_aire id de la zone
 */
function addRequest(id_aire) {
   
    $.ajax({
        url: "/request/" + id_aire,
        type: 'GET',
        dataType: "json",
        success: function (data) {
          //ajout requete
        }
    });
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function getextent
 * @description recupére l'extend d'une aire parcellaire
 * @param {int} id_aire id de la zone qui est recherché
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

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function getAire_geo
 * @description recupere l'aire géo si elle existe
 * @param {int} id_aire id de la zone
 * @param {callback} callback callback pour exécuter une opération lors de l'appel de la fonction par la suite
 */
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function airegeoExist
 * @description vérifie si l'aire géographique existe
 * @param {int} id_aire id de la zone
 * @param {callback} callback callback pour exécuter une opération lors de l'appel de la fonction par la suite
 */
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function getLayer
 * @description Retourne la couche vectorielle en fonction de son nom
 * @param {String} name nom de la couche
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description retire une couche une fois qu'on a son nom
 * @function layerRemover
 * @param {String} nom nom de la couche
 */
function layerRemover(nom) {
    try {
        /**récupération de la couche à partir de son nom */
        let layer = getLayer(nom);
        if (layer != undefined) {
            map.removeLayer(layer);
        }
        map.updateSize();

        //toastr.error('Couche retiré avec succès', 'Suppression de la couche');
    } catch (error) {
        console.log(error);
    }
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function tileLayerColorChanger
 * @description change la couleur d'une couche (MVT)
 * @param {number} id_aire id aire
 * @param {string} name libelle 
 * @param {string} color couleur que prendra la couche
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
 * @description Change la couleur de l'aire géographique
 *  @author Jean Roger NIGOUMI Guiala
 * @function changeAireColor
 * @param {string} layerName nom de la couche
 * @param {string} code couleur en hexadécimal
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
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makeLayerTypeByCoord crée une couche à partir de données GEOJSON
 * @param {GeoJSON} coord coordonnée de la couche
 * @param {string} couleur couleur que prendra la couche
 * @param {string} type type de couche
 * @param {int} id id de la couche
 */
function makeLayerTypeByCoord(coord, couleur, type, id) {
    /**création du nom de la couche en concaténant le type et l'id */
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
 * @function deleteAire
 * @description supprime une aire geographique ou une aire parcellaire en fonction du type
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @param  {number} id_aire id de la zone
 * @param  {string} type type de couche
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


/** 
 * 
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function fetchCommune recupère la parcelle
 * @param {string} insee insee de la commune
 * @param {callback} callback  callback pour éxécuter des actions lors de l'appel de la fonction
 **/
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




/** 
 * @function fetchParcelle recupère la parcelle
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @param {int} id id de la parcelle
 * @param {callback} callback callback pour éxécuter des actions lors de l'appel de la fonction
 **/
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



/** @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function retourne la liste des parcelles en fonction de la recherche
 **/
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

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makeCommune fonction qui crée une commune a partir de son insee
 * @param {string} insee insee de la commune
 */
function makeCommune(insee) {
    /**on récupére la commune et callback pour appeller la fonction qui crée la commune */
    fetchCommune(insee, commune => {
        makeLayerTypeByCoord(commune.geom, "#f8ac59", "com", commune.code_insee);
        /**on crée la ligne pour la commune */
        SearchRow(commune, "commune");
    });
}

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function loadCommune charge la commune
 * @param {string} insee insee de la commune
 */
function loadCommune(insee) {
    makeCommune(insee);
    let data = {
        id: insee,
        type: "commune"
    };
    storageAdder(data);
}

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function zoomExtentVectorLayer zoom sur l'etendu du couche vectorielle
 * @param {String} name nom de la couche
 */
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

/**
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makeParcelle crée une parcelle
 * @param {integer} id id de la parcelle
 */
function makeParcelle(id) {
    fetchParcelle(id, parcelle => {
        makeLayerTypeByCoord(parcelle.geom, "#f8ac59", "par", parcelle.id);
        SearchRow(parcelle, "parcelle");

    });
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function loadParcelle charge la parcelle
 * @param {number} id id de la parcele
 */
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function changeIndexLayer change la position d'une couche en fonction du nom de la couche et la position
 * @param {String} nom nom de la couche
 * @param {number} position position à prendre par la couche
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function changeIndexCommune change la position d'une couche commune
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function changeIndexParcelle change la position d'une couche parcelle
 * @param {JSON} layersData couches en cache
 * @param {JSON} element element qui change de position
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function changeIndexParcellaire change la position d'une couche d'aire parcellaire
 * @param {JSON} element element qui change de position
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
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function changeIndexAireGeo change la position d'une couche d'aire geographique
 * @param {JSON} element  element qui change de position
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
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 *@function changePositions change les positions de la liste des couches
 * @param {JSON} tableau  Tableau contenant les élements qui change de position ainsi que leur position
 */
function changePositions(tableau) {
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
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makeID constitue un tableau des elements et positions en fonctions des id des couches
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
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makepositionTable
 * @description crée le tableau des positions
 * @param {Array} tab tableau de couche en session
 */
function makepositionTable(tab) {
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


/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makeAppelList
 * @description liste des appellations à un endroit
 * @param {Array} coordinate  coordonnée de l'endroit cliqué
 */
function makeAppelList(coordinate) {

    $("#listContent").empty();
    $("#listappel").hide();


    $.ajax({
        url: "listAppel/" + coordinate[0] + "/" + coordinate[1],
        dataType: "json",
        type: "GET",
        success: (data) => {

            data.forEach(element => {
                $("#listContent").append(
                    '<li><a id="appel' + element.id_aire + '">' + element.lbl_aire + '</a></li>'

                );
                $("#appel" + element.id_aire).on('click', () => {
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

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function closeList
 * @description ferme la liste des appellations à un endroit
 */
function closeList() {
    $("#closerlist").on('click', () => {
        vectorSource.clear();
        $("#listappel").hide();
    });
}



/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function getlien
 * @description recupere le lien vers la description d'une appellation
 * @param {int} id_aire id de la zone
 * @param {callback} callback callback pour éxécuter des actions lors de l'appel de la fonction
 */
function getlien(id_aire, callback) {
    $.ajax({
        url: "/siqo/lien/" + id_aire,
        dataType: "json",
        type: "GET",
        success: (lien) => {
            callback(lien);
        }
    });
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function ajaxSearch
 * @description recupère la liste des appellations qui correspondent au terme entré
 * @param {string} query terme tapé par l'utilisateur
 * @param {callback} callback fonction qui va gérer le resultat
 */
function ajaxSearch(query, callback) {
    $.ajax({
        url: "/search",
        data: 'libelle=' + query,
        dataType: "json",
        type: "POST",
        success: function (data) {
            callback(data);

        }
    });
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function makeappelData
 * @description crée un objet contenant l'id, le libelle et le type 
 * @param {JSON} item 
 * @param {Array} libelle 
 * @returns {Object} object appellation
 */
function makeappelData(item,libelle) {
    return {
        id_aire: libelle[item],
        lbl_aire: item,
        type: "appellation"
    };
}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function createAndSaveAppellation
 * @description crée la couche appellation et enregistre dans le navigateur
 * @param {JSON} data 
 */
function createAndSaveAppellation(data){
    try {
        LayerCreator(data);
        storageAdder(data);

    } catch (error) {
        console.log(error);
    }

}

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function ajaxCommune
 * @description recupère la liste des communes
 * @param {string} query terme saisi
 * @param {callback} callback fonction qui gère le resultat
 */
function ajaxCommune(query,callback){
    $.ajax({
        url: "/communes/",
        data: 'commune=' + query,
        dataType: "json",
        type: "POST",
        success:  (data) => {
            callback(data);
        }
    });
}
