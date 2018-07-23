"use strict";
$(document).ready(function () {
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
                    var filteredFeatures = [];

                    for (var i = 0; i < data1.length; i++) {
                        function simpleStyle(feature) {
                            if(feature.get(data1[0].type) == data1[0].valeur){
                                return styles.red;
                            }else{
                                return new ol.style.Style({});
                            }
                          }
                          try{
                            map.addLayer(new ol.layer.VectorTile({
                                opacity: 0.8,
                                source: sourceL,
                                style :simpleStyle
                            }));
                            successMessage("ajout de la couche "+data1[0].valeur, "ajout termnié avec succès");
                          }catch(e){
                            successMessage("erreur lors de l'ajout de la couche "+data1[0].valeur, "erreur :"+e);
                          }
                       
                      
                        console.log("parcours du tableau terminé");

                       
                    }


                    layerMVT.setVisible(false);
                    
                  
                    map.updateSize();
                    //map.renderSync();

                }
            });

        }

    });

});



