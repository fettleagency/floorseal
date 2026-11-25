// Product selector (the form marked data-product-selector, on the Help & advice page).
// Sending the form shows the results under it without a reload, puts the two answers in the
// URL (so a result can be linked to and the back button works) and scrolls to the results.
// Changing an answer afterwards updates the results in place.
// On the static page the results are one fixed example; only the heading follows the answers.
// In Shopify the same hooks apply, with the results loaded for the chosen answers.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.querySelector('[data-product-selector]');

        if (!form) {
            return;
        }

        var section = form.closest('.product-selector');
        var job = form.elements.job;
        var surface = form.elements.surface;
        var results = section.querySelector('[data-selector-results]');
        var heading = section.querySelector('[data-selector-heading]');
        var prompt = section.querySelector('[data-selector-prompt]');
        var note = section.querySelector('[data-selector-note]');
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function answered() {
            return job.value !== '' && surface.value !== '';
        }

        function url() {
            var params = new URLSearchParams();

            params.set('job', job.value);
            params.set('surface', surface.value);

            return window.location.pathname + '?' + params.toString() + '#' + section.id;
        }

        // Shows the results for the current answers, or hides them if one is missing
        function render() {
            var show = answered();

            if (show) {
                heading.textContent = 'For ' + job.value.toLowerCase() + ' ' + surface.value;
            }

            results.hidden = !show;
            note.hidden = !show;
            prompt.hidden = show;
        }

        // Fills the selects from the URL
        function read() {
            var params = new URLSearchParams(window.location.search);

            job.value = params.get('job') || '';
            surface.value = params.get('surface') || '';
            render();
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!answered()) {
                return;
            }

            window.history.pushState(null, '', url());
            render();
            results.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        });

        // Once results are showing, a new answer updates them in place
        form.addEventListener('change', function () {
            if (results.hidden || !answered()) {
                return;
            }

            window.history.replaceState(null, '', url());
            render();
        });

        // The selects show their focus outline only when reached with the Tab key, not when
        // clicked (see .product-selector__select in _help-advice.scss)
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                section.classList.add('is-keyboard');
            }
        });
        document.addEventListener('pointerdown', function () {
            section.classList.remove('is-keyboard');
        });

        window.addEventListener('popstate', read);
        read();
    });
}());
