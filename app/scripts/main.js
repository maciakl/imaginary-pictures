'use strict';

var LIMIT = 500;

function IsValidImageUrl(url, callback) {
    var img = new Image();
    img.onerror = function() { callback(false); };
    img.onload =  function() { callback(true); };
    img.src = url;
}

$.getJSON('http://www.reddit.com/user/reset_by_peer/m/imaginary/.json?jsonp=?&show=all&limit='+LIMIT, function(data) {
    $.each(data.data.children, function(i,item){

        new IsValidImageUrl(item.data.url, function(isvalid) {

            if(isvalid) {
                $('#images').append( $('<div />').addClass('col-xs-12')
                    .append(
                        $('<div />').addClass('thumbnail')
                        .append(
                            $('<img />').attr('src', item.data.url)
                            .attr('alt', item.data.title)
                            .addClass('img-responsive img-rounded')
                        ).append(
                            $('<div />').addClass('caption')
                            .append($('<p />').addClass('text-muted').append(item.data.title))
                            .append($('<small />')
                                .append(
                                    $('<a />').attr('href', 'http://reddit.com'+item.data.permalink)
                                    .attr('target', '_blank')
                                    .addClass('btn btn-default btn-xs')
                                    .append($('<span />').addClass('fa fa-reddit'))
                                    .append(' ' + item.data.subreddit)
                                )
                                .append(' ')
                                .append(
                                    $('<span />')
                                    .addClass('label label-warning')
                                    .append($('<span />').addClass('fa fa-arrow-up'))
                                    .append(' ' + item.data.ups)
                                )
                                .append(
                                    $('<span />')
                                    .addClass('label label-info')
                                    .append($('<span />').addClass('fa fa-arrow-down'))
                                    .append(' ' + item.data.downs)
                                )
                                .append(' ')
                                .append(
                                    $('<span />')
                                    .addClass('label label-default')
                                    .append($('<span />').addClass('fa fa-user'))
                                    .append(' ' + item.data.author)
                                )
                                .append(' ')
                                .append(
                                    $('<a />').attr('href', item.data.url)
                                    .attr('target','_blank')
                                    .addClass('btn btn-default btn-xs')
                                    .append($('<span />').addClass('fa fa-image'))
                                    .append(' ' + item.data.domain)
                                )
                            )
                        )
                    )
                );
            }
            else
            {
                if(!item.data.is_self)
                {
                    $('#thumbs').append( $('<div />').addClass('col-xs-6 col-sm-3 col-md-2')
                        .append(
                            $('<div />').addClass('thumbnail')
                            .append(
                                $('<a />').attr('href', item.data.url)
                                .attr('target', '_blank')
                                .append(
                                    $('<img />').attr('src', item.data.thumbnail)
                                    .attr('alt', item.data.title)
                                    .attr('title', item.data.title)
                                    .addClass('img-responsive img-rounded')
                                    .height(70)
                                    .width(70)
                                )
                            )
                        )
                    );
                }
            }
        });
    });
});
