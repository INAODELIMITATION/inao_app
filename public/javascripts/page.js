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
        templates: {
            empty: (context) => {
                $(".tt-dataset").text('pas de résultat');
            }
        },
        updater: function (item) {
            $.ajax({
                url: "/api/denomination/" + item,
                type: 'GET',
                dataType: "json",
                success: function (data) {
                    var data1 = data.filter;
                    var vectorSource = new ol.source.Vector({  
                        projection: proj2154,  
                        extent:[-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
                        format: new ol.format.MVT(),
                       
                    });
                   var filteredFeatures= [];
                 
                  
                 for(var i=0; i<data1.length; i++){
                     for(var j=0; j<features.length; j++){
                         
                         if(features[j].get(data1[i].type)== data1[i].valeur){
                            
                            filteredFeatures.push(features[j]);
                         }
                        
                     }
                     
                     var source = new ol.source.Vector({
                        features:filteredFeatures,
                        projection: proj2154,
                    });
                    map.addLayer(new ol.layer.Vector({
                        source:source,
                        style:styles.red
                    }));
                    
                    filteredFeatures = [];
                    
                 }
                
            
                    layerMVT.setVisible(false);
                   
                  
                    map.updateSize();
                    //map.renderSync();
                  
                }
            })

        }

    });

});



