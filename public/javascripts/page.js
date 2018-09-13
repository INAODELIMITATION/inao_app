// "use strict";
//WinMove();
var clicked = 0;

$(document).ready(function () {

    Gp.Services.getConfig({
        serverUrl: "/javascripts/autoconf/local.json", //local
        //serverUrl: "/GPautoconf/autoconf.json", //server
        callbackSuffix: "",
        onSuccess: initialisation,
        onFailure: fail,
    });

    $("#AutreRecherche").on('click',()=>{
        $("#popup").toggle();
    });
    $("#hideAutreRecherche").on('click',()=>{
        $("#popup").css("display","none");
    });

    list();
    $('#search,#searchM').typeahead({
        minLength: 3,
        maxItem: 10,
        source: function (query, result) {
            $.ajax({
                url: "/search",
                data: 'denom=' + query,
                dataType: "json",
                type: "POST",
                success: function (data) {

                    result($.map(data, function (item) {
                        return item.denomination;
                    }));
                }
            });
        },

        updater: function (item) {
            $.ajax({
                url: "/api/denomination/" + item,
                type: 'GET',
                dataType: "json",
                success: function (data) {
                    var data1 = data.filter;
                    layerAdder(data1[data1.length - 1]);


                }
            });

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
        formLoader($(this).val());

        $('#communeS').typeahead({
            minLength: 3,
            maxItem: 10,
            source: function (query, result) {
                $.ajax({
                    url: "/commune/",
                    data: 'commune=' + query,
                    dataType: "json",
                    type: "POST",
                    success: function (data) {
                        result($.map(data, function (item) {

                            return '[' + item.code_insee + ']' + ' ' + (item.commune).trim();
                        }));
                    }
                });
            },

            updater: function (item) {
                $("#paramParcelle").show();
                $("#communecherche").empty();
                $("#resultatable").empty();
                $("#resultatable").hide();
                $("#Parsection").val('');
                $("#numpar").val('');
                $("#resultat").hide();
                var numbers = item.match(/\d+/g).map(Number);
                $("#communecherche").append(item);
                $("#sectionID").val(numbers);
                $("#parcelleSearcher").on('click', () => {
                    if(!$("#Parsection").val() && !$("#numpar").val()){
                        $("#paramParcelle").addClass('has-error');
                        $("#erreurParcelle").show();
                    }
                    else{
                        $("#erreurParcelle").hide();
                        $("#paramParcelle").removeClass('has-error');
                        $.ajax({
                            url: "/parcelles",
                            data: {
                                'insee':  $("#sectionID").val(),
                                'section': $("#Parsection").val(),
                                'numpar': $("#numpar").val()
                            },
                            dataType: "json",
                            type: "POST",
                            success: function (data) {
                                $("#resultatable").empty();
                                $("#resultatable").show();
                                $("#resultat").show();
                                data.forEach((parcelle)=>{
                                    $("#resultatable").append(
                                        '<tr>'+
                                        '<td><a href="#" onclick="loadParcelle('+parcelle.id+')">'+parcelle.idu+'</a></td>'+
                                        '<td> ['+parcelle.insee+'] '+parcelle.commune+'</td>'+
                                        '</tr>'
                                    );
                                  
                                });
                              
                            }
    
                        });
                    }
                   
                });

            }

        });
    });
});

