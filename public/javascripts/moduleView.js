/**
 * @author Guiala Jean Roger
 * @module View toutes les fonctions d'interaction et de création de vue
 * Dans ce fichier nous mettrons toutes les intéractions avec notre vue, création de block etc...
 */


/**
 * crée une ligne pour les parametre d'une appellation chargée
 * @param {*} data 
 */
function createAppelationRow(data) {
    $("#couches").prepend(
        '<li class="success-element" id="couche' + data.id_aire + '">' +
        '<h3 class="text-center">' + data.lbl_aire +
        ' <a href="#" type="button" class=" btn btn-outline btn-xs btn-circle   btn-info" data-toggle="modal" data-target="#myModal6" >' +
        ' <i class="fa fa-1x fa-info"> </i>' +
        ' </a>' +
        '</h3>' +
        '<div id="options' + data.id_aire + '">' +
        '</div>' +
        '<div class="agile-detail">' +
        ' <a href="#" type="button" class=" btn btn-xs  btn-rounded btn-info" style="visibility: hidden;" >' +
        ' <i class="fa fa-1x fa-info-circle"></i>' +
        ' </a>' +
        ' <a href="#" class="pull-right btn btn-xs   btn-danger" onclick="deleteAppelationRow(\'' + data.id_aire + '\')">' +
        ' <i class="fa fa-1x fa-trash"></i>' +
        ' </a>' +
        '</div>' +
        ' </li>'
    );
}

/**
 * Notifie que le type d'aire recherché n'existe pas
 * @param {String} typeAire //aire geographique ou parcellaire
 */
function rowInexistant(typeAire) {
    return "<span><strong>" + typeAire + ":&nbsp; </strong><span class='badge badge-danger'> Inexistante</span><br><br>";
}

/**
 * crée une ligne pour les parametres de la couche aire geographique
 * @param {number} id_aire 
 */
function airegeoRow(id_aire) {
    let a =
        '<span><strong>Aire géographique:&nbsp;</strong>' +
        ' <a  href="#" class=" btn btn-xs btn-white" onclick="layerVisibilitySwitcher(\'' + id_aire + '\',\'fageo\',\'geo\')">' +
        ' <i id="fageo' + id_aire + '" class="fa fa-1x fa-eye"></i>' +
        ' </a>' +
        ' <a href="#" id="cpgeo' + id_aire + '" class="painter btn btn-xs btn-success" >' +
        ' <i class="fa fa-1x fa-paint-brush"></i>' +
        ' </a>' +

        '</span><br><br>';
    return a;
}

/**
 * crée une ligne pour les parametres de la couche aire parcellaires
 * @param {number} id_aire 
 */
function airePaRow(id_aire) {
    let message =
        '<span><strong>Aire parcellaire:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>' +
        ' <a  href="#" class=" btn btn-xs btn-white" onclick="layerVisibilitySwitcher(\'' + id_aire + '\',\'fa\',\'airePar\')">' +
        ' <i id="fa' + id_aire + '" class="fa fa-1x fa-eye"></i>' +
        ' </a>' +
        ' <a href="#" id="cp' + id_aire + '" class="painter btn btn-xs btn-success ">' +
        ' <i class="fa fa-1x fa-paint-brush"></i>' +
        ' </a>' +
        ' <a href="#"  class=" btn btn-xs btn-primary" onclick="getextent(\'' + id_aire + '\')">' +
        ' <i class="fa fa-1x fa-map-marker"></i>' +
        ' </a>' +
        '</span>';

    return message;
}

/**
 * Initialise les parametres de la couche aire parcellaire
 * @param {Object} data la zone cherchée
 * @param {Object} color la couleur (rgba, hex)
 */
function aireParcParams(data, color) {
    let name = "airePar" + data.id_aire;
    $("#options" + data.id_aire).append(
        '' + airePaRow(data.id_aire)
    );
    $('#cp' + data.id_aire).css({ 'background-color': color.hex1 });
    $('body').css('overflow', 'hidden'); //solution temporaire
    $('#cp' + data.id_aire + '').colorpicker().on('changeColor', function (e) {
        tileLayerColorChanger(data.lbl_aire, name, e.color.toString('rgba'));
        $('#cp' + data.id_aire).css({ 'background-color': e.color.toString('hex') });
    });
}

