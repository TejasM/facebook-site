var clicked;
var clickedDefaults;
var layers = [];

$(document).ready(function() {
    var images = {
        'shopaholic': '/static/images/The-Shopaholic-Transparent.png',
        'independent': '/static/images/Miss-Independent-Transparent.png',
        'sporty': '/static/images/Sporty-Girl-Transparent.png',
        'badgal': '/static/images/The-Bad-Gal-Transparent.png',
        'flirt': '/static/images/The-Flirt-Transparent.png',
        'gorgeous': '/static/images/The-Gorgeous-Geek-Transparent.png',
        'joker': '/static/images/The-Joker-Transparent.png',
        'sexy': '/static/images/The-Sexy-One-Transparent.png'
    };
    
    var i = 0, imageCount = 8;
    $.each(images, function(key, value) {
        var imageObj = new Image();
        imageObj.onload = function() {
            drawImage(this, key, i);
            ++i;
            if (i == imageCount) {
                // Absolute position the polaroids.
                var $wrap = $('#wrap').find('.polaroid');
                $wrap.each(function() {
                    $(this).css({
                        left: $(this).offset().left - $(this).parent().offset().left,
                        top: $(this).offset().top - $(this).parent().offset().top
                    });
                });
                $wrap.css({
                    position: "absolute"
                });
            }
        };
        imageObj.src = value;
    });
    
    $('#wrap').find('.polaroid').on('click', focusImage);
});

function focusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    var $wrap = $('#wrap').find('.polaroid');
    $wrap.off('click');
    clicked = this;
    clickedDefaults = {
        height: $(clicked).css("height"),
        left: $(clicked).css("left"),
        top: $(clicked).css("top"),
        width: $(clicked).css("width"),
        zIndex: $(clicked).css("zIndex")
    };
    // Fade out non-clicked poaroids.
    $wrap.each(function() {
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
        height: "790px",
        left: "145px",
        top: "140px",
        width: "720px"
    }, {
        duration: 1000,
        complete: function() {
            // Create and show buttons for upload/done.
            var newButtons = document.createElement('div');
            var newUpload = document.createElement('img');
            var newDone = document.createElement('img');
            newUpload.src = "/static/images/Upload-Black.png";
            newDone.src = "/static/images/Done-Black.png";
            $(newButtons).addClass("buttons");
            $(newButtons).append(newUpload);
            $(newButtons).append(newDone);
            $(newDone).on('click', unFocusImage);
            $(newUpload).on('click', function() {
                $('#upload-div').dialog('open');
            });
            $(clicked).append(newButtons);
        }
    });
    return false;
}

function unFocusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    // Remove buttons.
    $(clicked).find(".buttons").remove();
    // Fade in all polaroids again.
    $('#wrap').find('.polaroid').each(function() {
        if (this != clicked) {
            $(this).animate({
                opacity: "1"
            }, 1000);
        }
    });
    $(clicked).animate({
        height: clickedDefaults.height,
        left: clickedDefaults.left,
        top: clickedDefaults.top,
        width: clickedDefaults.width
    }, {
        duration: 1000,
        complete: function() {
            $(clicked).css({
                zIndex: clickedDefaults.zIndex
            });
            $('#wrap').find('.polaroid').on('click', focusImage);
        }
    });
    return false;
}