// Guide cards. On desktop each card's navy panel is made as tall as the tallest one in its
// group (the guides slider, or the grid on the how-to guides page), so a guide with a longer
// title does not sit out of line. The height is passed to the stylesheet as
// --guide-body-height (see .guide-card__body in _guides.scss); below lg the stylesheet ignores it.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var groups = document.querySelectorAll('.guides-slider, .guide-grid');

        if (!groups.length) {
            return;
        }

        function equalise() {
            groups.forEach(function (group) {
                var tallest = 0;

                group.style.removeProperty('--guide-body-height');
                group.querySelectorAll('.guide-card__body').forEach(function (body) {
                    tallest = Math.max(tallest, body.offsetHeight);
                });
                group.style.setProperty('--guide-body-height', tallest + 'px');
            });
        }

        var queued = false;

        window.addEventListener('resize', function () {
            if (queued) {
                return;
            }

            queued = true;
            window.requestAnimationFrame(function () {
                queued = false;
                equalise();
            });
        });
        document.fonts.ready.then(equalise);
        equalise();
    });
}());
