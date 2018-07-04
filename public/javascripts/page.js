$(document).ready(function () {
    $('#search,#searchM').typeahead({
        minLength: 3,
        maxItem: 10,
        source: function (query, result) {
            $.ajax({
                url: "http://127.0.0.1:3000/search",
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
var result;
/*$('#search').change(function(){
    var result = $(this).val();
   
    //call your function here
    bob(result);
});


function bob(result) {
    alert('hi bob, you typed: '+ result);
}*/
