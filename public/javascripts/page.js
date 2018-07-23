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
                    var iterator = 0;
                    for (var i = 0; i < data1.length; i++) {
                          iterator = i;
                          try{
                            map.addLayer(new ol.layer.VectorTile({
                                opacity: 0.8,
                                source: sourceL,
                                style :(feature=>{
                                    if(feature.get(data1[iterator].type) === data1[iterator].valeur){
                                        return styles.red;
                                    }else{
                                        return new ol.style.Style({});
                                    }
                                }),
                            }));
                            successMessage("ajout de la couche "+data1[iterator].valeur, "ajout termnié avec succès");
                          }catch(e){
                            swal({
                                title:"ERREUR lors du chargement de la couche : "+data1[iterator].valeur+" "+e,
                                text:"Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
                                type:"warning",
                                showConfirmButton:true,
                            });
                          }
                       
                          fitToextent(data1[iterator].valeur, iterator);
                       
                    }
                   
                   map.removeLayer(layerMVT);
                    map.updateSize();

                }
            });

        }

    });

});



