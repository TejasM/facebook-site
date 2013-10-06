var clicked;
var clickedDefaults;
var layers = [];
var images = [];
var rotateAngles = [-4, 3, -3, 5, 5, -3, 4, -3];
var selected = [];
var polaroids = [];
var rects = [];
var image_urls = [];
var tag_positions = [
    [17.50, 40.00],
    [40.13, 40.17],
    [61.25, 40.00],
    [81.88, 40.50],
    [18.75, 71.00],
    [40.38, 70.83],
    [56.00, 70.50],
    [81.88, 71.00]
];

var bene_positions = [
    [135, 240],
    [315, 240],
    [485, 240],
    [650, 240],
    [135, 425],
    [315, 425],
    [490, 425],
    [650, 425]
];

//Miss Independent	315	425
//Miss Sporty and Sassy	135	425
//The Comedian	650	240
//The Fashionista	315	240
//The Globetrotter	485	240
//The Gorgeous Geek	135	240
//The Sexy One	650	425
//The Shopaholic	490	425


var image_poss = [];
var newButtons;
var texts = ["/static/images/Pinboard%20Assets/Text/the-shopaholic.png",
    "/static/images/Pinboard%20Assets/Text/the-comedian.png",
    "/static/images/Pinboard%20Assets/Text/the-sexy-one.png",
    "/static/images/Pinboard%20Assets/Text/the-fashionista.png",
    "/static/images/Pinboard%20Assets/Text/the-gorgeous.png",
    "/static/images/Pinboard%20Assets/Text/miss-independent.png",
    "/static/images/Pinboard%20Assets/Text/miss-sporty-and-sassy.png",
    "/static/images/Pinboard%20Assets/Text/the-globetrotter.png"];

var done_labels = ["/static/images/Pinboard%20Assets/Beneselfie%20Labels/shopaholic-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/comedian-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/sexy-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/fashionista-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/geek-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/independent-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/sporty-b.png",
    "/static/images/Pinboard%20Assets/Beneselfie%20Labels/globetrotter-b.png"];

var descriptions = ['/static/images/ZoomedPolaroidDescriptions/polaroid-text-the-shopaholic.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-the-comedian.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-the-sexy-one.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-the-fashionista.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-the-gorgeous-geek.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-miss-independent.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-miss-sporty-and-sassy.png',
    '/static/images/ZoomedPolaroidDescriptions/polaroid-text-the-globetrotter.png'
];

var heads = ["/static/images/Pinboard%20Assets/Heads/head-shopaholic.png",
    "/static/images/Pinboard%20Assets/Heads/head-comedian.png",
    "/static/images/Pinboard%20Assets/Heads/head-sexy.png",
    "/static/images/Pinboard%20Assets/Heads/head-fashionista.png",
    "/static/images/Pinboard%20Assets/Heads/head-geek.png",
    "/static/images/Pinboard%20Assets/Heads/head-independent.png",
    "/static/images/Pinboard%20Assets/Heads/head-sporty.png",
    "/static/images/Pinboard%20Assets/Heads/head-globetrotter.png"];


var centres = [
    [83, 77],
    [86, 78],
    [96, 75],
    [95, 78],
    [91, 76],
    [91, 76],
    [81, 74],
    [82, 77]
];

var pin_locations = [
    [130, 147],
    [315, 145],
    [465, 136],
    [645, 142],
    [130, 325],
    [315, 325],
    [465, 338],
    [645, 335]
];

var images_polar = [
    '/static/images/Beneselfies/beneselfies-the-shopaholic-t.png',
    '/static/images/Beneselfies/beneselfies-the-comedian-t.png',
    '/static/images/Beneselfies/beneselfies-the-sexy-one-t.png',
    '/static/images/Beneselfies/beneselfies-the-fashionista-t.png',
    '/static/images/Beneselfies/beneselfies-the-gorgeous-geek-t.png',
    '/static/images/Beneselfies/beneselfies-miss-independent-t.png',
    '/static/images/Beneselfies/beneselfies-miss-sporty-and-sassy-t.png',
    '/static/images/Beneselfies/beneselfies-the-globetrotter-t.png'
];

