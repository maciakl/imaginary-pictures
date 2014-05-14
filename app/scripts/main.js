$.getJSON("http://www.reddit.com/user/reset_by_peer/m/imaginary/.json?jsonp=?&show=all&limit=300", function(data) {
    $.each(data.data.children, function(i,item){
        IsValidImageUrl(item.data.url, function(url, isvalid) {
            if(isvalid) { 
                $("<img/>").attr("src", item.data.url)
                .addClass("img-responsive").addClass("img-rounded")
                .appendTo(
                    $("<a />").attr("href", item.data.url)
                    .addClass("thumbnail")
                    .appendTo(
                        $("<div />").addClass("col-xs-12")
                            .appendTo("#images")
                    )
                )
            }
            else {
                if(!item.data.is_self)
                {
                    $("<img/>").attr("src", item.data.thumbnail)
                    .addClass("img-thumbnail")
                    .appendTo(
                        $("<a />").attr("href", item.data.url)
                        .addClass("thumbnail")
                        .appendTo(
                            $("<div />").addClass("col-xs-12 col-sm-6 col-md-4")
                                .appendTo("#images")
                        )
                    );
                }
            }
            
        });
    });
});


function IsValidImageUrl(url, callback) {
    var img = new Image();
    img.onerror = function() { callback(url, false); }
    img.onload =  function() { callback(url, true); }
    img.src = url
}
