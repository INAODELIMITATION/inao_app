/**
 * @file View toutes les fonctions d'interaction et de création de vue
 * @author Guiala Jean Roger
 * @version 1.0.0
 * @description Dans ce fichier nous mettrons toutes les intéractions avec notre vue, création de block etc...
 */


function showMapButtons(){
    $("#popup").appendTo(
        $('.ol-overlaycontainer')
    );
    $("#mesureur").appendTo(
        $('.ol-control')
    );
    $("#supprimeur").appendTo(
        $('.ol-control')
    );
    $("#mesureur").show();
    $("#supprimeur").show();
}

function hidePopup(){
    $("#AutreRecherche").on('click', () => {
        $("#popup").toggle();
    });

    $("#hideAutreRecherche").on('click', () => {
        $("#popup").css("display", "none");
    });
}
/**
 * @function createAppelationRow
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description crée une ligne pour les parametre d'une appellation chargée
 * @param {*} data 
 */
function createAppelationRow(data) {
    $("#couches").prepend(
        '<li class="success-element" id="couche' + data.id_aire + '">' +
        '<h3 class="text-center">' + data.lbl_aire +
        ' <a id="lien'+data.id_aire+'" href="#" type="button" class=" btn btn-outline btn-xs btn-circle   btn-info"  >' +
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
    $("#lien"+data.id_aire).on('click',()=>{
        getlien(data.id_aire, lien=>{
            console.log("a jour");
            let win = window.open(""+lien.lien_reglement+"");
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Autorisez les popup our ce site');
            }
        });
    });
}

/**
 * @function rowInexistant
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Notifie que le type d'aire recherché n'existe pas
 * @param {String} typeAire //aire geographique ou parcellaire
 */
function rowInexistant(typeAire) {
    return "<span><strong>" + typeAire + ":&nbsp; </strong><span class='badge badge-danger'> Absente</span><br><br>";
}

/**
 * @function airegeoRow
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description crée une ligne pour les parametres de la couche aire geographique
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
        // ' <a href="#"  class=" btn btn-xs btn-primary" id="geoExtend'+id_aire+'">' +
        // ' <i class="fa fa-1x fa-map-marker"></i>' +
        // ' </a>' +
        '</span><br><br>';

   
    return a;
}

/**
 * @function airePaRow
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description crée une ligne pour les parametres de la couche aire parcellaires
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
 * @function aireParcParams
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Initialise les parametres de la couche aire parcellaire
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
        tileLayerColorChanger(data.id_aire, name, e.color.toString('rgba'));
        $('#cp' + data.id_aire).css({ 'background-color': e.color.toString('hex') });
    });
}

/**
 * @function airegeoParams
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Initialise les parametres de la couche aire géographique
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
 * @function layerVisibilitySwitcher
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Modifie la visibilité d'une couche
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
 * @function ignLayerswitcher
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description affiche ou masque une couche ign
 * @param {String} name 
 */
function ignLayerswitcher(name) {

    let little = name.substring(0, 4);
    try {
        let vectLayer = getLayer(name);

        if (vectLayer.getVisible() == true) {
            vectLayer.setVisible(false);
            $("#slider" + little).prop('disabled', true);

        } else {
            vectLayer.setVisible(true);
            $("#slider" + little).prop('disabled', false);

        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * @function deleteAppelationRow
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description supprime une appellation chargée (aire geo et aire parcellaire )
 * @param {number} id_aire 
 */
function deleteAppelationRow(id_aire) {
    deleteAire(id_aire, "geo");
    deleteAire(id_aire, "par");
    $("#couche" + id_aire).remove();
    storagedeleterAppel(id_aire);

}



function clickSidebar() {
    $('#sidebarmenu').click();


}





/**
 * @function list
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Fonction qui permet de déclarer la liste des couches et les rendres triable (modification ordre)
 */
function list() {
    $("#couches").sortable({
        connectWith: ".connectList",
        update: function (event, ui) {
            let couches = $("#couches").sortable("toArray");
            tabid = makeID(couches);
            changePositions(tabid);
        }
    }).disableSelection();
}



/**
 *@function modalInfo
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Fonction qui au clique affiche un modal contenant les infos sur l'aire
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


/**
 * @function advanceForm
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Pour la recherche avancée
 * 
*/
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
        '</div>' +
        '</form>';

    return formulaire;
}



/**
 * @function formLoader
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Affiche le formulaire en fonction de l'élément choisi
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
 * @function Resarch
 *  @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 *@description Effectue la recherche soit pour les communes, soit pour les parcelles
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
 * @function resetCommuneForm
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 *@description  Efface tous les champs pour recommencer la recherche
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
 * @function resetParcelleForm
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description efface tous les champs pour recommencer la recherche sur les parcelles
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
 * @function setSection
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Initialize la section
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
 * @function resetParcelleForm
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description reinitialise les champs resultats
 */
function resetParcelleSearch() {
    $("#resultatable").empty();
    $("#resultatable").show();
    $("#resultat").show();
    $("#alertCommune").show();
}

/**
 * @function errorParcelleSearch
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description Affiche ou non le message d'erreur pour qu'un champ soit rempli
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

/**
 * @function appendParcelle
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description ajoute la parcelle menu couche
 * @param {Object} parcelle 
 */
function appendParcelle(parcelle) {
    $("#resultatable").append(
        '<tr class="resultPar">' +
        '<td><a href="#" onclick="loadParcelle(' + parcelle.id + ')">' + parcelle.idu + '</a></td>' +
        '<td> [' + parcelle.insee + '] ' + parcelle.commune + '</td>' +
        '</tr>'
    );
}

/**
 * @function searchParcelle
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description gère la recherche sur les parcelles
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
    let name = str + '' + element.id;
    $("#couches").append(
        '<li class="warning-element" id="autrecouche' + element.id + '">' +
        '<h3 class="text-center"> ' + element.valeur.replace(/^\w/, c => c.toUpperCase()) + '<small class="badge badge-warning"> ' + type + '</small>' +
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
function removerOther(name, id) {
    layerRemover(name);
    storagedeleterOther(id);
    $("#autrecouche" + id).remove();
}


function enableswitcherIgn(little, name) {
    $("#" + little + "").on('click', () => {
        ignLayerswitcher(name);
    });
}

function enableOpacityChangeIgn(little, name) {
    $("#slider" + little).on("input change", () => {
        let opacity = parseFloat($("#slider" + little).val());
        $("#value" + little).text(opacity * 100 + "%");
        changeOpacity(name, opacity);
    });

}

function appendIgn(libelle, little, inp, name,visibility) {
    $("#coucheIGN").append(
        ' <div class=" setings-item">' +
        ' <span>' +
        libelle +
        ' </span>' +
        ' <div class="switch">' +
        ' <div class="onoffswitch">' +
        inp +
        ' <label class="onoffswitch-label" for="' + little + '">' +
        '     <span class="onoffswitch-inner"></span>' +
        '   <span class="onoffswitch-switch"></span>' +
        '    </label>' +
        '    </div>' +
        ' </div><br><br>' +
        '<div class="row form-group">' +
        '<div class="col-sm-6">' +
        '<input class="form-control"  id="slider' + little + '" type="range" min="0" max="1" step="0.1" value="0.7"  >' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<span id="value' + little + '"  class="form-control"  >70%</span>' +
        '</div>' +
        '</div>' +
        '   </div>'
    );
    if (visibility == false) {
        $("#slider" + little).prop('disabled', true);
    }
    enableswitcherIgn(little, name);
    enableOpacityChangeIgn(little, name);
}