/**
 *  Initialise les parametres de la couche aire géographique
 * @param {number} id_aire l'id de la zone
 * @param {string} color la couleur 
 */
function airegeoParams(id_aire, color) {
    $("#options" + id_aire).prepend(
        '' + airegeoRow(id_aire)
    );
    let name = "geo" + id_aire;
    $('#cpgeo' + id_aire).css({ 'background-color': color });
    $('#cpgeo' + id_aire + '').colorpicker().on('changeColor', function (e) {
        changeAireColor(name, e.color.toString('hex'));
        $('#cpgeo' + id_aire).css({ 'background-color': e.color.toString('hex') });
    });
}

/**
 * Modifie la visibilité d'une couche
 * @param {number} id 
 * @param {string} fa 
 * @param {string} precede 
 */
function layerVisibilitySwitcher(id, fa, precede) {
    let name = precede + '' + id;
    try {
        let vectLayer = getLayer(name);
        if (vectLayer.getVisible() == true) {
            vectLayer.setVisible(false);
            $("#" + fa + '' + id).removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            vectLayer.setVisible(true);
            $("#" + fa + '' + id).removeClass('fa-eye-slash').addClass('fa-eye');
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * supprime une appellation chargée (aire geo et aire parcellaire )
 * @param {number} id_aire 
 */
function deleteAppelationRow(id_aire) {
    deleteAire(id_aire,"geo");
    deleteAire(id_aire,"par");
    $("#couche" + id_aire).remove();
    storagedeleterAppel(id_aire);
   
}


function deleteAire(id_aire,type){
    if(type == "geo"){
        getAire_geo(id_aire, aire_geo => {
            if (aire_geo != false) {
                let nom = "geo" + id_aire;
                layerRemover(nom);
            }
        });
    }
    if(type == "par"){
        getAireParcellaire(id_aire, aire => {
            if (aire != false) {
                let nom = "airePar" + id_aire;
                layerRemover(nom);
            }
        });
    }
}



function clickSidebar() {
    $('#sidebarmenu').click();


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
            console.log(tabid);
            let layersData = JSON.parse(window.localStorage.getItem("layers"));
            layersData.forEach(lay=>{

            });
            /*
            fetchSess(dat => {
                let t = findPostion(tabid, dat.filter);
                positionLayers(t);
                //debut partie session
                let filter = dat.filter;
                let tab = new Array(filter.length);
                filter.forEach(element => {
                    for (let k = 0; k < t.length; k++) {
                        if (element.id == t[k].id) {
                            tab[t[k].position] = element;
                        }
                    }
                });
                //updateSess(tab); TRAVAILLER A CE NIVEAU POUR LA BD
            });*/

        }
    }).disableSelection();
}




function makeID(tableauID) {
    let tab = [];
    tableauID.forEach(element => {
        tab.push(parseInt(element.substr(6)));
    });
    return tab.reverse(); //renverse l'ordre le premier devient le dernier 
}

function findPostion(tabid, sess) {
    let tableauuuu = [];
    // sess.forEach(lay => {
    //     for (let k = 0; k < tabid.length; k++) {
    //         if (tabid[k] == parseInt(lay.id)) {
    //             tableauuuu.push({
    //                 "nom": lay.valeur,
    //                 "position": k,
    //                 "id": lay.id
    //             });
    //         }
    //     }
    // });
    return tableauuuu;
}
function positionLayers(ta) {
    for (let k = 0; k < ta.length; k++) {
        let cou = getLayer(ta[k].nom);
        cou.setZIndex(ta[k].position);
        map.updateSize();
    }
}

/**
 * Fonction qui au clique affiche un modal contenant les infos sur l'aire
 */
