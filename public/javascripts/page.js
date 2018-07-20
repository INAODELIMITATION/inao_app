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
                    var vectorSource = new ol.source.Vector({
                        format: new ol.format.Feature({
                            defaultDataProjection: 'EPSG:2154',
                            projection: 'EPSG:2154'
                        }),
                        projection: 'EPSG:2154',
                        extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
                        resolutions: resolutions,
                        origin: ol.extent.getTopLeft(projectionExtent),
                    });
                    var VectorLayer = new ol.layer.Vector({
                        //source:vectorSource,
                        projection: 'EPSG:2154',
                        extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
                        resolutions: resolutions,
                        origin: ol.extent.getTopLeft(projectionExtent),
                        //map:map,
                        renderMode: 'vector',
                        opacity: 0.8,
                        style: styles.red
                    });

                    var filteredFeatures = [];

                    for (var i = 0; i < data1.length; i++) {
                        function simpleStyle(feature) {
                            if(feature.get(data1[0].type) == data1[0].valeur){
                                return styles.red;
                            }else{
                                return new ol.style.Style({});
                            }
                          }
                        map.addLayer(new ol.layer.VectorTile({
                            opacity: 0.8,
                            source: sourceL,
                            style :simpleStyle
                        }))
                        // for (var j = 0; j < features.length; j++) {

                        //     if (String(features[j].get(data1[i].type)).valueOf() == String(data1[i].valeur).valueOf()) {
                        //         console.log("fois please");
                        //         //filteredFeatures.push(features[j]);
                        //         try {
                        //         //     var iFeature = new ol.Feature(features[j].getGeometry());
                        //         //     // var iFeature = new ol.Feature({
                        //         //     //     geometry: new ol.geom.Polygon({
                        //         //     //         coordinates: features[j].getGeometry().getFlatCoordinates(),
                        //         //     //         layout:features[j].getGeometry().getType()

                        //         //     //     })
                        //         //     // });
                        //         //     iFeature.setGeometryName('polygon');
                        //         //     iFeature.setId(j);
                        //         //     var feat = features[j];
                        //         //     console.log(feat.coordinates);
                        //         //     iFeature.setStyle(styles.red);
                        //         //      //iFeature.setGeometry(features[j].getGeometry().getFlatCoordinates());
                        //         //    console.log(Object.keys(iFeature));
                        //         //    console.log(features[j].getGeometry().getType());

                        //         //     break;

                        //         //     filteredFeatures.push(iFeature);
                        //         } catch (e) {
                        //             console.log(e);

                        //         }


                        //     }

                        // }

                        console.log("parcours du tableau terminé");

                        // console.log(Object.keys(features));


                        //vectorSource.addFeatures(filteredFeatures[0]);


                        /* filteredFeatures.forEach(function (feature) {
                             var f=0;
                             vectorSource.addFeatures(feature.getFlatCoordinates({
                                 id:f,
                             }))
                             f++;
                             //sourcep.addFeature(feature.getGeometry());
                         });*/
                        // try {

                        //     vectorSource.addFeatures(filteredFeatures);
                        //     VectorLayer.setSource(vectorSource);
                        //     console.log(VectorLayer.getSource().getProjection());
                        //     //vectorSource.setProjection(proj2154);


                        // } catch (e) {
                        //     console.log(e);
                        // }


                        //console.log(filteredFeatures[1].getGeometry());      


                        //filteredFeatures = [];

                    }


                    layerMVT.setVisible(false);
                    
                  
                    map.updateSize();
                    //map.renderSync();

                }
            });

        }

    });

});



