"use strict";

function thumblrCallback() {}

$(function() {

    var photos = {
        weekPicTmlp: $.templates('#picOfTheWeekTmpl'),
        simpleTmpl: $.templates("#picTmpl"),
        $weekpicContainer: $('#weekpicContainer'),
        $photosContainer: $('#photosContainer'),
        init: function() {
            // Request to Thumblr server need to be send in jsonp format, so we need to provide a callback in window object
            // then we set this callback to local func to work with local env
            thumblrCallback = this.thumblrCallback.bind(this);
            this.sendRequest();
            this.bindEvents();
        },
        bindEvents: function() {
            $('#bioLink').fancybox({
                maxWidth: 800
            });
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
                    var type = i == 0? 'weekpic' : 'simple';
                    this.createImage(post, type);
                }
            }
            this.initFancyBoxes();
        },
        createImage: function(post, type) {
            for (var i = 0; i < post.photos.length; i++) {
                var photos = post.photos[i];
                var caption = this.stripGarbage(post.caption);
                var captionObj = this.getJSONFromStr(caption);
                var $html = this.renderImage(type, photos, captionObj);
                if (type == 'weekpic') {
                    this.$weekpicContainer.html($html);
                }
                else if (type == 'simple') {
                    this.$photosContainer.append($html);
                }
            }
        },
        renderImage: function(type, photos, captionObj) {
            var data = {
                title       : captionObj.title || 'none',
                size        : captionObj.size  || 'none',
                price       : captionObj.price || 'none',
                date        : captionObj.date  || 'none',
                description : captionObj.description || 'none',
                sold        : captionObj.sold || 'none'
            };
            if (type == 'weekpic') {
                return this.weekPicTmlp.render($.extend(data, {
                    // get original size
                    imgSrc: photos.original_size.url
                }));
            }
            else if (type == 'simple') {
                return this.simpleTmpl.render($.extend(data,{
                    // get alt_size of 400px width
                    imgSrc: photos.alt_sizes[2].url,
                    imgSrcOrig: photos.original_size.url
                }));
            }
            return '';
        },
        initFancyBoxes: function() {
            this.$photosContainer.find('.js-show-popup').each(function() {
                var $this = $(this);
                $this.fancybox({
                    helpers		: {
                        title	: { type : 'inside' },
                        buttons	: {}
                    },
                    beforeLoad: function() {
                        this.title = $this.next('.js-image-content').html()
                    }
                });
            });
            this.$weekpicContainer.find('.js-show-popup').each(function() {
                var $this = $(this);
                $this.fancybox({
                    helpers		: {
                        title	: { type : 'inside' },
                        buttons	: {}
                    },
                    beforeLoad: function() {
                        this.title = $this.next('.js-image-content').html()
                    }
                });
            });
        },
        stripGarbage: function(str) {
            var caption = $(str).text();
            // get rid of non-english quotes and make all quotes double quotes
            return caption.replace(/\“/g, "\"").replace(/\”/g, "\"").replace(/\'/g, "\"");
        },
        getJSONFromStr: function(str) {
            var obj = {};
            try {
                obj = JSON.parse(str);
            }
            catch (err) {
                console.log('Error parsing string', str, err);
            }
            return obj;
        }
    };

    photos.init();

});