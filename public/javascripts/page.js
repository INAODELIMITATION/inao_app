/*$(function(){
    $("#search").autocomplete({
       
        source : function(request, response){
            console.log(request.term);
            //fetch data
            $.ajax({
                url:"/search",
                type:'post',
                dataType:"json",
                data:{
                    denom:request.term,
                   
                },
                success:function(data){
                    
                    response(data);
                    console.log(data)
                }
            });
        },
        minLength: 3,
        select : function(event,ui){
            //set selection
            $('#search').val(ui.item.denomination);
            $('#selecteduser_id').val(ui.item.id_denom);
           
            return false;
        }
    });
});*/
$(document).ready(function () {
    $('#search').typeahead({
       
        source: function (query, result) {
            $.ajax({
                url: "http://127.0.0.1:3000/search",
                data: 'denom=' + query,            
                dataType: "json",
                type: "POST",
                success: function (data) {
                    console.log("debut");
                    result($.map(data, function (item) {
                        return item.denomination;
                    }));
                }
            });
        }
    });
});