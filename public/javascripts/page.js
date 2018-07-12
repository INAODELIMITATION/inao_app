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
                    var source = [];
                    var vectorSource = new ol.source.Vector({  projection: 'EPSG:2154',  /*format: new ol.format.MVT(),*/ });
                    console.log(data1.length);
                    console.log(sourceL);
                    function filters(feature) {
                        /*for (let i = 0; i <= data1.length; i++) {
                            if (feature.get(data1[i].type) == data1[i].valeur ) {
                                console.log("success");
                                return styles.green;
                            }
                            else if(feature.get(data1[i].type) != data1[i].valeur) {
                                return new ol.style.Style({});
                            }
                        }*/ 
                      
                        for(var i = 0; i < data1.length; i++){
                            
                         if (feature.get(data1[i].type) ==  data1[i].valeur){
                           /*let newFeature = new ol.Feature({
                               geometry: feature.getGeometry(),
                               name:data1[i].type
                           });*/
                         
                           
                           vectorSource.addFeatures(feature.getGeometry());
                        
                          /* map.addLayer(new ol.layer.VectorTile({
                               source :  new ol.source.Vector({}),
                              // style: InitStyle
                           }));*/
                           source.push(vectorSource);
                           console.log(source[i]);
                         }
                       
                        
                        }
                           
                        return styles.green;                     
                    }
                   
                   //layerMVT.setStyle(filters);
                 
                    layerMVT.setVisible(true);
                    console.log(source[0].getFeatures());
                   /* map.addLayer(new ol.layer.Vector({
                        style:styles.red,
                        opacity: 1,
                        source: source[0],
                    }));*/

                  
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