var pins_src = [
    "/static/images/Pinboard%20Assets/Pins/pin-06.png",
    "/static/images/Pinboard%20Assets/Pins/pin-04.png",
    "/static/images/Pinboard%20Assets/Pins/pin-05.png",
    "/static/images/Pinboard%20Assets/Pins/pin-03.png",
    "/static/images/Pinboard%20Assets/Pins/pin-02.png",
    "/static/images/Pinboard%20Assets/Pins/pin-01.png",
    "/static/images/Pinboard%20Assets/Pins/pin-08.png",
    "/static/images/Pinboard%20Assets/Pins/pin-07.png"];

var choose = false;

$(document).ready(function () {
    var images = {
        'shopaholic': '/static/images/Beneselfies/beneselfies-the-shopaholic-t.png',
        'comedian': '/static/images/Beneselfies/beneselfies-the-comedian-t.png',
        'sexy': '/static/images/Beneselfies/beneselfies-the-sexy-one-t.png',
        'fashionista': '/static/images/Beneselfies/beneselfies-the-fashionista-t.png',
        'gorgeous': '/static/images/Beneselfies/beneselfies-the-gorgeous-geek-t.png',
        'independent': '/static/images/Beneselfies/beneselfies-miss-independent-t.png',
        'sporty': '/static/images/Beneselfies/beneselfies-miss-sporty-and-sassy-t.png',
        'global': '/static/images/Beneselfies/beneselfies-the-globetrotter-t.png'
    };

    // Preload button images.
    var preloadbuttons = [
        "/static/images/Pinboard Assets/Buttons/back.png",
        "/static/images/Pinboard Assets/Buttons/back-on.png",
        "/static/images/Pinboard Assets/Buttons/select-friend.png",
        "/static/images/Pinboard Assets/Buttons/select-friend-on.png",
        "/static/images/Pinboard Assets/Buttons/done.png",
        "/static/images/Pinboard Assets/Buttons/done-on.png",
        "/static/images/Pinboard Assets/Buttons/like.png",
        "/static/images/Pinboard Assets/Buttons/like-on.png",
        "/static/images/Pinboard Assets/Buttons/no.png",
        "/static/images/Pinboard Assets/Buttons/no-on.png",
        "/static/images/Pinboard Assets/Buttons/okay.png",
        "/static/images/Pinboard Assets/Buttons/okay-on.png",
        "/static/images/Pinboard Assets/Buttons/preview.png",
        "/static/images/Pinboard Assets/Buttons/preview-on.png",
        "/static/images/Pinboard Assets/Buttons/share.png",
        "/static/images/Pinboard Assets/Buttons/share-on.png",
        "/static/images/Pinboard Assets/Buttons/view.png",
        "/static/images/Pinboard Assets/Buttons/view-on.png",
        "/static/images/Pinboard Assets/Buttons/yes.png",
        "/static/images/Pinboard Assets/Buttons/yes-on.png"
    ];
    $(preloadbuttons).each(function () {
        $.ajax({
            url: this.toString()
        });
    });

    var i = 0, imageCount = 8;
    var $wrap = $('#wrap').find('.polaroid');
    if ($wrap.length > 0) {
        $.each(images, function (key, value) {
            var imageObj = new Image();
            imageObj.onload = function () {
                drawImage(this, key, this.i);
                if (i == imageCount) {
                    // Absolute position the polaroids.
                    var $selects = $('#selects').find('.selects');
                    $selects.each(function () {
                        $(this).click(function () {
                            var index = 0;
                            for (var i = 0; i < $selects.length; i++) {
                                if (this == $selects[i]) {
                                    index = i;
                                } else {
                                    $($selects[i]).css('margin-left', '0px');
                                }
                            }
                            $(this).css('margin-left', '-20px');
                            if (!choose) {
                                $('#zoom').css({'opacity': 1});
                                choose = true;
                            }
                            $('#selected_bene').val(index);
                            $('#select_text').attr("src", texts[index]);
                            $('#head').attr("src", heads[index]);
                        });
                    });
                }
            };
            imageObj.i = i;
            imageObj.src = value;
            ++i;
        });

        $wrap.each(function (index, element) {
            $(this).on('click', focusImage);
            $(this).hide();
        });
        var $zoom = $('#zoom');
        $zoom.css({'opacity': 0});
        $zoom.click(function () {
            var index = $('#selected_bene').val();
            var $bene = $("#" + index.toString());
            $bene.trigger('click');
            $bene.show();
        });
    }

    // Add hove/click/active button images.
    $('.close, #login, #like-alternate, #zoom, #next, #back, #share, #btn_choose, #btn_done, #okay_fine img, #post, #close, #view, #okay, #terms-and-conditions-popup-button, #yes_sure, #no_back, .okay-buttons img, #yes_tags, #no_tags, #ie-warning-popup-button, #prizes-popup-button, #prizes-button').on('mouseover', function () {
        // Add -on at the end of the image (before the .png).
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != false) {
            if ($(this).attr('src').indexOf("-on")) {
                var src = $(this).attr('src');
                var addIndex = src.indexOf(".png");
                var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
                $(this).attr('src', newSrc);
            }
        }
        // Check if background image is used.
        if ($(this).css('backgroundImage').length > 0 && $(this).css('backgroundImage').indexOf("-on") == -1) {
            var bgImage = $(this).css('backgroundImage');
            var addIndex = bgImage.indexOf(".png");
            var newSrc = bgImage.slice(0, addIndex) + "-on" + bgImage.slice(addIndex, bgImage.length);
            $(this).css({
                'backgroundImage': newSrc
            });
        }
    });
    $('.close, #login, #like-alternate, #zoom, #next, #back, #share, #btn_choose, #btn_done, #okay_fine img, #post, #close, #view, #okay, #terms-and-conditions-popup-button, #yes_sure, #no_back, .okay-buttons img, #yes_tags, #no_tags, #ie-warning-popup-button, #prizes-popup-button, #prizes-button').on('mouseout', function () {
        // Add -on at the end of the image (before the .png).
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != false) {
            if ($(this).attr('src').indexOf("-on") != -1) {
                var src = $(this).attr('src');
                var addIndex = src.indexOf("-on");
                var newSrc = src.slice(0, addIndex) + src.slice(addIndex + 3, src.length);
                $(this).attr('src', newSrc);
            }
        }
        // Check if background image is used.
        if ($(this).css('backgroundImage').length > 0 && $(this).css('backgroundImage').indexOf("-on") != -1) {
            var bgImage = $(this).css('backgroundImage');
            var addIndex = bgImage.indexOf("-on");
            var newSrc = bgImage.slice(0, addIndex) + bgImage.slice(addIndex + 3, bgImage.length);
            $(this).css({
                'backgroundImage': newSrc
            });
        }
    });
    $('.close, #login, #like-alternate, #zoom, #next, #back, #share, #btn_choose, #btn_done, #okay_fine img, #post, #close, #view, #okay, #terms-and-conditions-popup-button, #yes_sure, #no_back, .okay-buttons img, #yes_tags, #no_tags, #ie-warning-popup-button, #prizes-popup-button, #prizes-button').on('click', function () {
        // Add -on at the end of the image (before the .png).
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != false) {
            if ($(this).attr('src').indexOf("-on") == -1) {
                var src = $(this).attr('src');
                var addIndex = src.indexOf(".png");
                var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
                $(this).attr('src', newSrc);
            }
        }
        // Check if background image is used.
        if ($(this).css('backgroundImage').length > 0 && $(this).css('backgroundImage').indexOf("-on") == -1) {
            var bgImage = $(this).css('backgroundImage');
            var addIndex = bgImage.indexOf(".png");
            var newSrc = bgImage.slice(0, addIndex) + "-on" + bgImage.slice(addIndex, bgImage.length);
            $(this).css({
                'backgroundImage': newSrc
            });
        }
    });

    // Add slight movement to personality images on hover.
    $('#selects').find('img').each(function () {
        $(this).on('mouseover', function () {
            if ($(this).css("marginLeft") != "-20px") {
                $(this).css({
                    marginLeft: "-10px"
                });
            }
        });
        $(this).on('mouseout', function () {
            if ($(this).css("marginLeft") != "-20px") {
                $(this).css({
                    marginLeft: "0px"
                });
            }
        });
    });

    // Add terms and conditions pop-up.
    $('.terms-check a').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        $('#terms-and-conditions-popup').show();

        return false;
    });
    $('#terms-and-conditions-popup-button').on('click', function () {
        $('#terms-and-conditions-popup').hide();
    });

    // Add prizes pop-up.
    $('#prizes-button').on('click', function (event) {
        $('#prizes-popup').show();
    });
    $('#prizes-popup-button').on('click', function () {
        $('#prizes-popup').hide();
    });

    // IE Warning popup.
    $('#ie-warning-popup-button').on('click', function () {
        $('#ie-warning').hide();
    });
});

function focusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#overlay').show();
    $('#next').hide();
    var $wrap = $('#wrap').find('.polaroid');
    $wrap.off('click');
    clicked = this;
    $(clicked).find(".tag").show();
    clickedDefaults = {
        height: $(clicked).css("height"),
        left: $(clicked).css("left"),
        top: $(clicked).css("top"),
        width: $(clicked).css("width"),
        zIndex: $(clicked).css("zIndex")
    };
    var i = parseInt($(clicked).attr('id'));
    // Fade out non-clicked polaroids.
    $wrap.each(function () {
        if (this != clicked) {
            $(this).css({
                opacity: "0.2"
            });
        }
    });
    $(clicked).css({
        zIndex: 10
    });
    layers[i].parent.setWidth(437.5);
    layers[i].parent.setHeight(437.5);
    layers[i].parent.setScale(2.5, 2.5);
    var d = -rotateAngles[i];
    $(clicked).css({
            height: "437.5px",
            textAlign: "center",
            top: "-135px",
            width: "100%",
            '-moz-transform': 'rotate(' + 0 + 'deg)',
            '-webkit-transform': 'rotate(' + 0 + 'deg)',
            '-o-transform': 'rotate(' + 0 + 'deg)',
            '-ms-transform': 'rotate(' + 0 + 'deg)',
            'transform': 'rotate(' + 0 + 'deg)'}
    );
    if (!images[i]) {
        var rect = new Kinetic.Rect({
            x: centres[i][0] - 130 / (2),
            y: centres[i][1] - 130 / (2),
            width: 130,
            height: 130,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 0
        });
        rects[i] = rect;
        layers[i].add(rect);
        rect.moveToBottom();
    }
    layers[i].parent.draw();
    var newDescription = document.createElement('img');
    var newDescriptionDiv = document.createElement('div');
    $(newDescriptionDiv).addClass('descript');
    $(newDescriptionDiv).append(newDescription);
    newDescription.src = descriptions[i];

    // Create and show buttons for upload/done.
    newButtons = document.createElement('div');
    var newUpload = document.createElement('img');
    var newDone = document.createElement('img');
    newUpload.src = "/static/images/Pinboard%20Assets/Buttons/select-friend.png";
    newDone.src = "/static/images/Pinboard%20Assets/Buttons/done.png";
    $(newDone).css("margin-left", "10px");
    $(newDone).attr('id', "btn_done");
    $(newUpload).attr('id', "btn_choose");
    $(newButtons).addClass("buttons");
    $(newButtons).append(newUpload);
    $(newButtons).append(newDone);
    $(newDone).on('click', unFocusImage);
    $(newUpload).on('click', function () {
        fbphotoSelect(null);
    });
    $(clicked).prepend(newDescriptionDiv);
    $(clicked).append(newButtons);
    $(clicked).find('.tags_in').show();
    $('#selected_opacity').show();

    // Add hove/click/active button images.
    $('#btn_choose, #btn_done').on('mouseover', function () {
        // Add -on at the end of the image (before the .png).
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != false) {
            if ($(this).attr('src').indexOf("-on")) {
                var src = $(this).attr('src');
                var addIndex = src.indexOf(".png");
                var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
                $(this).attr('src', newSrc);
            }
        }
        // Check if background image is used.
        if ($(this).css('backgroundImage').length > 0 && $(this).css('backgroundImage').indexOf("-on") == -1) {
            var bgImage = $(this).css('backgroundImage');
            var addIndex = bgImage.indexOf(".png");
            var newSrc = bgImage.slice(0, addIndex) + "-on" + bgImage.slice(addIndex, bgImage.length);
            $(this).css({
                'backgroundImage': newSrc
            });
        }
    });
    $('#btn_choose, #btn_done').on('mouseout', function () {
        // Add -on at the end of the image (before the .png).
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != false) {
            if ($(this).attr('src').indexOf("-on") != -1) {
                var src = $(this).attr('src');
                var addIndex = src.indexOf("-on");
                var newSrc = src.slice(0, addIndex) + src.slice(addIndex + 3, src.length);
                $(this).attr('src', newSrc);
            }
        }
        // Check if background image is used.
        if ($(this).css('backgroundImage').length > 0 && $(this).css('backgroundImage').indexOf("-on") != -1) {
            var bgImage = $(this).css('backgroundImage');
            var addIndex = bgImage.indexOf("-on");
            var newSrc = bgImage.slice(0, addIndex) + bgImage.slice(addIndex + 3, bgImage.length);
            $(this).css({
                'backgroundImage': newSrc
            });
        }
    });
    $('#btn_choose, #btn_done').on('click', function () {
        // Add -on at the end of the image (before the .png).
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != false) {
            if ($(this).attr('src').indexOf("-on") == -1) {
                var src = $(this).attr('src');
                var addIndex = src.indexOf(".png");
                var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
                $(this).attr('src', newSrc);
            }
        }
        // Check if background image is used.
        if ($(this).css('backgroundImage').length > 0 && $(this).css('backgroundImage').indexOf("-on") == -1) {
            var bgImage = $(this).css('backgroundImage');
            var addIndex = bgImage.indexOf(".png");
            var newSrc = bgImage.slice(0, addIndex) + "-on" + bgImage.slice(addIndex, bgImage.length);
            $(this).css({
                'backgroundImage': newSrc
            });
        }
    });

    return false;
}

function unFocusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#overlay').hide();
    $(clicked).find('.tags_in').hide();
    $(clicked).find(".tag").hide();
    // Remove buttons.
    $(clicked).find(".buttons").remove();
    $(clicked).find('.descript').remove();
    // Fade in all polaroids again.
    var $wrap2 = $('#wrap');
    var $wrap = $wrap2.find('.polaroid');
    $('#select_phase').css({'margin-top': '0px'});
    $wrap.each(function () {
        if (this != clicked) {
            $(this).css({
                opacity: "1"
            });
        }
    });
    var i = parseInt($(clicked).attr('id'));

    var d = rotateAngles[i];
    layers[i].parent.setWidth(175);
    layers[i].parent.setHeight(175);
    layers[i].parent.setScale(1, 1);

    layers[i].parent.draw();
    layers[i].draw();
    $(clicked).css({
        height: clickedDefaults.height,
        left: clickedDefaults.left,
        top: clickedDefaults.top,
        width: clickedDefaults.width});

    $(clicked).css({
        zIndex: clickedDefaults.zIndex
    });
    $(clicked).hide();
    $wrap2.find('.polaroid').each(function (index, element) {
        $(this).on('click', focusImage);
    });
    $('#selected_opacity').hide();
    $('#next').show();
    return false;
}