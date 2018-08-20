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
        ' <a  href="#" class=" btn btn-xs btn-white">' +
        ' <i class="fa fa-1x fa-eye"></i>' +
        ' </a>' +
        ' <a href="#" id="cp'+data.id+'" class="painter btn btn-xs btn-danger">' +
        ' <i class="fa fa-1x fa-paint-brush"></i>' +
        ' </a>' +
        ' <a href="#" class="pull-right btn btn-xs btn-danger" onclick="deleteLayerRow(\'' + data.id + '\',\'' + data.valeur + '\')">' +
        ' <i class="fa fa-1x fa-trash"></i>' +
        '  </a>' +
        '</div>' +
        ' </li>'
    );
    $('#cp'+data.id+'').colorpicker().on('changeColor', function(e) { 
        ChangeLayerColor(data.type,data.valeur,e.color.toString('hex'),e.color.toString('rgba'));
        $('#cp'+data.id).css({'background-color': e.color.toString('hex')});
    });
}

/**
 * supprime une couche ajouté
 * @param {number} id 
 * @param {String} valeur 
 */
function deleteLayerRow(id, valeur) {
    removeLayer(valeur,id);
    $("#c" + id).remove();
   
}

function clickSidebar() {
    $('#sidebarmenu').click();

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
            $('.output').html("couches: " + window.JSON.stringify(couches));
            var tabcouches = window.JSON.stringify(couches);
            tabcouches = JSON.parse(tabcouches);
            console.log(tabcouches);
            tabid = makeID(tabcouches);
            console.log(tabid);
            
           fetchSess(dat=>{
                let t =findPostion(tabid,dat.filter);
                console.log(t);
                positionLayers(t);
                let filter = dat.filter;
                //fitToextent(filter[filter.length - 1].valeur);
            });
           
        }
    }).disableSelection();
}

function makeID(tableauID){
    let tab = [];
    tableauID.forEach(element => {
        tab.push(parseInt(element.substr(1)));
    });
    return tab ;
}

function findPostion(tabid,sess){
    let tableauuuu = [];
  sess.forEach(lay=>{
    for(let k=0; k<tabid.length; k++){
        if(tabid[k] == parseInt(lay.id)){
            tableauuuu.push({
                "nom":lay.valeur,
                "position":k
            });
        }
    }
  });
  return tableauuuu;
}
function positionLayers(ta){
   
    ta = ta.reverse();
    for(let k =0; k<ta.length; k++){
       let cou = getVectorLayer(ta[k].nom);
       cou.setZIndex(ta[k].position);
       map.updateSize();
    }
}

