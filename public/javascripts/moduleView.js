/**
 * @author Guiala Jean Roger
 * @module View toutes les fonctions d'interaction et de création de vue
 * Dans ce fichier nous mettrons toutes les intéractions avec notre vue, création de block etc...
 */

/**Fonction qui crée une div en fonction de la couche qui est chargée
 * @param {Object} data contient le type (denomination, appellation, parcelle, aire geographique) et la valeur (nom)
 */

function createGeoRow(data,situation){
    if(situation == "aireGeo"){
        let a = 
        '<span><strong>Aire géographique:</strong>'+
        ' <a  href="#" class=" btn btn-xs btn-white" onclick="switchLayerVisibility(\'' + data.id + '\',\'fageo\',\'geo\')">' +
                 ' <i id="fageo' + data.id + '" class="fa fa-1x fa-eye"></i>' +
            ' </a>' +
            ' <a href="#" id="cpgeo' + data.id + '" class="painter btn btn-xs btn-warning">' +
                ' <i class="fa fa-1x fa-paint-brush"></i>' +
            ' </a>' +
            ' <a href="#" type="button" class=" btn btn-xs btn-info" data-toggle="modal" data-target="#myModal6" >' +
                ' <i class="fa fa-1x fa-info-circle"></i>' +
            ' </a>' +
            '</span><br><br>'
    ;
    return a;
    }
    else{return '<span><strong>Aire géographique: </strong><span class="badge badge-danger"> Inexistante</span><br><br>';}
}

function createAppelRow(data){
    let message =  ' <strong>Type :</strong> ' + data.type + '<br>' +
    '<strong>Nom de la couche:</strong> ' + data.valeur +
   '<div class="agile-detail">' +
       ' <a  href="#" class=" btn btn-xs btn-white" onclick="switchLayerVisibility(\'' + data.id + '\',\'fa\',\'\')">' +
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
        ' </a>' +
   '</div>' ;
  
   return message;
}

function createRow(data,situation) {
    $("#couches").prepend(
        '<li class="success-element" id="c' + data.id + '">' +
            createGeoRow(data,situation)+
             createAppelRow(data)+   
                
        ' </li>'
    );
    fetchAireGeo(data.valeur,aire_geo=>{
        $('body').append(modalInfo(aire_geo));
    });
   
    $('body').css('overflow','hidden'); //solution temporaire
    $('#cp' + data.id + '').colorpicker().on('changeColor', function (e) {
        ChangeLayerColor(data.type, data.valeur, e.color.toString('rgba'));
        $('#cp' + data.id).css({ 'background-color': e.color.toString('hex') });
    });
    if(situation =="aireGeo"){
        let name = "geo"+data.valeur;
      
        $('#cpgeo' + data.id + '').colorpicker().on('changeColor', function (e) {
            changeAireColor(name, e.color.toString('hex'));
            $('#cpgeo' + data.id).css({ 'background-color': e.color.toString('hex') });
        });
    }
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
function switchLayerVisibility(id,fa,precede) {
   
   
    fetchSess(data => {
        let sess = data.filter;
        sess.forEach(element => {
            if (element.id == id) {
                let name =precede+''+element.valeur;
              
                let vectLayer = getLayer(name);
                if (vectLayer.getVisible() == true) {
                    vectLayer.setVisible(false);
                    $("#"+fa+''+ id).removeClass('fa-eye').addClass('fa-eye-slash');

                } else {
                    vectLayer.setVisible(true);
                    $("#"+fa+'' + id).removeClass('fa-eye-slash').addClass('fa-eye');
                }
            }
        });
    });
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
        let cou = getLayer(ta[k].nom);
        cou.setZIndex(ta[k].position);
        map.updateSize();
    }
}

/**
 * Fonction qui au clique affiche un modal contenant les infos sur l'aire
 */
function modalInfo(aire_geo){
   
let modal= 
'<div class="modal inmodal fade" id="myModal6" tabindex="-1" role="dialog"  aria-hidden="true">'+
'<div class="modal-dialog modal-sm">'+
   ' <div class="modal-content">'+
       ' <div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
            '<h4 class="modal-title">Aire Géographique</h4>'+
       ' </div>'+
        '<div class="modal-body">'+
            '<ul>'+
                '<li><strong>Nom: </strong> '+aire_geo.aire_geo.denomination+' </li>'+
                '<li><a href="'+aire_geo.aire_geo.url_fiche+'" target="_blank">fiche <i class="fa fa-1x fa-link"></i></a> </li>'+
                '<li><a href="'+aire_geo.aire_geo.url_cdc+'" target="_blank"> cahier des charges<i class="fa fa-1x fa-link"></i></a></li>'+
            '</ul>'+
        '</div>'+
        '<div class="modal-footer">'+
            
            '<button type="button" class="btn btn-primary">Fermer</button>'+
        '</div>'+
   ' </div>'+
'</div>'+
'</div>';

    return modal;                

}


/**Pour la recherche avancée */
function ParcelleForm(){
    const parcelle = 
    '<form name="parcelleForm" id="parcelle" >'+
        '<div class="form-group">'+
            '<label class="col-lg-2 control-label">Commune:</label>'+
            '<div class="col-lg-10">'+
                '<input class="form-control" placeholder="commune" type="text">'+
            '</div>'+
        '</div>'+
    '</form>';

    return parcelle;
}

function formLoader(type){
    $("#researcher").empty();
    $("#researcher").append(ParcelleForm());
    if(type == "parcelleForm"){
      
    }
   
}