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
        templates:{
            empty: (context)=>{
                $(".tt-dataset").text('pas de résultat');
            }
        },
      updater:function(item){
          result = item;
        
        /* var url = "/api/denomination/"+item;
         $( location ).attr("href", url);
         */
         $.ajax({
             url:"/api/denomination/"+item,
             type:'GET',
             dataType:"json",
             success:function (data){
              console.log(data.denomination);
               console.log(typeof data.filter);
               var feature = new ol.Feature({
                   geometry: new ol.geom.MultiPolygon("2154"),
                   name:"denomination"
               });
               layerMVT.setStyle(filters(data.filter,feature));
           
             }
         })
         
      }

    });
    
});

function filters(tab,feature){
   
    for(var i=0; i<=tab.length; i++){
        console.log("enyet");
       if(feature.get(tab[i].type)== tab[i].valeur){
           console.log("success");
           return styles.green;
           
       }
       else{
           console.log("failure");
           return new ol.style.Style({});
       }
    }
}





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