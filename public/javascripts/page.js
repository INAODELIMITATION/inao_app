$(document).ready(function () {
    $('#search').typeahead({

       minLength:3,
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
      
    });
});



