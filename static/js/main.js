var clicked;
var clickedDefaults;
var layers = [];
var images = [];
var rotateAngles = [-6, 2, -2, 2, 4, -4, 4, -1];
var selected = [];
var original = [0, 1, 2, 3, 4, 5, 6, 7];
var polaroids = [];
var newButtons;
var texts = ["url('/static/images/Pinboard%20Assets/Text/the-shopaholic.png')",
    "url('/static/images/Pinboard%20Assets/Text/the-comedian.png')",
    "url('/static/images/Pinboard%20Assets/Text/the-sexy-one.png')",
    "url('/static/images/Pinboard%20Assets/Text/the-fashionista.png')",
    "url('/static/images/Pinboard%20Assets/Text/the-gorgeous.png')",
    "url('/static/images/Pinboard%20Assets/Text/miss-independent.png')",
    "url('/static/images/Pinboard%20Assets/Text/miss-sporty-and-sassy.png')",
    "url('/static/images/Pinboard%20Assets/Text/the-globetrotter.png')"];

var centres = [
    [77, 70],
    [79, 72],
    [88, 70],
    [87, 71],
    [83, 70],
    [84, 70],
    [75, 68],
    [75, 71]
];

$(document).ready(function () {
    var images = {
        'shopaholic': '/static/images/beneselfies-the-shopaholic-t.png',
        'comedian': '/static/images/beneselfies-the-comedian-t.png',
        'sexy': '/static/images/beneselfies-the-sexy-one-t.png',
        'fashionista': '/static/images/beneselfies-the-fashionista-t.png',
        'gorgeous': '/static/images/beneselfies-the-gorgeous-geek-t.png',
        'independent': '/static/images/beneselfies-miss-independent-t.png',
        'sporty': '/static/images/beneselfies-miss-sporty-and-sassy-t.png',
        'global': '/static/images/beneselfies-the-globetrotter-t.png'
    };


    var i = 0, imageCount = 8;
    var $wrap = $('#wrap').find('.polaroid');
    $.each(images, function (key, value) {
        var imageObj = new Image();
        imageObj.onload = function () {
            drawImage(this, key, this.i);
            if (i == imageCount) {
                // Absolute position the polaroids.
                $wrap.each(function (index, element) {
                    var d = rotateAngles[index];
                    $(this.children[0].children[0]).css({'-moz-transform': 'rotate(' + d + 'deg)',
                        '-webkit-transform': 'rotate(' + d + 'deg)',
                        '-o-transform': 'rotate(' + d + 'deg)',
                        '-ms-transform': 'rotate(' + d + 'deg)',
                        'transform': 'rotate(' + d + 'deg)'});
                });
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
                        $('#selected_bene').val(original[index]);
                        $('#select_text').css({'background': texts[original[index]]});
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
    $('#zoom').click(function () {
        var index = $('#selected_bene').val();
        $($wrap[original[index]]).trigger('click');
        $($wrap[original[index]]).show();
    });
});

function focusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#overlay').show();
    $('#select_phase').css({'margin-top': '-480px'});
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
    if (images[i]) {
        images[i].moveUp();
    }
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
    layers[i].parent.setWidth(480);
    layers[i].parent.setHeight(480);
    layers[i].parent.setScale(3, 3);
    var d = -rotateAngles[i];
    $(clicked).css({
            height: "480px",
            left: "110px",
            top: "-100px",
            width: "480px",
            '-moz-transform': 'rotate(' + d + 'deg)',
            '-webkit-transform': 'rotate(' + d + 'deg)',
            '-o-transform': 'rotate(' + d + 'deg)',
            '-ms-transform': 'rotate(' + d + 'deg)',
            'transform': 'rotate(' + d + 'deg)'}
    );
    if (!images[i]) {
        var rect = new Kinetic.Rect({
            x: centres[i][0] - 120 / (2),
            y: centres[i][1] - 120 / (2),
            width: 120,
            height: 120,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 0
        });

        layers[i].add(rect);
        rect.moveToBottom();
    }
    layers[i].parent.draw();
    // Create and show buttons for upload/done.
    newButtons = document.createElement('div');
    var newUpload = document.createElement('img');
    var newDone = document.createElement('img');
    newUpload.src = "/static/images/choose-big.png";
    newDone.src = "/static/images/done-big.png";
    $(newDone).css("margin-left", "10px");
    $(newButtons).addClass("buttons");
    $(newButtons).append(newUpload);
    $(newButtons).append(newDone);
    $(newDone).on('click', unFocusImage);
    $(newUpload).on('click', function () {
        fbphotoSelect(null);
    });
    $(clicked).append(newButtons);
    $(newButtons).css({'-moz-transform': 'rotate(' + -d + 'deg)',
        '-webkit-transform': 'rotate(' + -d + 'deg)',
        '-o-transform': 'rotate(' + -d + 'deg)',
        '-ms-transform': 'rotate(' + -d + 'deg)',
        'transform': 'rotate(' + -d + 'deg)'});
    $('#selected_opacity').show();
    return false;
}

function unFocusImage(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#overlay').hide();
    $(clicked).find(".tag").hide();
    // Remove buttons.
    $(clicked).find(".buttons").remove();
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
    var i = 0;
    $.each($wrap, function (index) {
        if ($wrap[index] == clicked)
            i = index;
    });
    layers[i].parent.setWidth(160);
    layers[i].parent.setHeight(160);
    layers[i].parent.setScale(1, 1);
    layers[i].parent.draw();
    if (images[i]) {
        images[i].moveDown();
    }
    var d = rotateAngles[i];
    $(clicked).css({
        height: clickedDefaults.height,
        left: clickedDefaults.left,
        top: clickedDefaults.top,
        width: clickedDefaults.width,
        '-moz-transform': 'rotate(' + d + 'deg)',
        '-webkit-transform': 'rotate(' + d + 'deg)',
        '-o-transform': 'rotate(' + d + 'deg)',
        '-ms-transform': 'rotate(' + d + 'deg)',
        'transform': 'rotate(' + d + 'deg)'});

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