"use strict";
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
                            return '<pre>[' + item.code_insee + ']' + ' ' + item.commune + '</pre>';
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
    });
});

