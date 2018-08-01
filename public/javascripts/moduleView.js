/**
 * @author Guiala Jean Roger
 * @module View toutes les fonctions d'interaction et de création de vue
 * Dans ce fichier nous mettrons toutes les intéractions avec notre vue, création de block etc...
 */
/**Fonction qui crée une div en fonction de la couche qui est chargée
 * @param {Array} data la couche a afficher: ces données
 */
function createLayerRow() {
    //console.log(data);
    $("#sortable-view").append(
        ' <div class="ibox "><div class="ibox-title"><h5>Drag&amp;Drop</h5><div class="ibox-tools"><label class="label label-primary">You can drag and drop me to other box.</label>' +
        '<a class="collapse-link"><i class="fa fa-chevron-up"></i></a>'+
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-wrench"></i></a>'+
        '<ul class="dropdown-menu dropdown-user"><li><a href="#">Config option 1</a></li><li><a href="#">Config option 2</a></li> </ul>'+
        '<a class="close-link"><i class="fa fa-times"></i></a>'+
      '</div></div>' +
        '<div class="ibox-content"><h2>This is simple box container nr. 1 </h2><p>' +
        
        '</p>' +
        ' </div>' +
        '</div>'
    );
}

function clickSidebar() {
    $('#sidebarmenu').click();

}
function parcoursTabCouche() {

}

function list(){
    $("#todo, #inprogress, #completed").sortable({
        connectWith: ".connectList",
        update: function( event, ui ) {

            var todo = $( "#todo" ).sortable( "toArray" );
            var inprogress = $( "#inprogress" ).sortable( "toArray" );
            var completed = $( "#completed" ).sortable( "toArray" );
            $('.output').html("ToDo: " + window.JSON.stringify(todo) + "<br/>" + "In Progress: " + window.JSON.stringify(inprogress) + "<br/>" + "Completed: " + window.JSON.stringify(completed));
        }
    }).disableSelection();
}
