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
                           
                          }
                          try{
                            map.addLayer(new ol.layer.VectorTile({
                                opacity: 0.8,
                                source: sourceL,
                                style :((feature)=>{
                                    if(feature.get(data1[i].type) === data1[i].valeur){
                                        return styles.red;
                                    }else{
                                        return new ol.style.Style({});
                                    }
                                })()
                            }));
                            successMessage("ajout de la couche "+data1[0].valeur, "ajout termnié avec succès");
                          }catch(e){
                            swal({
                                title:"ERREUR lors du chargement de la couche : "+data1[0].valeur+" "+e,
                                text:"Transmettre l'erreur ci-dessus à votre administrateur ou éssayez de réactualiser la page.",
                                type:"warning",
                                showConfirmButton:true,
                            });
                          }
                       
                          $.ajax({
                            url:"/extendTest/"+data1[i].valeur,
                            type:'GET',
                            dataType:"json",
                            success:function(data){
                                
                                var ex = [data[0].st_xmin,data[0].st_ymin, data[0].st_xmax, data[0].st_ymax];
                               
                                fitToextent(ex);
                            }
                        });
                       
                    }

                    
                    layerMVT.setVisible(false);
                    
                    
                    /*map.getView().fit([738812.1, 6286127.87, 742802.05, 6292430.82], map.getSize());*/
                    map.updateSize();
                    //map.renderSync();

                }
            });

        }

    });

});



