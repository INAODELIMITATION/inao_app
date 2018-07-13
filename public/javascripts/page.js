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






/**
 * fonction permettant de créer un style
 * @param {string} couleur la couleur des traits
 * @param {string} code le code en rgba du remplissage 
 */
function styleColor(couleur, code) {
    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: couleur,
            width: 2
        }),
        fill: new ol.style.Fill({
            color: code
        })
    })];
}

// différentes couleur dans un objet 
var styles = {
    yellow: styleColor('yellow', 'rgba(255,255,0,0.6)'),
    red: styleColor('red', 'rgba(255,0,0,0.6)'),
    green: styleColor('green', 'rgba(0,128,0,0.6)'),
    blue: styleColor('blue', 'rgba(0,0,255,0.6)'),
    aqua: styleColor('aqua', 'rgba(0,255,255,0.6)'),
    fuchsia: styleColor('fuchsia', 'rgba(255,0,255,0.6)'),
    navy: styleColor('navy', 'rgba(0,0,128,0.6)'),
    olive: styleColor('olive', 'rgba(128,128,0,0.6)')
};