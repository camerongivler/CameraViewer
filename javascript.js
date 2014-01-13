function adjustor(name, side) {
    var turn = name.charAt(0);
    this.side = side;
    this.prevMargin = -155;
    this.prevPos = 4;
    this.auto = 'a'; // a = auto, t = tap to focus, l = locked, c = drag closed (can't focus), m = manual
    this.adj = $('#' + name);
    this.text = $('#' + turn + 'Text');
    this.pos = $('#' + turn + 'Pos');
    this.slide = $('#' + turn + 'Slide');
    this.slider = $('#' + turn + 'Slider');
    this.pull = $('#' + turn + 'Pull');
    this.other = null;
    this.value = 0;

    var o = this;
    this.init = function() {
        this.pos.hammer().on('drag', function(ev) {
            if (ev.gesture.center.pageX > bgPos.left && ev.gesture.center.pageX < bgPos.left + bgPos.width)
                FEPos.pos.css({'left': ev.gesture.center.pageX + 'px'});
            if (ev.gesture.center.pageY > bgPos.top && ev.gesture.center.pageY < bgPos.top + bgPos.height)
                FEPos.pos.css({'top': ev.gesture.center.pageY + 'px'});
        });

        this.adj.hammer().on('drag', function(ev) {
            var deltaX = ev.gesture.deltaX;
            if (o.side === 'right')
                deltaX = -ev.gesture.deltaX;

            if (o.prevMargin + deltaX <= 0 && o.prevMargin + deltaX >= -155)
                o.adj.css(o.side, o.prevMargin + deltaX + "px");
            else if (o.prevMargin + deltaX > 0)
                o.adj.css(o.side, '0px');
            else
                o.adj.css(o.side, '-155px');
        });

        this.pull.hammer().on('tap', function(ev) {
            if (o.prevMargin === 0) {
                ev.gesture.preventDefault();
                ev.stopPropagation();
                var temp = {};
                temp[o.side] = '-155px';
                o.adj.animate(temp, 'fast');
                o.prevMargin = -155;
                animating = true;
                o.pos.animate({opacity: 0}, {queue: false, duration: 500, complete: function() {
                        animating = false;
                    }});
                if (o.auto === 't')
                    o.auto = 'c';
            }
        });

        this.adj.hammer().on('tap', function() {
            if (o.prevMargin === -155) {
                if (o.auto === 'c')
                    o.auto = 't';
                var temp = {};
                temp[o.side] = '0px';
                o.adj.animate(temp, 'fast');
                o.prevMargin = 0;
                if (o.auto === 't' || o.auto === 'l') {
                    animating = true;
                    o.pos.animate({opacity: 1}, {queue: false, duration: 500, complete: function() {
                            animating = false;
                        }});
                }
            } else if (o.auto !== 't') {
                animating = true;
                o.slide.animate({opacity: 0.2}, {queue: false});
                o.text.animate({opacity: 0}, {queue: false, duration: 150, complete: function() {
                        if (o.other === f)
                            $(this).css({color: 'red'});
                        $(this).text('Tap Now').animate({opacity: 1}, {queue: false, duration: 150});
                    }});
                o.pos.css({'z-index': '100'});
                if (o.auto === 'l')
                    o.pos.animate({'height': '104px', 'top': o.pos.position().top - 19 + 'px', 'left': o.pos.position().left - 19 + 'px'}, 300, function() {
                        $(this).animate({'height': '66px', 'top': $(this).position().top + 19 + 'px', 'left': $(this).position().left + 19 + 'px'}, 300, function() {
                            animating = false;
                        });
                    });
                else
                    o.pos.animate({opacity: 1}, {queue: false, duration: 500, complete: function() {
                            animating = false;
                        }});
                o.other.pos.css('z-index', '99');
                if (o.other.auto === 't' || o.other.auto === 'c') {
                    o.other.text.animate({opacity: 0}, {queue: false, duration: 150, complete: function() {
                            $(this).text('Locked').animate({opacity: 1}, {queue: false, duration: 150});
                        }});
                    o.other.auto = 'l';
                }
                o.auto = 't';
                FEPos = o;
            } else {
                animating = true;
                o.auto = 'a';
                o.text.animate({opacity: 0}, {queue: false, duration: 150, complete: function() {
                        $(this).css({color: 'black'});
                        $(this).text('Auto').animate({opacity: 1}, {queue: false, duration: 150});
                    }});
                o.pos.animate({opacity: 0}, {queue: false, duration: 500, complete: function() {
                        animating = false;
                    }});
                FEPos = null;
            }
        });

        this.adj.hammer().on('dragend', function(ev) {
            var deltaX = ev.gesture.deltaX;
            if (o.side === 'right')
                deltaX = -ev.gesture.deltaX;

            if (o.prevMargin + deltaX > -77) {
                if (o.auto === 'c')
                    o.auto = 't';
                var temp = {};
                temp[o.side] = '0px';
                animating = true;
                o.prevMargin = 0;
                o.adj.animate(temp, 'fast', function() {
                    if (o.auto !== 't' && o.auto !== 'l')
                        animating = false;
                });
                if (o.auto === 't' || o.auto === 'l') {
                    o.pos.animate({opacity: 1}, {queue: false, duration: 500, complete: function() {
                            animating = false;
                        }});
                }
            } else {
                var temp = {};
                temp[o.side] = '-155px';
                o.adj.animate(temp, 'fast');
                o.prevMargin = -155;
                animating = true;
                o.pos.animate({opacity: 0}, {queue: false, duration: 500, complete: function() {
                        animating = false;
                    }});
                if (o.auto === 't')
                    o.auto = 'c';
            }
        });

        this.slider.hammer({drag_min_distance: 0}).on('touch', function(ev) {
            ev.gesture.preventDefault();
            ev.stopPropagation();
            if (o.auto === 'm')
                return;
            o.auto = 'm';
            animating = true;
            o.text.animate({opacity: 0}, {queue: false, duration: 150, complete: function() {
                    $(this).css({color: 'black'});
                    $(this).text('Manual').animate({opacity: 1}, {queue: false, duration: 150});
                }});
            o.slide.animate({opacity: 0.75}, {queue: false});
            o.pos.animate({opacity: 0}, {queue: false, duration: 500, complete: function() {
                    animating = false;
                }});
        });

        this.slider.hammer().on('drag', function(ev) {
            ev.gesture.preventDefault();
            ev.stopPropagation();
            var x, y;
            y = o.prevPos + ev.gesture.deltaY;
            if (y < 4)
                y = 4;
            else if (y > 317)
                y = 317;
            x = Math.sqrt(28000 - Math.pow(y - 160.5, 2)) - 48;
            if (x < 4)
                x = 4;
            var temp = {};
            temp[o.side] = x;
            temp['top'] = y;
            o.slider.css(temp);

            o.value = (y - 4) / 3.17;
        });

        this.slider.hammer().on('dragend tap', function(ev) {
            ev.gesture.preventDefault();
            ev.stopPropagation();
            o.prevPos += ev.gesture.deltaY;
            if (o.prevPos < 4)
                o.prevPos = 4;
            else if (o.prevPos > 317)
                o.prevPos = 317;

            o.value = (o.prevPos - 4) / 3.17;
        });
    };
}

