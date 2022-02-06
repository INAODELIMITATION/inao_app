/**
 * @file Initializer 
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @module Initializer 
 */

/**
 * chargement des variables générale et des fonctions qui vont etre utilisé par d'autres pages JS
 */

// proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// ol.proj.proj4.register(proj4);

var extent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];
/*var projection = new ol.proj.Projection({
  code: 'EPSG:2154',
  extent: extent,
  units: 'm',
  axisOrientation: 'neu'
}); // definition du EPSG 2154*/
var zoom = 14;
//ol.proj.addProjection(projection); //inclusion du EPSG dans openlayer
var proj3857 = ol.proj.get('EPSG:3857'); //recupération de la projection
proj3857.setExtent(extent);
var projectionExtent = proj3857.getExtent(); //recupération de l'étendu de la projection 
var variable = 21;
var resolutions = new Array(variable);
var matrixIds = new Array(variable);
var maxResolution = ol.extent.getWidth(projectionExtent) / 256; //recupérationd des résolutions
for (var i = 0; i < variable; ++i) {
  matrixIds[i] = 'EPSG:3857:' + i;
  resolutions[i] = parseFloat((maxResolution) / Math.pow(2, i));
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

  url: 'http://geoserver.sig-inao.fr/geoserver/gwc/service/tms/1.0.0/inao:aireParcellaire@EPSG:3857@pbf/{z}/{x}/{-y}.pbf',
  crossOrigin: 'anonymous',
});
var view = new ol.View({
  projection: "EPSG:3857",
  center: [273516,5876918], //coord en 3857
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

var compteur = false; //compteur pour activer désactiver mesure


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

// map.getViewport().addEventListener('contextmenu', function (e) {
//     e.preventDefault();
//     openContextMenu(e.layerX, e.layerY);
// });

// function openContextMenu(x, y) {
//     $('.contextMenu').remove();
//     $('body').append('<div class="contextMenu ibox-content" style=" top: ' + y + 'px; left:' + x + 'px;">' +
//         '<div class="menuItem" onclick="handleContexMenuEvent(\'zoomIn\', \''+ x +'\', \''+ y +'\');"> Zoom In </div>' +
// 		'<div class="menuItem" onclick="handleContexMenuEvent(\'zoomOut\', \''+ x +'\', \''+ y +'\');"> Zoom Out </div>' +
// 		'<div class="menuItem" onclick="handleContexMenuEvent(\'centerMap\', \''+ x +'\', \''+ y +'\');"> Center Map Here </div>' +													'<div class="menuSeparator"> </div>' +
//         '<div class="menuItem" onclick="handleContexMenuEvent(\'addMarker\', \'' + x + '\', \'' + y + '\');"> Add Marker </div>' +
//         '<div class="menuItem" onclick="handleContexMenuEvent(\'appellations\', \'' + x + '\',  \'' + y + '\');"> appellations sur la zone </div>' +
//         '</div>');
// }

// function handleContexMenuEvent(option, x, y) {
//     $('.contextMenu').remove();
//     var location = map.getCoordinateFromPixel([x, y]);

//     if (option == 'zoomIn' ) {
//         map.getView().setZoom( map.getView().getZoom() + 1);
//     } else if (option == 'zoomOut' ) {
//         map.getView().setZoom(map.getView().getZoom() - 1);
//     } else if (option == 'centerMap' ) {
//         console.log(location);
//         goToCoord(location[0], location[1]);
//     } else if (option == 'addMarker') {
//         console.log(location);
//         var feature = new ol.Feature(
//         new ol.geom.Point(location));
//         feature.setStyle(iconStyle);
//         vectorSource.addFeature(feature);
//     } else if (option == 'appellations') {
//         addMarker(location);
//         makeAppelList(map.getCoordinateFromPixel([x, y]));
//     }
// }

// function goToCoord(x, y) {
//     var p = new ol.geom.Point([x,y]).getCoordinates();
//     var pan = ol.animation.pan({
//         duration: 200,
//         source: map.getView().getCenter()
//     });

//     map.beforeRender(pan);
//     map.getView().setCenter(p);k
// }


function mapOnClick(evt) {

  addMarker(evt.coordinate);
  makeAppelList(map.getCoordinateFromPixel(evt.pixel));
}



map.on("singleclick", mapOnClick);


/**la fonction de mesure */




var source = new ol.source.Vector();

var vector = new ol.layer.Vector({
  source: source,
  opacity:1,
  zindex:100,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 165, 0, 0.4)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffa500',
      width: 3
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffa500'
      })
    })
  })
});


/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'clicker pour continuer a déssiner le polygone';



var pointerMoveHandler = function (evt) {

  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = 'clicker pour commencer à déssiner';
  /** @type {ol.Coordinate|undefined} */
  var tooltipCoord = evt.coordinate;

  if (sketch) {
    var output;
    var geom = (sketch.getGeometry());
    if (geom instanceof ol.geom.Polygon) {

      output = formatArea(/** @type {ol.geom.Polygon} */(geom));
      helpMsg = continuePolygonMsg;
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);
};



var type = "Polygon";
draw = new ol.interaction.Draw({
  source: source,
  type: /** @type {ol.geom.GeometryType} */ (type),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.4)'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 1)',
      lineDash: [10, 10],
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.7)'
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.4)'
      })
    })
  })
});





var draw; // global so we can remove it later
function addInteraction() {
  map.un("singleclick", mapOnClick);
  /**
   * Handle pointer move.
   * @param {ol.MapBrowserEvent} evt
   */

  createHelpTooltip();
  createMeasureTooltip();
  map.addInteraction(draw);
  map.un("singleclick", mapOnClick);
  draw.on('drawstart',
    function (evt) {
      map.un("singleclick", mapOnClick);
      // set sketch
      sketch = evt.feature;
    }, this);
  map.on('pointermove', pointerMoveHandler);
  map.un("singleclick", mapOnClick);
  draw.on('drawend',
    function (evt) {
      measureTooltipElement.className = 'tooltip tooltip-static';
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      createMeasureTooltip();
    }, this);
  map.un("singleclick", mapOnClick);

}
map.addLayer(vector);
vector.setZIndex(100);

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip-help';
  helpTooltip = new ol.Overlay({
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
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  map.addOverlay(measureTooltip);
}




/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
var formatArea = function (polygon) {
  var area;

  area = polygon.getArea();
  console.log(Math.round(area));
  var output;
  if (area > 1000) {
    output = (Math.round(area / 10000 * 100) / 100) +
      ' ' + 'ha';
  } else {
    output = (Math.round(area * 100) / 100) +
      ' ' + 'm<sup>2</sup>';
  }
  return output;
};

function supprimeurOnclick(evt) {
  $("#popup").css("display", "none");
  source.clear();
  vectorSource.clear();
  map.removeInteraction(draw);
  map.removeOverlay(helpTooltip);
  $(".tooltip-static").detach();

  map.on("singleclick", mapOnClick);
  compteur = false;
  $("#listappel").css("display", "none");
}

function mesureurOnclick(evt) {
  if (!compteur) {

    addInteraction();
  }
  else {
    map.removeOverlay(helpTooltip);
    map.removeInteraction(draw);
    map.on("singleclick", mapOnClick);

  }
  compteur = !compteur;
}

