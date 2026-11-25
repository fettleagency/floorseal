// Collection filters (the form marked data-collection-filters).
// The filters are Bootstrap dropdowns inside a Bootstrap .offcanvas-lg; this adds what
// Bootstrap doesn't do on its own:
// 1. Desktop: clicking outside an open filter closes it, so only one is open at a time.
// 2. Mobile: every filter is open when the panel opens.
// 3. A surface's checkbox ticks or unticks all of its sub-surfaces.
// 4. The buttons show how many options are ticked ("Surface · 1") and turn yellow.
// 5. "Clear" unticks everything in one filter ("Clear all" is a plain reset button).
// The last block stands in for Shopify on the static pages only.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.querySelector('[data-collection-filters]');

        if (!form) {
            return;
        }

        var panel = form.querySelector('.offcanvas-lg');
        var openButton = form.querySelector('.collection-filters__open');
        var groups = Array.prototype.slice.call(form.querySelectorAll('[data-filter-group]'));
        var toggles = groups.map(function (group) {
            return group.querySelector('[data-bs-toggle="dropdown"]');
        });
        var desktop = window.matchMedia('(min-width: 992px)'); // Bootstrap's lg breakpoint

        function dropdown(toggle) {
            return bootstrap.Dropdown.getOrCreateInstance(toggle);
        }

        function closeAll() {
            toggles.forEach(function (toggle) {
                dropdown(toggle).hide();
            });
        }

        // 1. Desktop: close a filter when the click is anywhere outside it
        document.addEventListener('click', function (event) {
            if (!desktop.matches) {
                return;
            }

            groups.forEach(function (group, index) {
                if (!group.contains(event.target)) {
                    dropdown(toggles[index]).hide();
                }
            });
        });

        // 2. Mobile: all filters open while the panel is open, closed again afterwards
        panel.addEventListener('show.bs.offcanvas', function () {
            toggles.forEach(function (toggle) {
                dropdown(toggle).show();
            });
        });
        panel.addEventListener('hidden.bs.offcanvas', closeAll);

        // 3. A surface and its sub-surfaces
        function children(parent) {
            return Array.prototype.slice.call(
                parent.closest('.filter-option').querySelectorAll('.filter-option__children input')
            );
        }

        // 4. Counts on the buttons
        function setCount(button, count) {
            button.classList.toggle('is-active', count > 0);
            button.querySelector('[data-filter-count]').textContent = count ? ' · ' + count : '';
        }

        function update() {
            var total = 0;

            form.querySelectorAll('[data-filter-parent]').forEach(function (parent) {
                var boxes = children(parent);
                var ticked = boxes.filter(function (box) {
                    return box.checked;
                }).length;

                parent.checked = ticked > 0 && ticked === boxes.length;
                parent.indeterminate = ticked > 0 && ticked < boxes.length;
            });

            groups.forEach(function (group, index) {
                var count = group.querySelectorAll('input[name]:checked').length;

                total += count;
                setCount(toggles[index], count);
            });

            setCount(openButton, total);
        }

        form.addEventListener('change', function (event) {
            if (event.target.matches('[data-filter-parent]')) {
                children(event.target).forEach(function (box) {
                    box.checked = event.target.checked;
                });
            }

            update();
        });

        // "Clear all" is a reset button: update once the browser has unticked the boxes
        form.addEventListener('reset', function () {
            window.setTimeout(update, 0);
        });

        // 5. "Clear" inside one filter
        form.querySelectorAll('[data-filter-clear]').forEach(function (button) {
            button.addEventListener('click', function () {
                button.closest('[data-filter-group]').querySelectorAll('input').forEach(function (box) {
                    box.checked = false;
                });
                update();
            });
        });

        // ----- Static pages only -----
        // Shopify renders the ticked boxes and the applied-filter chips from the URL. On the
        // static pages this does the same, so the filtered state can be seen: tick a box,
        // press "Show products" and the page reloads with the filter in the URL.
        var params = new URLSearchParams(window.location.search);
        var applied = document.querySelector('[data-filters-applied]');
        var chipTemplate = applied.querySelector('[data-filter-chip]');
        var clearAll = applied.querySelector('.filter-clear');

        form.querySelectorAll('input[name]').forEach(function (box) {
            if (params.getAll(box.name).indexOf(box.value) === -1) {
                return;
            }

            var chip = chipTemplate.content.firstElementChild.cloneNode(true);
            var rest = new URLSearchParams();

            params.forEach(function (value, name) {
                if (name !== box.name || value !== box.value) {
                    rest.append(name, value);
                }
            });

            box.checked = true;
            chip.querySelector('span').textContent = box.value;
            chip.setAttribute('aria-label', 'Remove filter: ' + box.value);
            chip.href = window.location.pathname + (rest.toString() ? '?' + rest.toString() : '');
            applied.insertBefore(chip, clearAll);
            applied.hidden = false;
        });

        update();
    });
}());
