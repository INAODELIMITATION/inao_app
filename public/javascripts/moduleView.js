/**
 * @author Guiala Jean Roger
 * @module View toutes les fonctions d'interaction et de création de vue
 * Dans ce fichier nous mettrons toutes les intéractions avec notre vue, création de block etc...
 */

/**Fonction qui crée une div en fonction de la couche qui est chargée
 * @param {Array} data contient le type (denomination, appellation, parcelle, aire geographique) et la valeur (nom)
 */
function createLayerRow(data) {
    //console.log(data);
    $("#couches").append(
        '<li class="success-element" id="task1">'+
            ' <strong>Type :</strong> '+data.type+'<br>'+
             '<strong>Nom de la couche:</strong> '+data.valeur+
            '<div class="agile-detail">'+
                ' <a href="#" class=" btn btn-xs btn-white">'+
                    ' <i class="fa fa-1x fa-eye"></i>'+
                ' </a>'+
                ' <a href="#" class="pull-right btn btn-xs btn-danger">'+
                    ' <i class="fa fa-1x fa-trash"></i>'+
                '  </a>'+
            '</div>'+
    ' </li>'
    );
}

function clickSidebar() {
    $('#sidebarmenu').click();

}

function parcoursTabCouche() {

}

function list(){
    $("#couches").sortable({
        connectWith: ".connectList",
        update: function( event, ui ) {
            var couches = $( "#couches" ).sortable( "toArray" );
            $('.output').html("couches: " + window.JSON.stringify(couches));
        }
    }).disableSelection();
}
