// Product page: gallery, size choice and quantity.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // 1. Gallery: a Splide slider of the images, fading from one to the next. On mobile it
        //    is swiped and has dots; from md the thumbnails pick the image and show which one is on.
        document.querySelectorAll('.product-gallery').forEach(function (gallery) {
            var thumbs = gallery.querySelectorAll('.product-gallery__thumb');
            var slider = new Splide(gallery.querySelector('.splide'), {
                type: 'fade',
                speed: 200, // the fade takes 0.2s
                arrows: false,
                pagination: true
            });

            slider.on('mounted move', function () {
                thumbs.forEach(function (thumb, index) {
                    var active = index === slider.index;

                    thumb.classList.toggle('is-active', active);
                    thumb.setAttribute('aria-current', active ? 'true' : 'false');
                });
            });

            thumbs.forEach(function (thumb, index) {
                thumb.addEventListener('click', function () {
                    slider.go(index);
                });
            });

            slider.mount();
        });

        // 2. Quantity: the minus and plus buttons step the number, never below its minimum
        document.querySelectorAll('.quantity-selector').forEach(function (selector) {
            var input = selector.querySelector('input');

            selector.querySelectorAll('button').forEach(function (button) {
                button.addEventListener('click', function () {
                    var min = Number(input.min) || 1;
                    var value = (Number(input.value) || min) + (button.name === 'plus' ? 1 : -1);

                    input.value = Math.max(min, value);
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            });
        });

        // 3. Size: the price under the options follows the chosen size.
        //    (In Shopify the theme does this from the variant data.)
        document.querySelectorAll('.product-form').forEach(function (form) {
            var amount = form.querySelector('.product-form__amount');

            form.querySelectorAll('.size-option__input').forEach(function (input) {
                input.addEventListener('change', function () {
                    amount.textContent = input.dataset.price;
                });
            });
        });

        // 4. Before and after slider: the range input laid over the photos moves the divider.
        document.querySelectorAll('[data-compare]').forEach(function (compare) {
            var range = compare.querySelector('.compare__range');
            var update = function () {
                compare.style.setProperty('--compare-position', range.value + '%');
            };

            range.addEventListener('input', update);
            update();
        });
    });
}());
