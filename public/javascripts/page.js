"use strict";
//WinMove();
var clicked = 0;


$(document).ready(function () {
   

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


    var dragPan;
    map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof ol.interaction.DragPan) {
            dragPan = interaction;
        }
    }, this);
    $("#popup").appendTo(
        $('.ol-overlaycontainer')
    );
    $("#popup").on('mouseover', function () {

        if (dragPan) {
            map.removeInteraction(dragPan);
        }

    });

    // Re-enable dragging when user's cursor leaves the element
    $("#popup").on('mouseout', function () {
        map.addInteraction(dragPan);
    });
});

