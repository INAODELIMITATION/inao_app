/**
 *@author Guiala Jean Roger
 *@module Plugin toutes les fonctions d'interaction et de création de vue
 * Fichier contenant les fonctions et les variables de base relatif à la carte, ces fonctions sont appellées et utilisées par d'autres fichier 
 * Javascript
 */


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
function fetchSess(handleData){
    $.ajax({
        url:"/session/couches/NULL",
        type:'GET',
        dataType:"json",
        success:data=>{
            handleData(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });
}
/**
 * Charge la carte de base et affiche les couches en session si il y en a 
 */
function LoadLayers() { 
    fetchSess(data=>{
        let sess = data.filter;
        if (sess.length > 0) {
            let filtered = removeDuplicates(sess, 'valeur');
            loadLayersess(filtered);
    
        } else {
            map.addLayer(layerMVT); //ajout de la couche à la carte
    
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
            timeOut: 8000
        };
        toastr.success(libelle, valeur);

    }, 1300);
}

/**
 * chargement des variables générale et des fonctions qui vont etre utilisé par d'autres pages JS
 */

var extent = [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772];
var projection = new ol.proj.Projection({
    code: 'EPSG:2154',
    extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
    units: 'm',
    axisOrientation: 'neu'
}); // definition du EPSG 2154

ol.proj.addProjection(projection); //inclusion du EPSG dans openlayer
var proj2154 = ol.proj.get('EPSG:2154'); //recupération de la projection
proj2154.setExtent(extent);
var projectionExtent = proj2154.getExtent(); //recupération de l'étendu de la projection 
var variable = 21;
var resolutions = new Array(variable);
var matrixIds = new Array(variable);
var maxResolution = ol.extent.getWidth(projectionExtent) / 256; //recupérationd des résolutions
for (var i = 0; i < variable; ++i) {
    matrixIds[i] = 'EPSG:2154:' + i;
    resolutions[i] = (maxResolution) / Math.pow(2, i);
    //alert(resolutions[i]);

}

/**
 * fonction permettant de créer un style
 * @param {string} couleur la couleur des traits
 * @param {string} code le code en rgba du remplissage 
 */
function styleColor(couleur, code) {
    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: couleur,
            width: 2
        }),
        fill: new ol.style.Fill({
            color: code
        })
    })];
}

// différentes couleur dans un objet 
var styles = {
    yellow: styleColor('yellow', 'rgba(255,255,0,0.4)'),
    red: styleColor('red', 'rgba(255,0,0,0.4)'),
    green: styleColor('green', 'rgba(0,128,0,0.4)'),
    blue: styleColor('blue', 'rgba(0,0,255,0.4)'),
    aqua: styleColor('aqua', 'rgba(0,255,255,0.4)'),
    fuchsia: styleColor('fuchsia', 'rgba(255,0,255,0.4)'),
    navy: styleColor('navy', 'rgba(0,0,128,0.4)'),
    olive: styleColor('olive', 'rgba(128,128,0,0.4)')
};

//setup source couche qui va etre utilisé pour toute les aire parcellaires
var sourceL = new ol.source.VectorTile({
    tilePixelRatio: 1,
    format: new ol.format.MVT(),
    tileGrid: ol.tilegrid.createXYZ({
        extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
        resolutions: resolutions,
        origin: ol.extent.getTopLeft(projectionExtent),

    }),
    // url: 'http://127.0.0.1:8080/geoserver/gwc/service/tms/1.0.0/test:aire_p@EPSG:2154@pbf/{z}/{x}/{-y}.pbf',
    url: 'http://www.sig-inao.fr:8080/geoserver/gwc/service/tms/1.0.0/inao:aire_parcellaire@EPSG:2154@pbf/{z}/{x}/{-y}.pbf',
    crossOrigin: 'anonymous',
});

/**
 * Déclaration de la carte ici, ol::Map
 */
var map = new ol.Map({
    target: 'map',
    renderer: 'canvas' //canvas,WebGL,DOM
});
/**
 * Déclaration de la couche principale LayerMvt. ol.layer.VectorTile
 */
var layerMVT = new ol.layer.VectorTile({
    name: "principale",
    style: InitStyle,
    opacity: 0.8,
    source: sourceL,
});


/**
 *  Fonction initialisant les styles de la carte, qui charge également le tableau de feature
 * @param {ol.Feature} feature 
 * @param {ol.resolution} resolution 
 */
function InitStyle(feature, resolution) {
    /**
     * Affectation des styles en fonction de la valeur du feature crinao (attribut)
     */
    switch (feature.get("crinao")) {
        case "Provence Corse": { return styles.yellow; break; }
        case "Bourgogne, Beaujolais, Savoie, Jura": { return styles.red; break; }
        case "Val de Loire": { return styles.green; break; }
        case "Sud-Ouest": { return styles.bluebreak; }
        case "Languedoc-Roussillon": { return styles.aqua; break; }
        case "Alsace et Est": { return styles.fuchsia; break; }
        case "Vallée du Rhône": { return styles.navy; break; }
        case "Aquitaine": { return styles.olive; break }
        default: { return 'polygon'; break; }
    }
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
    try {
        map.addLayer(new ol.layer.VectorTile({
            opacity: 0.8,
            source: sourceL,
            name: element.valeur, // nom dela couche
            style: (feature => {
                if (feature.get(element.type) === element.valeur) {
                    return styles.red;
                } else {
                    return new ol.style.Style({});
                }
            }),
        }));
        createLayerRow(element);
        successMessage("ajout termnié avec succès", "ajout de la couche " + element.valeur);
        fitToextent(element.valeur);
        sidebarClicked(clicked);
    } catch (e) {
        swal({
            title: "ERREUR lors du chargement de la couche : " + element.valeur + " " + e,
            text: "Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
            type: "warning",
            showConfirmButton: true,
        });
    }
}

function deleteSessLayer(id) {
    $.ajax({
        type: 'delete',
        url: "/session/couches/" +id,  
    });
}

/**
 * Retourne la couche vectorielle en fonction de son nom
 * @param {String} name 
 */
function getVectorLayer(name){
    let couche;
    map.getLayers().forEach(layer=>{
        if(layer instanceof ol.layer.VectorTile){
            if(layer.get('name') !=undefined && layer.get('name') === name){
                couche= layer;
            }
        }
    });
    return couche;
}

/**
 * Supprime une couche chargée
 * @param {String} nom Nom de la couche
 */
function removeLayer(nom,id) {
    layer = getVectorLayer(nom);
    if(layer != undefined){
        try{
            map.removeLayer(layer);
            deleteSessLayer(id);
            fetchSess(dat=>{
                let data = dat.filter;
                if(data.length >0){
                    fitToextent(data[data.length - 1].valeur); //zoom sur le dernier élément du tableau
                }
             
            });
            map.updateSize();
            successMessage("Couche retiré avec succès", "Suppression de la couche " + nom);
        }catch(e){
            alert("error "+e);
        }
    }
   
}


/**
 * Change la couche d'une couche
 * @param {String} layerName 
 * @param {String} couleur 
 * @param {String} code 
 */
function ChangeLayerColor(type,layerName,couleur,code){
    let layer = getVectorLayer(layerName);
    if(layer != undefined){
        let style = styleColor(couleur,code);
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
