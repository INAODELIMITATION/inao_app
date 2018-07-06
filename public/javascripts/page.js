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
         //window.location.replace("/api/denomination/"+item);
         var url = "/api/denomination/"+item;
         $( location ).attr("href", url);
      }

    });

   
    
});
