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
                    
                    try{
                        map.addLayer(new ol.layer.VectorTile({
                            opacity: 0.8,
                            source: sourceL,
                            style :(feature=>{
                                if(feature.get(data1[ data1.length -1].type) === data1[ data1.length -1].valeur){
                                    return styles.red;
                                }else{
                                    return new ol.style.Style({});
                                }
                            }),
                        }));
                        successMessage( "ajout termnié avec succès","ajout de la couche "+data1[ data1.length -1].valeur);
                      }catch(e){
                        swal({
                            title:"ERREUR lors du chargement de la couche : "+data1[ data1.length -1].valeur+" "+e,
                            text:"Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
                            type:"warning",
                            showConfirmButton:true,
                        });
                      }
                   
                 
                    fitToextent(data1[ data1.length -1].valeur);
                  

                   map.removeLayer(layerMVT);
                    map.updateSize();

                }
            });

        }

    });

});



