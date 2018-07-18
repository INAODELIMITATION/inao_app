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
                        extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
                        format: new ol.format.MVT(),

                    });
                    var filteredFeatures = [];


                    for (var i = 0; i < data1.length; i++) {
                        for (var j = 0; j < features.length; j++) {

                            if (String(features[j].get(data1[i].type)) == String(data1[i].valeur)) {

                                filteredFeatures.push(features[j]);
                            }

                        }

                        var sourcep = new ol.source.Vector({
                            projection: proj2154, 
                            /*wrapX:true,
                            projection: proj2154,  
                            extent:[-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
                            format: new ol.format.MVT(),
                            defaultDataProjection:proj2154*/
                        });
                    
                        console.log(Object.keys(filteredFeatures[0]));
                       // console.log(filteredFeatures[0].getFlatCoordinates());
                        //var thing = new ol.geom.Polygon(ol.proj.transform);
                        //sourcep.addFeature(thing);
                        var formatM = new ol.format.MVT({});
                       
                        //sourcep.addFeatures(formatM.readFeatures(filteredFeatures));
                        console.log(formatM.readFeatures(filteredFeatures));

                        // filteredFeatures.forEach(function (feature) {
                        //     sourcep.addFeature(new ol.Feature({
                        //         geometry:feature.getGeometry(),
                        //     }))
                        //     //sourcep.addFeature(feature.getGeometry());
                        // });
                        var layF = new ol.layer.Vector({
                            source: sourcep
                            /*renderMode: "hybrid",
                           // features:filteredFeatures,
                            maxResolution: maxResolution,
                            minResolution: resolutions[20],
                            source:source,
                            style:styles.red*/
                        });

                        //console.log(filteredFeatures[1].getGeometry());
                        console.log(sourcep.getFeatures());
                        console.log(layerMVT);
                        layF.setStyle(styles.red)
                        console.log(layF);
                        map.addLayer(layF);

                        // filteredFeatures = [];

                    }


                    layerMVT.setVisible(false);


                    map.updateSize();
                    //map.renderSync();

                }
            })

        }

    });

});



