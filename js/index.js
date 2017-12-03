/**
 * Created by Joseph on 11/23/2017.
 */

var RIGHT = "right",
    LEFT = "left",
    LEFT_ARROW = $("#productLeft"),
    RIGHT_ARROW = $("#productRight"),
    SLIDER = $('#productSlider'),
    MENU = $('#mobileNav');

setLeftArrowActive(false);

RIGHT_ARROW.click(function (e) {
    nextItem()
});

LEFT_ARROW.click(function (e) {
    previousItem();
});

SLIDER.on("swipeleft", function(e) {
    nextItem();
});

SLIDER.on("swiperight", function(e) {
    previousItem();
});

function nextItem() {
    var slideAmount = $('#productHolder').width() + 64;

    if (RIGHT_ARROW.hasClass("disabled")) {
        return false;
    }

    if (!checkSlideBoundaries(SLIDER, RIGHT, slideAmount * 2)) {
        setRightArrowActive(false);
    }

    setLeftArrowActive(true);

    slideLeft(SLIDER, slideAmount);
}

function previousItem() {
    var slideAmount = $('#productHolder').width() + 64;

    if (LEFT_ARROW.hasClass("disabled")) {
        return false;
    }

    if (!checkSlideBoundaries(SLIDER, LEFT, slideAmount)) {
        setLeftArrowActive(false);
    }

    setRightArrowActive(true);

    slideRight(SLIDER, slideAmount);
}

function slideLeft(el, amount) {
    el.css("right", "+=" + amount.toString());
}

function slideRight(el, amount) {
    el.css("right", "-=" + amount.toString());
}

// Returns false if sliding would move the element outside of its boundaries
function checkSlideBoundaries(el, slideDirection, slideAmount) {
    var futurePos = parseFloat(el.css("right")),
        boundary = (slideDirection == "right") ? el[0].scrollWidth : 0;

    slideAmount *= (slideDirection == "left") ? -1 : 1;

    futurePos += slideAmount;

    return (slideDirection == "right") ? futurePos < boundary : futurePos > 0;
}

function setLeftArrowActive(active) {
    setActive(LEFT_ARROW, active);
}

function setRightArrowActive(active) {
    setActive(RIGHT_ARROW, active);
}

function setActive(el, active) {
    var fn = (active) ? el.removeClass : el.addClass;
    fn.call(el, "disabled");
}

function hideMenu() {
    MENU.collapse('hide');
    return true;
}




