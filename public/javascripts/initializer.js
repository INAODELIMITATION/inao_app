/**
 * @author GUIALA JEAN ROGER
 * @module Initializer
 */

/**
 * chargement des variables générale et des fonctions qui vont etre utilisé par d'autres pages JS
 */

var extent = [-378305.8099675195, 6008151.219241469, 1320649.5712336518, 7235612.7247730335];
var projection = new ol.proj.Projection({
    code: 'EPSG:2154',
    extent: extent,
    units: 'm',
    axisOrientation: 'neu'
}); // definition du EPSG 2154
var zoom = 2.2;
ol.proj.addProjection(projection); //inclusion du EPSG dans openlayer
var proj2154 = ol.proj.get('EPSG:2154'); //recupération de la projection
proj2154.setExtent(extent);
var projectionExtent = proj2154.getExtent(); //recupération de l'étendu de la projection 
var variable = 21;
var resolutions = new Array(variable);
var matrixIds = new Array(variable);
var maxResolution = ol.extent.getWidth(projectionExtent) / 256; //recupérationd des résolutions
for (var i = 0; i < variable; ++i) {
    matrixIds[i] = 'EPSG:2154:' + i;
    resolutions[i] = (maxResolution) / Math.pow(2, i);
    //alert(resolutions[i]);
}
//setup source couche qui va etre utilisé pour toute les aire parcellaires
var sourceL = new ol.source.VectorTile({
    tilePixelRatio: 1,
    format: new ol.format.MVT(),
    tileGrid: ol.tilegrid.createXYZ({
        extent: extent,
        resolutions: resolutions,
        origin: ol.extent.getTopLeft(projectionExtent),

    }),

    url: 'http://geoserver.sig-inao.fr/geoserver/gwc/service/tms/1.0.0/inao:aireParcellaire@EPSG:2154@pbf/{z}/{x}/{-y}.pbf',
    crossOrigin: 'anonymous',
});
var view = new ol.View({
    projection: "EPSG:2154",
    center: [489353.59, 6587552.20], //coord en 2154
    minZoom: 1.5,
    //maxZoom: 14,
    zoom: zoom
});
/**
 * Déclaration de la carte ici, ol::Map
 */
var map = new ol.Map({
    target: 'map',
    renderer: 'canvas', //canvas,WebGL,DOM
    view: view,
});

var
    vectorSource = new ol.source.Vector(),
    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        opacity: 1,
    });
map.addLayer(vectorLayer);

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 32],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: '/images/marker.png'
    })
});

function addMarker(coordinate) {
    vectorSource.clear();
    let feature = new ol.Feature(
        new ol.geom.Point(coordinate)
    );
    feature.setStyle(iconStyle);
    vectorSource.addFeature(feature);
}

var mesure_Source = new ol.source.Vector();

var vector_mesure = new ol.layer.Vector({
    source: mesure_Source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,2555,0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                colo: '#ffcc33'
            })
        })
    })
});

/**
     * Currently drawn feature.
     * @type {module:ol/Feature~Feature}
     */
var sketch;

/**
    * The help tooltip element.
    * @type {Element}
    */
var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {module:ol/Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;

/**
    * Overlay to show the measurement.
    * @type {module:ol/Overlay}
    */
var measureTooltip;

/**
      * Message to show when the user is drawing a polygon.
      * @type {string}
      */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
      * Handle pointer move.
      * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
      */
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click to start drawing';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);
    
        helpTooltipElement.classList.remove('hidden');
    }

   
};

map.addLayer(vector_mesure);
map.on('pointermove', pointerMoveHandler);

map.getViewport().addEventListener('mouseout', function () {
    helpTooltipElement.classList.add('hidden');
});

//var typeSelect = document.getElementById('type'); //area

var draw; // global so we can remove it later

/**
     * Format area output.
     * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
var formatArea = function (polygon) {
    var area = getArea(polygon);
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};

function addInteraction() {
    var type = 'area';
    draw = new ol.interaction.Draw({
        source: mesure_Source,
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    var listener;
    draw.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {module:ol/coordinate~Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    draw.on('drawend',
        function () {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
        }, this);
}

/**
   * Creates a new help tooltip
   */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}

/**
     * Creates a new measure tooltip
     */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}



  $("#mesureur").on('click',()=>{
    map.removeInteraction(draw);
    addInteraction();
  });