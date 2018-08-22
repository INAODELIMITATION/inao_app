/**
 * @author Guiala Jean Roger
 * @module View toutes les fonctions d'interaction et de création de vue
 * Dans ce fichier nous mettrons toutes les intéractions avec notre vue, création de block etc...
 */

/**Fonction qui crée une div en fonction de la couche qui est chargée
 * @param {Object} data contient le type (denomination, appellation, parcelle, aire geographique) et la valeur (nom)
 */
function createLayerRow(data) {
    $("#couches").prepend(
        '<li class="success-element" id="c' + data.id + '">' +
        ' <strong>Type :</strong> ' + data.type + '<br>' +
        '<strong>Nom de la couche:</strong> ' + data.valeur +
        '<div class="agile-detail">' +
        ' <a  href="#" class=" btn btn-xs btn-white" onclick="switchLayerVisibility(\'' + data.id + '\')">' +
        ' <i id="fa' + data.id + '" class="fa fa-1x fa-eye"></i>' +
        ' </a>' +
        ' <a href="#" id="cp' + data.id + '" class="painter btn btn-xs btn-danger">' +
        ' <i class="fa fa-1x fa-paint-brush"></i>' +
        ' </a>' +
        ' <a href="#"  class=" btn btn-xs btn-primary" onclick="extentCouche(\'' + data.id + '\')">' +
        ' <i class="fa fa-1x fa-map-marker"></i>' +
        ' </a>' +
        ' <a href="#" class="pull-right btn btn-xs btn-danger" onclick="deleteLayerRow(\'' + data.id + '\')">' +
        ' <i class="fa fa-1x fa-trash"></i>' +
        '  </a>' +
        '</div>' +
        ' </li>'
    );
    $('body').css('overflow','hidden'); //solution temporaire
    $('#cp' + data.id + '').colorpicker().on('changeColor', function (e) {
        ChangeLayerColor(data.type, data.valeur, e.color.toString('hex'), e.color.toString('rgba'));
        $('#cp' + data.id).css({ 'background-color': e.color.toString('hex') });
    });
}

/**
 * supprime une couche ajouté
 * @param {number} id 
 * @param {String} valeur 
 */
function deleteLayerRow(id) {
    fetchSess(data => {
        let sess = data.filter;
        sess.forEach(element => {
            if (element.id == id) {
                removeLayer(element.valeur, element.id);
                $("#c" + id).remove();
            }
        });
    });

}

/**
 * Zoom sur l'emprise de la couche
 * @param {number} id 
 */
function extentCouche(id){
    fetchSess(data => {
        let sess = data.filter;
        sess.forEach(element => {
            if (element.id == id) {
                fitToextent(element.valeur)
            }
        });
    });
}


function clickSidebar() {
    $('#sidebarmenu').click();

}

/**
 * Change la visibilité d'une couche
 * @param {number} id 
 */
function switchLayerVisibility(id) {
    fetchSess(data => {
        let sess = data.filter;
        sess.forEach(element => {
            if (element.id == id) {
                let vectLayer = getVectorLayer(element.valeur);
                if (vectLayer.getVisible() == true) {
                    vectLayer.setVisible(false);
                    $("#fa" + id).removeClass('fa-eye').addClass('fa-eye-slash');

                } else {
                    vectLayer.setVisible(true);
                    $("#fa" + id).removeClass('fa-eye-slash').addClass('fa-eye');
                }
            }
        });
    });
}

/**
 * Quand les couches sont déja chargées en session fonction qui va parcourir le tableau à la réactualisation de la page
 * @param {Array} data 
 */
function parcoursTabCouche(data) {

}

/**
 * Fonction qui permet de déclarer la liste des couches et les rendres triable (modification ordre)
 */
function list() {
    $("#couches").sortable({
        connectWith: ".connectList",
        update: function (event, ui) {
            let couches = $("#couches").sortable("toArray");
            tabid = makeID(couches);
            fetchSess(dat => {
                let t = findPostion(tabid, dat.filter);
                positionLayers(t);
                //debut partie session
                let filter = dat.filter;
                let tab = new Array(filter.length);
                filter.forEach(element=>{
                    for(let k=0;k<t.length;k++){
                        if(element.id == t[k].id){
                            tab[t[k].position] = element;
                        }
                    }
                });
                //updateSess(tab); TRAVAILLER A CE NIVEAU POUR LA BD
            });

        }
    }).disableSelection();
}




function makeID(tableauID) {
    let tab = [];
    tableauID.forEach(element => {
        tab.push(parseInt(element.substr(1)));
    });
    return tab.reverse(); //renverse l'ordre le premier devient le dernier 
}

function findPostion(tabid, sess) {
    let tableauuuu = [];
    sess.forEach(lay => {
        for (let k = 0; k < tabid.length; k++) {
            if (tabid[k] == parseInt(lay.id)) {
                tableauuuu.push({
                    "nom": lay.valeur,
                    "position": k,
                    "id":lay.id
                });
            }
        }
    });
    return tableauuuu;
}
function positionLayers(ta) {
    for (let k = 0; k < ta.length; k++) {
        let cou = getVectorLayer(ta[k].nom);
        cou.setZIndex(ta[k].position);
        map.updateSize();
    }
}