function modalInfo(aire_geo) {

    let modal =
        '<div class="modal inmodal fade" id="myModal6" tabindex="-1" role="dialog"  aria-hidden="true">' +
        '<div class="modal-dialog modal-sm">' +
        ' <div class="modal-content">' +
        ' <div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<h4 class="modal-title">Aire Géographique</h4>' +
        ' </div>' +
        '<div class="modal-body">' +
        '<ul>' +
        '<li><strong>Nom: </strong> ' + aire_geo.aire_geo.denomination + ' </li>' +
        '<li><a href="' + aire_geo.aire_geo.url_fiche + '" target="_blank">fiche <i class="fa fa-1x fa-link"></i></a> </li>' +
        '<li><a href="' + aire_geo.aire_geo.url_cdc + '" target="_blank"> cahier des charges<i class="fa fa-1x fa-link"></i></a></li>' +
        '</ul>' +
        '</div>' +
        '<div class="modal-footer">' +

        '<button type="button" class="btn btn-primary">Fermer</button>' +
        '</div>' +
        ' </div>' +
        '</div>' +
        '</div>';

    return modal;

}


/**Pour la recherche avancée */
function advanceForm() {
    const formulaire =
        '<form onsubmit="return false;" class="form-horizontal" name="advanceForm" id="parcelle" >' +
        '<div class="form-group">' +
        ' <label class="col-sm-3">Commune:</label>' +
        '<div class="col-sm-9">' +
        '<input class="form-control typeahead" placeholder="commune" type="text" id="communeS" autocomplete="off">' +
        '</div>' +
        '</div>' +
        '<div class="form-group" >' +
        '<div class="col-sm-12 alert alert-success" style="display:none" id="alertCommune">' +
        '<h4>Commune :' +
        '<span  id="communecherche" ></span>' +
        '</h4>' +
        '</div>' +
        '<div class="row" style="display:none" id="paramParcelle">' +
        '<div class="col-sm-5" id="parcellerInput">' +
        '<input class="form-control rondeur " id="Parsection" placeholder="Section" type="text" >' +
        '</div>' +
        '<div class="col-sm-5">' +
        '<input class="form-control rondeur " id="numpar" placeholder="numParcelle" type="text" >' +
        '</div>' +
        '<div class="">' +
        '<input class="form-control rondeur " id="sectionID" placeholder="numParcelle" type="text" style="display:none;" >' +
        '</div>' +
        '<div class="col-sm-2">' +
        '<button class="btn-primary btn btn-sm btn-rounded " id="parcelleSearcher"placeholder="commune" type="text" >OK' +
        '</button>' +
        '</div>' +
        '<div class="col-sm-12 " id="erreurParcelle" style="display:none">' +
        '<br><h5 class="text-danger"  >[Erreur] Remplir au moins l\'un des champs!!!</h5>' +
        '</div>' +
        '</div>' +
        '</div>'+
    '</form>';

    return formulaire;
}



/**
 * Affiche le formulaire en fonction de l'élément choisi
 * @param {String} option 
 */
function formLoader(option) {
    $("#formloader").empty();
    $("#resultat").hide();
    if (option == "commune" || option == "parcelle") {
        $("#formloader").append(advanceForm() + '');
    }

}

/**
 *Effectue la recherche soit pour les communes, soit pour les parcelles
 * @param {String} option 
 * @param {JSON} item 
 */
function Resarch(option, item) {
    if (option == "commune") {

        resetCommuneForm();
        let pieces = item.split(/[\s-]+/);
        let number = String(pieces[0]);
        $("#alertCommune").show();
        $("#communecherche").append(item);
       
        loadCommune(number);
    }
    if (option == "parcelle") {
        resetParcelleForm();
        setSection(item);
        searchParcelle(item);
    }
}

/**
 * Efface tous les champs pour recommencer la recherche
 */
function resetCommuneForm() {
    $(".resultPar").empty();
    $(".resultPar").hide();
    $("#paramParcelle").hide();
    $("#alertCommune").hide();
    $("#communecherche").empty();
    $("#parcellerInput").hide();
    //suites
}

/**
 * efface tous les champs pour recommencer la recherche sur les parcelles
 */
