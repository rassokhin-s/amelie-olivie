"use strict";

function thumblrCallback() {}

$(function() {

    var photos = {
        tmpl: $.templates("#postTemplate"),
        $photosContainer: $('#photos'),
        init: function() {
            // Request to Thumblr server need to be send in jsonp format, so we need to provide a callback in window object
            // then we set this callback to local func to work with local env
            thumblrCallback = this.thumblrCallback.bind(this);
            this.sendRequest();
        },
        sendRequest: function() {
            $.ajax({
                type: 'GET',
                url: 'https://api.tumblr.com/v2/blog/amelie-olivier-fine-art.tumblr.com/posts/photo',
                dataType: "jsonp",
                data: {
                    api_key : "irKOZOFcvuyMzD6o0NljHXgLKwWRxfj48sR4ZVERCOSbOmUogp",
                    jsonp : "thumblrCallback"
                }
            });
        },
        thumblrCallback: function(data) {
            console.log('data', data);
            if (data.meta.status !== 200) {
                alert(data.meta.msg);
            }
            if (data.response && data.response.total_posts) {
                for (var i = 0; i < data.response.posts.length; i++) {
                    var post = data.response.posts[i];
                    this.createImage(post);
                }
            }
        },
        createImage: function(post) {
            for (var i = 0; i < post.photos.length; i++) {
                var photos = post.photos[i];
                var $html = this.renderImage(photos, post.caption);
                this.$photosContainer.append($html);
            }
        },
        renderImage: function(photos, caption) {
            return this.tmpl.render({
                // get alt_size of 400px width
                imgSrc: photos.alt_sizes[2].url,
                // escape html in caption
                imgName: $(caption).text()
            });
        }
    };

    photos.init();

});