// Sliders (Splide). Each slider's slides are sized by Bootstrap grid classes in the markup,
// so Splide runs with autoWidth and only handles the movement.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var sliders = [
            {
                // Guides: dragged by hand. (The cards' navy panels are kept the same height
                // by guide-cards.js.)
                selector: '.splide.guides-slider',
                options: {
                    autoWidth: true,
                    pagination: false,
                    arrows: false
                }
            },
            {
                // Surfaces ("Suitable for"): a ticker tape. The strip loops and scrolls slowly
                // to the left on its own (Splide's AutoScroll extension). It does not pause on
                // hover: scrolling the page puts the pointer over the strip, which stopped it
                // (and a tap on a touch screen left it stopped). It can still be dragged and
                // carries on when let go. With reduced motion switched on it stays still until
                // dragged.
                selector: '.splide.surfaces-slider',
                extensions: true,
                options: {
                    type: 'loop',
                    drag: 'free',
                    autoWidth: true,
                    pagination: false,
                    arrows: false,
                    autoScroll: {
                        speed: 0.5, // pixels per frame, about 30px a second
                        autoStart: !reducedMotion,
                        pauseOnHover: false,
                        pauseOnFocus: true
                    }
                }
            }
        ];

        sliders.forEach(function (slider) {
            document.querySelectorAll(slider.selector).forEach(function (el) {
                var splide = new Splide(el, slider.options);

                if (slider.extensions) {
                    splide.mount(window.splide.Extensions);
                } else {
                    splide.mount();
                }

                if (slider.ready) {
                    slider.ready(el, splide);
                }
            });
        });
    });
}());