function resetParcelleForm() {
    $("#paramParcelle").show();
    $("#communecherche").empty();
    $("#resultatable").empty();
    $("#resultatable").hide();
    $("#Parsection").val('');
    $("#numpar").val('');
    $("#resultat").hide();
}


/**
 * Initialize la section
 * @param {Object} item 
 */
function setSection(item) {
    let pieces = item.split(/[\s-]+/);
    let number = String(pieces[0]);
    $("#alertCommune").show();
    $("#communecherche").append(item);
    $("#sectionID").val(number);

}

/**
 * reinitialise les champs resultats
 */
function resetParcelleSearch() {
    $("#resultatable").empty();
    $("#resultatable").show();
    $("#resultat").show();
    $("#alertCommune").show();
}

/**
 * Affiche ou non le message d'erreur pour qu'un champ soit rempli
 */
function errorParcelleSearch(option) {
    if (option == "yes") {
        $("#paramParcelle").addClass('has-error');
        $("#erreurParcelle").show();
    } else {
        $("#erreurParcelle").hide();
        $("#paramParcelle").removeClass('has-error');
    }

}


function appendParcelle(parcelle) {
    $("#resultatable").append(
        '<tr class="resultPar">' +
        '<td><a href="#" onclick="loadParcelle(' + parcelle.id + ')">' + parcelle.idu + '</a></td>' +
        '<td> [' + parcelle.insee + '] ' + parcelle.commune + '</td>' +
        '</tr>'
    );
}

/**
 * gère la recherche sur les parcelles
 */
function searchParcelle() {
    $("#parcelleSearcher").on('click', () => {
        if (!$("#Parsection").val() && !$("#numpar").val()) {
            errorParcelleSearch("yes");
        }
        else {
            errorParcelleSearch("no");
            AjaxParcelle();
        }

    });

}

/**
 * 
 * @param {*} data 
 * @param {*} type 
 */
function SearchRow(data, type) {
    let element = returnElement(data, type);
    let str = type.substring(0, 3);
    let fa = 'fa' + str;
    let name = str+''+element.id;
    $("#couches").prepend(
        '<li class="warning-element" id="c' + element.id + '">' +
        '<h3 class="text-center"> ' + element.valeur.replace(/^\w/, c => c.toUpperCase()) +'<small class="badge badge-warning"> '+type+'</small>'+
        '</h3>' +
        '<div class="agile-detail">' +
        ' <a  href="#" class=" btn btn-xs btn-white" onclick="layerVisibilitySwitcher(\'' + element.id + '\',\'' + fa + '\',\'' + str + '\')">' +
        ' <i id="fa' + str + element.id + '" class="fa fa-1x fa-eye"></i>' +
        ' </a>' +
        ' <a href="#" id="cpo' + element.id + '" class="painter btn btn-xs btn-success" >' +
        ' <i class="fa fa-1x fa-paint-brush"></i>' +
        ' </a>' +
        ' <a href="#" class="pull-right btn btn-xs   btn-danger" onclick="removerOther(\'' + name + '\',\'' + element.id + '\')">' +
        ' <i class="fa fa-1x fa-trash"></i>' +
        ' </a>' +
        ' <a href="#"  class=" btn btn-xs btn-primary" onclick="zoomExtentVectorLayer(\'' + name + '\')">' +
        ' <i class="fa fa-1x fa-map-marker"></i>' +
        ' </a>' +
        '</div>' +
        ' </li>'
    );
    $('#cpo' + element.id + '').colorpicker().on('changeColor', function (e) {
        changeAireColor(name, e.color.toString('hex'));
        $('#cpo' + element.id).css({ 'background-color': e.color.toString('hex') });
    });

}

function returnElement(data, type) {
    if (type == "parcelle") {
        return {
            id: data.id,
            valeur: data.idu
        };
    }
    if (type == "commune") {
        return {
            id: data.code_insee,
            valeur: data.nom_com
        };
    }

}
function removerOther(name,id){
    layerRemover(name);
    storagedeleterOther(id);
    $("#c" + id).remove();
}

