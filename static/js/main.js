var clicked;
var clickedDefaults;
var layers = [];
var images = [];
var rotateAngles = [-6, 2, -2, 2, 4, -4, 4, -1];
var selected = [];
var polaroids = [];
var pins = [];
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
    [78, 0],
    [84, 0],
    [90, 0],
    [89, 0],
    [89, 0],
    [84, 0],
    [77, 0],
    [77, 0]
];

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
    var pins = {
        'shopaholic': '/static/images/Pinboard%20Assets/Pins/pin-01.png',
        'comedian': '/static/images/Pinboard%20Assets/Pins/pin-02.png',
        'sexy': '/static/images/Pinboard%20Assets/Pins/pin-03.png',
        'fashionista': '/static/images/Pinboard%20Assets/Pins/pin-04.png',
        'gorgeous': '/static/images/Pinboard%20Assets/Pins/pin-05.png',
        'independent': '/static/images/Pinboard%20Assets/Pins/pin-06.png',
        'sporty': '/static/images/Pinboard%20Assets/Pins/pin-07.png',
        'global': '/static/images/Pinboard%20Assets/Pins/pin-08.png'
    };


    var i = 0, imageCount = 8;
    var $wrap = $('#wrap').find('.polaroid');
    if ($wrap.length > 0) {
	    $.each(images, function (key, value) {
	        var imageObj = new Image();
	        imageObj.onload = function () {
	            drawImage(this, key, this.i);
	            var newPin = new Image();
	            newPin.onload = function () {
	                drawPin(this, this.key, this.i);
	            };
	            newPin.i = this.i;
	            newPin.key = key;
	            newPin.src = pins[key];
	            if (i == imageCount) {
	                // Absolute position the polaroids.
	                $wrap.each(function (index, element) {
	                    var d = rotateAngles[index];
	                    $(element).css({'-moz-transform': 'rotate(' + d + 'deg)',
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
	                        if (!choose) {
	                            $('#zoom').css({'opacity': 1});
	                            choose = true;
	                        }
	                        $('#selected_bene').val(index);
	                        $('#select_text').attr("src", texts[index]);
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
    $('.close, #login, #like-alternate, #zoom').on('mouseover', function() {
    	// Add -on at the end of the image (before the .png).
    	var src = $(this).attr('src');
    	if (src.indexOf("-on") == -1) {
	    	var addIndex = src.indexOf(".png");
	    	var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
	    	$(this).attr('src', newSrc);
    	}
    	// Check if background image is used.
    	var bgImage = $(this).css('backgroundImage');
    	if (bgImage.indexOf("-on") == -1) {
    		var addIndex = src.indexOf(".png");
	    	var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
	    	$(this).attr('src', newSrc);
    	}
    });
    $('.close, #login, #like-alternate, #zoom').on('mouseout', function() {
    	// Add -on at the end of the image (before the .png).
    	var src = $(this).attr('src');
    	if (src.indexOf("-on") != -1) {
	    	var addIndex = src.indexOf("-on");
	    	var newSrc = src.slice(0, addIndex) + src.slice(addIndex + 3, src.length);
	    	$(this).attr('src', newSrc);
    	}
    });
    $('.close, #login, #like-alternate, #zoom').on('click', function() {
    	// Add -on at the end of the image (before the .png).
    	var src = $(this).attr('src');
    	if (src.indexOf("-on") == -1) {
	    	var addIndex = src.indexOf(".png");
	    	var newSrc = src.slice(0, addIndex) + "-on" + src.slice(addIndex, src.length);
	    	$(this).attr('src', newSrc);
    	}
    });
    
    // Add slight movement to personality images on hover.
    $('#selects').find('img').each(function() {
    	$(this).on('mouseover', function() {
    		if ($(this).css("marginLeft") != "-20px") {
	    		$(this).css({
	    			marginLeft: "-10px"
	    		});
    		}
    	});
    	$(this).on('mouseout', function() {
    		if ($(this).css("marginLeft") != "-20px") {
	    		$(this).css({
	    			marginLeft: "0px"
	    		});
	    	}
    	});
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
    pins[i].hide();
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
            top: "-110px",
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
    newUpload.src = "/static/images/Pinboard%20Assets/Buttons/choose.png";
    newDone.src = "/static/images/Pinboard%20Assets/Buttons/done.png";
    $(newDone).css("margin-left", "10px");
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
    pins[i].show();

    var d = rotateAngles[i];
    layers[i].parent.setWidth(175);
    layers[i].parent.setHeight(175);
    layers[i].parent.setScale(1, 1);

    pins[i].moveToTop();
    layers[i].parent.draw();
    layers[i].draw();
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