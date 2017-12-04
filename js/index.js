/**
 * Created by Joseph on 11/23/2017.
 */

var RIGHT = "right",
    LEFT = "left",
    LEFT_ARROW = $("#productLeft"),
    RIGHT_ARROW = $("#productRight"),
    SLIDER = $('#productSlider'),
    MENU = $('#mobileNav'),
    CART = $('#shoppingCartModal'),
    transitioning = false;

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
    if (transitioning) {
        return false;
    }

    transitioning = true;
    el.on("transitionend", transitionDone);
    el.css("right", "+=" + amount.toString());
}

function slideRight(el, amount) {
    if (transitioning) {
        return false;
    }

    transitioning = true;
    el.on("transitionend", transitionDone);

    if (el && +el.css("right").replace("px","") - amount < 0) {
        el.css("right", "0");
    } else {
        el.css("right", "-=" + amount.toString());
    }
}

function transitionDone() {
    transitioning = false;
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

function containEmptyObjs(jqObjs) {

    if (jqObjs.length == 0) {
        return true;
    }

    jqObjs.each(function () {
       if (this.length == 0) {
           return true;
       }
    });

    return false;
}


function addToCart(el) {
    var item = $(el).closest('.product'),
        title = item.find('.product-title'),
        price = item.find('.price'),
        img = item.find('.product-img'),
        template = $('#scEntryTemplate'),
        addedMsg = $('#addedToCartModal'),
        cartTotal,
        existingEntry,
        entry;

    if (containEmptyObjs($([
            item,
            title,
            price,
            img,
            template,
            CART
        ]))) {
        return false;
    }

    // Now that we know elements exist, we can set some more variables.
    cartTotal = +CART.attr("data-cart-count");
    existingEntry = $('.item-title:contains(' + title.text() + ')');

    if (!containEmptyObjs(existingEntry)) {
        // We already have this in the cart. Just update the quantity.
        var quantity = existingEntry.closest('.cart-entry').find('.item-quantity');
        quantity.text(+quantity.text() + 1);
    } else {


        entry = $([]).add(template[0].innerHTML);
        entry.find('.item-title').text(title.text());
        entry.find('.item-price').text(price.text());
        entry.find('.item-quantity').text("1");
        entry.find('.item-img').attr("src", img.attr("src"))
                               .attr("alt", img.attr("alt"));

        CART.find('.modal-body').append(entry);
    }

    updateCartSubtotal(parseFloat(price.text().replace("$","")));
    updateCartCount(cartTotal + 1);
    addedMsg.modal('show');
}

function removeFromCart(el) {
    var item = $(el).closest(".cart-entry"),
        quantity = item.find('.item-quantity'),
        quantityVal = +quantity.text(),
        price = item.find('.item-price'),
        cartTotal;

    if (containEmptyObjs($([
            item,
            quantity,
            price,
            CART
        ]))) {
            return false;
    }

    cartTotal = +CART.attr("data-cart-count");
    price = parseFloat(price.text().replace("$",""));

    if (quantityVal !== 1) {
        quantity.text(quantityVal - 1);
    } else {
        item.remove();
    }

    updateCartSubtotal(price * -1);
    updateCartCount(cartTotal - 1);
}

function updateCartCount(cartCount) {
    CART.attr('data-cart-count', cartCount);
    $("#scNumItems").text(cartCount);
    $(".cart-count").text("(" + cartCount + ")");
}

function updateCartSubtotal(subtotal) {
    var cartSubtotal = $('#subtotal');

    if (!containEmptyObjs(cartSubtotal)) {
        var newTotal = +cartSubtotal.text() + subtotal;
        cartSubtotal.text(newTotal.toFixed(2));
    }
}



