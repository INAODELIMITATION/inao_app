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

function nestableList(){
    var updateOutput = function (e) {
    var list = e.length ? e : $(e.target),
            output = list.data('output');
    if (window.JSON) {
        output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
    } else {
        output.val('JSON browser support required for this demo.');
    }
};
// activate Nestable for list 2
$('#nestable2').nestable({
    group: 1
}).on('change', updateOutput);

// output initial serialised data
updateOutput($('#nestable2').data('output', $('#nestable2-output')));

$('#nestable-menu').on('click', function (e) {
    var target = $(e.target),
            action = target.data('action');
    if (action === 'expand-all') {
        $('.dd').nestable('expandAll');
    }
    if (action === 'collapse-all') {
        $('.dd').nestable('collapseAll');
    }
});
}
