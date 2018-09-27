// "use strict";
//WinMove();
var clicked = 0;
window.addEventListener('beforeunload', (event) => {
    event.returnValue = `Are you sure you want to leave?`;
});

// $("#cadastreIGN").on('click',()=>{
//     ignLayerswitcher("CADASTRALPARCELS.PARCELS");
// });
// $("#ADMINEXPRESS_COG_CARTO_2017").on('click',()=>{
//     ignLayerswitcher("ADMINEXPRESS_COG_CARTO_2017");
// });

$(document).ready(function () {
   
    Gp.Services.getConfig({
        //serverUrl: "/javascripts/autoconf/local.json", //local
        serverUrl: "/GPautoconf/autoconf.json", //server
        callbackSuffix: "",
        onSuccess: initialisation,
        onFailure: fail,
    });

    $("#AutreRecherche").on('click', () => {
        $("#popup").toggle();
    });
    $("#hideAutreRecherche").on('click', () => {
        $("#popup").css("display", "none");
    });

    list();
    let libelle = [];
    $('#search,#searchM').typeahead({
        minLength: 3,
        items: 18,
        source: function (query, result) {

            $.ajax({
                url: "/search",
                data: 'libelle=' + query,
                dataType: "json",
                type: "POST",
                success: function (data) {

                    result($.map(data, function (item) {
                        libelle[item.lbl_aire.trim()] = item.id_aire;
                        
                        return item.lbl_aire.trim();
                    }));
                }
            });
        },

        updater: function (item) {
           
            let data = {
                id_aire: libelle[item],
                lbl_aire: item,
                type: "appellation"
            };
           
            try {
                LayerCreator(data);
                storageAdder(data);
            } catch (error) {
                console.log(error);
            }

            libelle = [];
        }
    });


    var dragPan, zoomInteraction;
    map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof ol.interaction.DragPan) {
            dragPan = interaction;
        }
    }, this);
    map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof ol.interaction.DoubleClickZoom) {
            zoomInteraction = interaction;
        }
    }, this);
    $("#popup").appendTo(
        $('.ol-overlaycontainer')
    );
    $("#popup").on('mouseover', function () {

        if (dragPan) {
            map.removeInteraction(dragPan);

        }
        if (zoomInteraction) {
            map.removeInteraction(zoomInteraction);
        }

    });

    // Re-enable dragging when user's cursor leaves the element
    $("#popup").on('mouseout', function () {
        map.addInteraction(dragPan);
        map.addInteraction(zoomInteraction);
    });


    /*icic*/
    $("#searchChooser").change(function () {
        let option = $(this).val();
        formLoader(option);
        $('#communeS').typeahead({
            minLength: 3,
            items: 15,
            source: function (query, result) {
                $.ajax({
                    url: "/communes/",
                    data: 'commune=' + query,
                    dataType: "json",
                    type: "POST",
                    success: function (data) {
                        result($.map(data, function (item) {

                            return '' + item.code_insee + '-' + (item.commune).trim();
                        }));
                    }
                });
            },

            updater: function (item) {

                Resarch(option, item);
            }

        });
    });
});

