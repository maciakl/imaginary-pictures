'use strict';

var LIMIT = 500;    // the number of the reddit posts to fetch
var AFTER = '';     // holds the id of the last post fetched
var ONPAGE = [];    // array of url's currently on page (for duplicate checking)

// API lookup address for DeviantArt pages
var DEVIANTAPI = 'http://backend.deviantart.com/oembed?url=';

// Check if url points to an actual image asynchroneousl
// Passes either true (actual image) or false (not an image) to the callback
function IsValidImageUrl(url, callback) {
    var img = new Image();
    img.onerror = function() { callback(false); };
    img.onload =  function() { callback(true); };
    img.src = url;
}

// Appends a box with the image and meta-data to the #images div
function addImage(item) {

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

// Get direct link for imgur picture given data item
// The item.data.url must point to a imgur.com page (not image)
function getImgur(item) {
    //
    // make sure it's not gifv (gifv won't display right)
    var gifvPattern = /.gifv$/;
    
    if(!gifvPattern.test(item.data.url))
    {
        item.data.url = item.data.url+'.png';
        addImage(item);
    }
}

// Get direct link from DeviantArt page and
// The item.data.url must point at a deviantart.com image page (not direct link)
function getDeviant(item) {

    var eurl = encodeURIComponent(item.data.url);
    var oembedUrl = DEVIANTAPI + eurl + '&format=jsonp&callback=?';

    $.getJSON(oembedUrl, function (data) {
        item.data.url = data.url;
        addImage(item);
    });
}

// Given a link to a page, figure out how to get a direct link
// currently supporting only deviantart and imgur page links
function getPictureFromPage(item) {
    var imgurPattern = /imgur\.com/;
    var deviantPattern = /deviantart\.com/;

    if (imgurPattern.test(item.data.url)) {
        getImgur(item);
    } else if (deviantPattern.test(item.data.url)) {
        getDeviant(item);
    }
}

/* DEPRECATED
function addThumbnail(item){

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
*/

// Load a full page of images
function loadPage() {

    // get reddit JSON feed
    $.getJSON('http://www.reddit.com/user/reset_by_peer/m/imaginary/.json?jsonp=?&show=all&limit='+LIMIT+'&after='+AFTER, function(data) {
        $.each(data.data.children, function(i,item){

            new IsValidImageUrl(item.data.url, function(isvalid) {

                if(isvalid) {
                    if($.inArray(item.data.url, ONPAGE)<0){
                        addImage(item);
                        ONPAGE.push(item.data.url);
                    }
                }
                else
                {
                    // we are discarding self posts because they are useless in this context
                    if(!item.data.is_self)
                    {
                        // make sure this is not a duplicate image
                        if($.inArray(item.data.url, ONPAGE)<0){
                            getPictureFromPage(item);
                            ONPAGE.push(item.data.url); // add url to array
                        }
                    }
                }
            });
        });
        AFTER = data.data.after; // fetch the anchor for next page
    });
}

// infinite scrolling code
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        loadPage();
    }
};

loadPage();
