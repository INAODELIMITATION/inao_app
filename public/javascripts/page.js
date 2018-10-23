/**
 * @file fichier de lancement de l'application événement)
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @version 1.0.0
 */



var clicked = 0;
var singleclicker;
window.addEventListener('beforeunload', (event) => {
    event.returnValue = `Are you sure you want to leave?`;
});

$(document).ready(function () {

    try {
        Gp.Services.getConfig({
            // serverUrl: "/javascripts/autoconf/local.json", //local
            serverUrl: "/GPautoconf/autoconf.json", //server
            callbackSuffix: "",
            onSuccess: initialisation,
            onFailure: fail,
        });
    } catch (error) {
        fail();
    }

    closeList();


    singleclicker = map.on('singleclick', function (evt) {
        
        addMarker(evt.coordinate);
    makeAppelList(map.getCoordinateFromPixel(evt.pixel));
    });
   
    
///ICICICICICIIC
var compteur = false;
$("#mesureur").on('click',()=>{
  console.log("clicked");
  console.log(draw);
    map.removeInteraction(draw);
    if(!compteur){
        map.removeInteraction(draw);
        addInteraction();
        
        $("#popup").css("display", "none");
       
    }
    else{
        map.removeInteraction(draw);
      
        
    }
    compteur = !compteur;
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
        matcher: function () { return true; },

        updater: function (item) {

            let data = {
                id_aire: libelle[item],
                lbl_aire: item,
                type: "appellation"
            };
            addRequest(data.id_aire);
            try {
                LayerCreator(data);
                storageAdder(data);
               
            } catch (error) {
                console.log(error);
            }

            libelle = [];
        }
    });
    $("#popup").appendTo(
        $('.ol-overlaycontainer')
    );

    $("#mesure").appendTo($('.ol-overlaycontainer'));
    enableDisableInteract();

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
       
        if(singleclicker){
            ol.Observable.unByKey(singleclicker);
        }
      




    });

    // Re-enable dragging when user's cursor leaves the element
    $("#popup,#mesureur").on('mouseout', function () {
        map.addInteraction(dragPan);
        map.addInteraction(zoomInteraction);
        map.addInteraction(mousezoom);
      
        singleclicker = map.on('singleclick', function (evt) {

            addMarker(evt.coordinate);
            makeAppelList(map.getCoordinateFromPixel(evt.pixel));
        });
      
    });


}