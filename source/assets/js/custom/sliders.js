// Sliders (Splide). Each slider's slides are sized by Bootstrap grid classes in the markup,
// so Splide runs with autoWidth and only handles the movement.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var sliders = [
            {
                // Guides: dragged by hand. On desktop every card's navy panel is made as tall
                // as the tallest one, so a guide with a longer title does not sit out of line.
                selector: '.splide.guides-slider',
                options: {
                    autoWidth: true,
                    pagination: false,
                    arrows: false
                },
                ready: function (el, splide) {
                    var equalise = function () {
                        var tallest = 0;

                        el.style.removeProperty('--guide-body-height');
                        el.querySelectorAll('.guide-card__body').forEach(function (body) {
                            tallest = Math.max(tallest, body.offsetHeight);
                        });
                        el.style.setProperty('--guide-body-height', tallest + 'px');
                    };

                    splide.on('resized', equalise);
                    document.fonts.ready.then(equalise);
                    equalise();
                }
            },
            {
                // Surfaces ("Suitable for"): a ticker tape. The strip loops and scrolls slowly
                // to the left on its own (Splide's AutoScroll extension), pausing while it is
                // hovered or focused. It can still be dragged. With reduced motion switched on
                // it stays still until dragged.
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
                        pauseOnHover: true,
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