var e, f, FEPos = null, x = 0, animating = false, ratio, socket, background, temp,
        shutter, zoom, bgPos = {}, numTouches = 0, scale = 1, MAX_SCALE = 10,
        MIN_SCALE = 0.1, thumb;

$(document).ready(function() {
    background = $('#background');
    shutter = $('#shutter');
    zoom = $('#zSlider');
    if (is_touch_device())
        zoom.hide();
    zoom1 = $('#zSlide1');
    zoom2 = $('#zSlide2');
    thumb = {
        img: $('#thumb'),
        disp: $('#disp'),
        imgLeft: 20,
        imgTop: 20,
        dispLeft: 20,
        dispTop: 20,
        imgWidth: 100,
        imgHeight: 100,
        dispWidth: 100,
        dispHeight: 100
    };
    bgPos = {
        left: 0,
        prevLeft: 0,
        top: 0,
        prevTop: 0,
        width: 640,
        height: 360,
        origX: 0,
        origY: 0,
        xPos: 0,
        yPos: 0,
        moved: false,
        vid: $('#background').get(0)
    };
    thumb.img.css({height: thumb.imgHeight, width: thumb.imgHeight * 16 / 9 + 'px'});
    thumb.imgWidth = thumb.img.width();
    thumb.maxWidth = thumb.imgWidth;
    thumb.maxHeight = thumb.imgHeight;
    drawBackground(true);
    zPos = -18;
    e = new adjustor('exposure', 'right');
    f = new adjustor('focus', 'left');
    e.other = f;
    f.other = e;
    e.init();
    f.init();
    new Image().src = "shutter2.png";

//    socket = io.connect('http://localhost');
//    socket.on('reload', function() {
//        background.attr('src', 'image.jpg');
//    });
//
//    $('#Prev').on('tap', function() {
//        socket.emit('prev');
//    });
//
//    $('#Next').on('tap', function() {
//        socket.emit('next');
//    });

    $(document).hammer().on('touch', function(ev) {
        ev.gesture.preventDefault();
    });

    $(window).resize(function() {
        if (!bgPos.moved)
            drawBackground(true);
        else {
            ratio = background.width() / background.height() / $(window).width() * $(window).height();
            if (ratio < 1)
                MIN_SCALE = $(window).height() / background.height() * scale;
            else
                MIN_SCALE = $(window).width() / background.width() * scale;
        }
        if (scale < MIN_SCALE)
            scaleTo(MIN_SCALE, true);
        makeThumb(true);
    });

    var myimage = document.getElementById("background");
    if (myimage.addEventListener) {
        myimage.addEventListener("mousewheel", MouseWheelHandler, false);
        myimage.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    else
        myimage.attachEvent("onmousewheel", MouseWheelHandler);


    zoom.hover(function() {
        zoom.animate({opacity: 1}, {queue: false});
        zoom1.animate({opacity: 0.4}, {queue: false});
        zoom2.animate({opacity: 0.4}, {queue: false});
    }, function() {
        zoom.animate({opacity: 0.5}, {queue: false});
        zoom1.animate({opacity: 0}, {queue: false});
        zoom2.animate({opacity: 0}, {queue: false});
    });

    zoom.hammer().on('drag', function(ev) {
        var pos = zPos + ev.gesture.deltaX;
        if (pos > -245 && pos < 208) {
            zoom.css({'margin-left': pos + 'px'});
            zoom1.css({width: 251 + pos});
            zoom2.css({width: 214 - pos});
            if (pos <= -18)
                scaleTo(1 + (MIN_SCALE - 1) * (pos / -227 - 0.0792952), false);
            else
                scaleTo(1 + (MAX_SCALE - 1) * (pos / 226 + 0.079646), false);
        } else if (pos <= -245) {
            zoom.css({'margin-left': -245 + 'px'});
            zoom1.css({width: 6});
            zoom2.css({width: 459});
            scaleTo(MIN_SCALE, false);
        } else {
            zoom.css({'margin-left': 208 + 'px'});
            zoom1.css({width: 459});
            zoom2.css({width: 6});
            scaleTo(MAX_SCALE, false);
        }
        makeThumb(false);
    });

    zoom.hammer().on('release', function(ev) {
        if (zPos + ev.gesture.deltaX > -245 && zPos + ev.gesture.deltaX < 208)
            zPos += ev.gesture.deltaX;
        else if (zPos + ev.gesture.deltaX <= -245)
            zPos = -245;
        else
            zPos = 208;
    });

    background.hammer().on('tap', function() {
        if (bgPos.vid.paused) {
            thumb.img.get(0).play();
            bgPos.vid.play();
        } else {
            thumb.img.get(0).pause();
            bgPos.vid.pause();
        }
    });

    background.hammer().on('touch drag pinch', function(ev) {
        if (FEPos !== null && FEPos.auto === 't') {
            if (ev.gesture.center.pageX > bgPos.left && ev.gesture.center.pageX < bgPos.left + bgPos.width)
                FEPos.pos.css({'left': ev.gesture.center.pageX + 'px'});
            if (ev.gesture.center.pageY > bgPos.top && ev.gesture.center.pageY < bgPos.top + bgPos.height)
                FEPos.pos.css({'top': ev.gesture.center.pageY + 'px'});
            return;
        }

        if (numTouches !== ev.gesture.touches.length) {
            numTouches = ev.gesture.touches.length;
            scale *= bgPos.width / bgPos.prevWidth;
            bgPos.xPos = (ev.gesture.center.pageX - bgPos.left) / bgPos.width;
            bgPos.yPos = (ev.gesture.center.pageY - bgPos.top) / bgPos.height;
            if (scale > MAX_SCALE) {
                scaleTo(MAX_SCALE, true);
                makeThumb(true);
            } else if (scale < MIN_SCALE) {
                scaleTo(MIN_SCALE, true);
                makeThumb(true);
            } else
                makeThumb(false);
            bgPos.prevWidth = bgPos.width;
            bgPos.prevHeight = bgPos.height;
            bgPos.origX = ev.gesture.center.pageX;
            bgPos.origY = ev.gesture.center.pageY;
            bgPos.prevLeft = bgPos.left;
            bgPos.prevTop = bgPos.top;
        } else if (!background.is(':animated')) {

            bgPos.prevCenter = ev.gesture.center;

            bgPos.width = bgPos.prevWidth * ev.gesture.scale;
            bgPos.height = bgPos.prevHeight * ev.gesture.scale;
            bgPos.left = bgPos.prevLeft + (bgPos.prevWidth - bgPos.width) * bgPos.xPos + ev.gesture.center.pageX - bgPos.origX;
            bgPos.top = bgPos.prevTop + (bgPos.prevHeight - bgPos.height) * bgPos.yPos + ev.gesture.center.pageY - bgPos.origY;

            background.css({width: bgPos.width + 'px', height: bgPos.height + 'px', top: bgPos.top + 'px', left: bgPos.left + 'px'});
            makeThumb(false);
        }
    });

    background.hammer().on('release', function(ev) {
        if (FEPos !== null && FEPos.auto === 't')
            return;
        bgPos.moved = true;
        numTouches = 0;
        scale *= bgPos.width / bgPos.prevWidth;
        if (scale > MAX_SCALE) {
            scaleTo(MAX_SCALE, true);
            makeThumb(true);
        } else if (scale < MIN_SCALE) {
            scaleTo(MIN_SCALE, true);
            makeThumb(true);
        }
        bgPos.prevWidth = bgPos.width;
        bgPos.prevHeight = bgPos.height;
        bgPos.prevLeft = bgPos.left;
        bgPos.prevTop = bgPos.top;
    });

    shutter.hammer().on('touch', function() {
        shutter.attr('src', 'shutter2.png');
    });

    shutter.hammer().on('drag', function(ev) {
        shutter.attr('src', 'shutter.png');
        shutter.css({'margin-top': '0', 'top': ev.gesture.center.pageY - 36 + 'px', 'left': ev.gesture.center.pageX - 36 + 'px'});
    });

    shutter.hammer().on('release', function(ev) {
        shutter.attr('src', 'shutter.png');
        if (ev.gesture.deltaX !== 0 || ev.gesture.deltaY !== 0)
            return;
        background.css({width: bgPos.width, height: bgPos.height});
        background.css({top: bgPos.top, left: bgPos.left, 'margin-left': '0'});
        background.animate({top: '100%', left: '50%', 'margin-left': '-10px', width: '20px', height: '20px'}, {duration: 300 + scale * 40, queue: false, complete: function() {
                background.css({top: bgPos.top, left: bgPos.left, 'margin-left': '0', width: bgPos.width, height: bgPos.height, 'box-shadow': '4px 4px 40px #60666b'});
            }});
    });
});

var drawBackground = function(getRatio) {
    if (getRatio)
        ratio = bgPos.width / bgPos.height / $(window).width() * $(window).height();
    if (ratio < 1) {
        bgPos.width = $(window).width(), bgPos.height = $(window).width() * 9 / 16;
        background.css({height: bgPos.height, width: bgPos.width});
        thumb.dispWidth = thumb.imgWidth;
        thumb.dispHeight = thumb.imgWidth * $(window).height() / $(window).width();
        thumb.disp.css({width: thumb.dispWidth, height: thumb.dispHeight + "px"});
    } else {
        bgPos.height = $(window).height(), bgPos.width = $(window).height() * 16 / 9;
        background.css({height: bgPos.height, width: bgPos.width});
        thumb.dispHeight = thumb.imgHeight;
        thumb.dispWidth = thumb.imgHeight * $(window).width() / $(window).height();
        thumb.disp.css({height: thumb.dispHeight, width: thumb.dispWidth + "px"});
    }
    var top = (thumb.imgHeight - thumb.dispHeight) / 2;
    var left = (thumb.imgWidth - thumb.dispWidth) / 2;
    if (ratio < 1)
        MIN_SCALE = thumb.dispHeight / thumb.imgHeight;
    else
        MIN_SCALE = thumb.dispWidth / thumb.imgWidth;
    thumb.disp.css({top: thumb.dispTop, left: thumb.imgLeft, 'margin-top': top, 'margin-left': left});
    thumb.img.css({top: thumb.imgTop, left: thumb.imgLeft});
    bgPos.width = background.width();
    bgPos.height = background.height();
    bgPos.origWidth = bgPos.width;
    bgPos.origHeight = bgPos.height;
    bgPos.prevWidth = bgPos.width;
    bgPos.prevHeight = bgPos.height;
    bgPos.top = ($(window).height() - bgPos.height) / 2;
    bgPos.left = ($(window).width() - bgPos.width) / 2;
    background.css({top: bgPos.top, left: bgPos.left});
};

var scaleTo = function(pct, animate) {
    scale = pct;
    bgPos.prevWidth = bgPos.origWidth * pct;
    bgPos.prevHeight = bgPos.origHeight * pct;
    bgPos.left += (bgPos.width - bgPos.prevWidth) * bgPos.xPos;
    bgPos.top += (bgPos.height - bgPos.prevHeight) * bgPos.yPos;
    if (animate)
        background.animate({top: bgPos.top, left: bgPos.left, width: bgPos.prevWidth, height: bgPos.prevHeight});
    else
        background.css({top: bgPos.top, left: bgPos.left, width: bgPos.prevWidth, height: bgPos.prevHeight});
    bgPos.width = bgPos.prevWidth;
    bgPos.height = bgPos.prevHeight;
};

function MouseWheelHandler(e) {
    bgPos.xPos = (e.pageX - bgPos.left) / bgPos.width;
    bgPos.yPos = (e.pageY - bgPos.top) / bgPos.height;
    scale = (bgPos.prevWidth + e.wheelDelta * scale) / bgPos.origWidth;
    if (scale < MAX_SCALE && scale > MIN_SCALE) {
        bgPos.width = bgPos.origWidth * scale;
        bgPos.height = bgPos.origHeight * scale;
        bgPos.left += (bgPos.prevWidth - bgPos.width) * bgPos.xPos;
        bgPos.top += (bgPos.prevHeight - bgPos.height) * bgPos.yPos;
        background.css({top: bgPos.top, left: bgPos.left, width: bgPos.width, height: bgPos.height});
        bgPos.prevWidth = bgPos.width;
        bgPos.prevHeight = bgPos.height;
    } else if (scale > MAX_SCALE)
        scaleTo(MAX_SCALE);
    else
        scaleTo(MIN_SCALE);
    makeThumb(false);
}

function makeThumb(animate) {
    thumb.dispWidth = $(window).width() / bgPos.width * thumb.imgWidth;
    thumb.dispHeight = $(window).height() / bgPos.height * thumb.imgHeight;
    var left = -bgPos.left / bgPos.width * thumb.imgWidth;
    var top = -bgPos.top / bgPos.height * thumb.imgHeight;
    if (animate)
        thumb.disp.animate({height: thumb.dispHeight + 'px', width: thumb.dispWidth + 'px', 'margin-left': left + 'px', 'margin-top': top + 'px'});
    else
        thumb.disp.css({height: thumb.dispHeight + 'px', width: thumb.dispWidth + 'px', 'margin-left': left + 'px', 'margin-top': top + 'px'});
}

function is_touch_device() {
    return !!('ontouchstart' in window) // works on most browsers 
            || !!(window.navigator.msMaxTouchPoints); // works on ie10
}

log = function(message) {
    $('#log').html(message);
};