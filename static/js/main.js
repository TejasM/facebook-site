var clicked;
var clickedDefaults;
var layers = [];

$(document).ready(function () {
    var images = {
        'global': '/static/images/beneselfies-the-globetrotter-t.png',
        'gorgeous': '/static/images/beneselfies-the-gorgeous-geek-t.png',
        'fashionista': '/static/images/beneselfies-the-fashionista-t.png',
        'shopaholic': '/static/images/beneselfies-the-shopaholic-t.png',
        'middle_logo': '/static/images/benefit-button.png',
        'independent': '/static/images/beneselfies-miss-independent-t.png',
        'sporty': '/static/images/beneselfies-miss-sporty-and-sassy-t.png',
        'comedian': '/static/images/beneselfies-the-comedian-t.png',
        'sexy': '/static/images/beneselfies-the-sexy-one-t.png'
    };

    var i = 0, imageCount = 9;
    $.each(images, function (key, value) {
        var imageObj = new Image();
        imageObj.onload = function () {
            if (this.i != 4) {
                drawImage(this, key, this.i);
            } else {
                var $middle = $("#" + key).parent();
                $middle.css("background", "url('" + images[key] + "') no-repeat");
                $middle.css("background-position", "center");
            }
            if (i == imageCount) {
                // Absolute position the polaroids.
                var $wrap = $('#wrap').find('.polaroid');
                $wrap.each(function () {
                    $(this).css({
                        left: $(this).offset().left - $(this).parent().parent().offset().left,
                        top: $(this).offset().top - $(this).parent().parent().offset().top
                    });
                });
                $wrap.css({
                    position: "absolute"
                });
            }
        };
        imageObj.i = i;
        imageObj.src = value;
        ++i;
    });

    $('#wrap').find('.polaroid').each(function (index, element) {
        if (index != 4) {
            $(this).on('click', focusImage);
        }
    });
});

function focusImage(event) {
    event.preventDefault();
    event.stopPropagation();
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
    var i = 0;
    $.each($wrap, function (index) {
        if ($wrap[index] == clicked)
            i = index;
    });
    var duration = 1000; // we set it to last 1s
    var anim = new Kinetic.Animation(function (frame) {
            if (frame.time >= duration) {
                anim.stop();
            } else {
                layers[i].parent.setWidth((600 - 192) * frame.time / duration + 192);
                layers[i].parent.setHeight((600 - 192) * frame.time / duration + 192);
                layers[i].parent.setScale((3.125 - 1) * frame.time / duration + 1, (3.125 - 1) * frame.time / duration + 1);
            }
        },
        layers[i].parent
    );
    anim.start();
    // Fade out non-clicked polaroids.
    $wrap.each(function () {
        if (this != clicked) {
            $(this).animate({
                opacity: "0.2"
            }, 1000);
        }
    });
    $(clicked).css({
        zIndex: 10
    });
    $(clicked).animate({
        height: "600px",
        left: "60px",
        top: "220px",
        width: "600px"
    }, {
        duration: 1000,
        complete: function () {
            // Create and show buttons for upload/done.
            var newButtons = document.createElement('div');
            var newUpload = document.createElement('img');
            var newDone = document.createElement('img');
            newUpload.src = "/static/images/upload.png";
            newDone.src = "/static/images/done.png";
            $(newDone).css("margin-left", "10px");
            $(newButtons).addClass("buttons");
            $(newButtons).append(newUpload);
            $(newButtons).append(newDone);
            $(newDone).on('click', unFocusImage);
            $(newUpload).on('click', function () {
                fbphotoSelect(null);
            });
            $(clicked).prepend(newButtons);
        }
    });
    return false;
}

function unFocusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    $(clicked).find(".tag").hide();
    // Remove buttons.
    $(clicked).find(".buttons").remove();
    // Fade in all polaroids again.
    var $wrap = $('#wrap').find('.polaroid');
    $('#wrap').find('.polaroid').each(function () {
        if (this != clicked) {
            $(this).animate({
                opacity: "1"
            }, 1000);
        }
    });
    var i = 0;
    $.each($wrap, function (index) {
        if ($wrap[index] == clicked)
            i = index;
    });
    var duration = 1000; // we set it to last 1s
    var anim = new Kinetic.Animation(function (frame) {
            if (frame.time >= duration) {
                anim.stop();
            } else {
                layers[i].parent.setWidth((600 - 192) * (1- frame.time / duration) + 192);
                layers[i].parent.setHeight((600 - 192) * (1- frame.time / duration) + 192);
                layers[i].parent.setScale((3.125 - 1) * (1- frame.time / duration)+ 1, (3.125 - 1) * (1- frame.time / duration) + 1);
            }
        },
        layers[i].parent
    );
    anim.start();


    $(clicked).animate({
        height: clickedDefaults.height,
        left: clickedDefaults.left,
        top: clickedDefaults.top,
        width: clickedDefaults.width
    }, {
        duration: 1000,
        complete: function () {
            $(clicked).css({
                zIndex: clickedDefaults.zIndex
            });
            $('#wrap').find('.polaroid').each(function (index, element) {
                if (index != 4) {
                    $(this).on('click', focusImage);
                }
            });
            $('#next').show();
        }
    });
    return false;
}