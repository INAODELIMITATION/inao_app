/**
 * @file fichier de lancement de l'application événement)
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @version 1.0.0
 */



var clicked = 0;

window.addEventListener('beforeunload', (event) => {
    event.returnValue = `Are you sure you want to leave?`;
});

$(document).ready(() => {

    /**config geoportail */
    GeoportailConfig();

    /**affiche les boutons pour dessiner et supprimer */
    showMapButtons();
    /**fonction pour fermer la liste des appellations */
    closeList();


    $("#mesureur").on('click', mesureurOnclick);

    $("#supprimeur").on('click', supprimeurOnclick);

    /**affiche et masque le popup (commune parcelle ) recherche avancée */
    hidePopup();
    //comment

    /**gestion liste des couches modifiable jquery */
    list();
    let libelle = [];
    /**formulaire recherche appellation */
    $('#search,#searchM').typeahead({
        minLength: 3,
        items: 18,
        source: function (query, result) {
            ajaxSearch(query, data => {
                result($.map(data, function (item) {
                    libelle[item.lbl_aire.trim()] = item.id_aire;
                    return item.lbl_aire.trim();
                }));
            });
        },
        matcher:  ()=> { return true; },

        updater:  (item)=> {
            let data = makeappelData(item,libelle);
            addRequest(data.id_aire);
            createAndSaveAppellation(data);
            libelle = [];
        }
    });


    enableDisableInteract();


    $("#searchChooser").change(function () {
        let option = $(this).val();
        formLoader(option);
        /**formulaire recherche commune */
        $('#communeS').typeahead({
            minLength: 3,
            items: 15,
            source:  (query, result)=> {
                ajaxCommune(query,data=>{
                    result($.map(data, function (item) {
                        return '' + item.code_insee + '-' + (item.commune).trim();
                    }));
                });
            },
            updater: function (item) {
                Resarch(option, item);
            }
        });
    });
});



function enableDisableInteract() {

    var dragPan, zoomInteraction, mousezoom;


    map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof ol.interaction.DragPan) {
            dragPan = interaction;
        }
        if (interaction instanceof ol.interaction.DoubleClickZoom) {
            zoomInteraction = interaction;
        }
        if (interaction instanceof ol.interaction.MouseWheelZoom) {
            mousezoom = interaction;
        }


    }, this);

    $("#popup,#mesureur").on('mouseover', function () {

        if (dragPan) {
            map.removeInteraction(dragPan);

        }
        if (zoomInteraction) {
            map.removeInteraction(zoomInteraction);
        }
        if (mousezoom) {
            map.removeInteraction(mousezoom);
        }
        map.un("singleclick", mapOnClick);





    });
    // Re-enable dragging when user's cursor leaves the element
    $("#popup,#mesureur").on('mouseout', function () {
        map.addInteraction(dragPan);
        map.addInteraction(zoomInteraction);
        map.addInteraction(mousezoom);

        map.on("singleclick", mapOnClick);

    });


}