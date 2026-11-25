// Basket: the basket page and the basket drawer (each form or section marked data-basket).
// Static pages only: it stands in for the theme's cart script so both can be tried.
// 1. Changing a quantity updates that line's total, the subtotal, the total and the item count.
// 2. "Remove" takes the line out. With no lines left the empty state shows instead.
// 3. basket.html?empty opens the basket page on its empty state.
// 4. Sending a product form ("Add to basket") opens the drawer instead of leaving the page.
(function () {
    'use strict';

    function money(pence) {
        return '£' + (pence / 100).toFixed(2);
    }

    function setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-basket]').forEach(function (basket) {
            // The drawer keeps its count, totals and empty state inside itself (data-basket-scope);
            // on the basket page they are elsewhere in the page.
            var scope = basket.closest('[data-basket-scope]') || document;

            function update() {
                var items = basket.querySelectorAll('[data-basket-item]');
                var quantity = 0;
                var sum = 0;

                items.forEach(function (item) {
                    var number = Math.max(1, Number(item.querySelector('input').value) || 1);
                    var line = Math.round(Number(item.dataset.price) * 100) * number;

                    quantity += number;
                    sum += line;
                    setText(item.querySelector('[data-basket-line-total]'), money(line));
                });

                setText(scope.querySelector('[data-basket-count]'), quantity + (quantity === 1 ? ' item' : ' items'));
                setText(scope.querySelector('[data-basket-subtotal]'), money(sum));
                setText(scope.querySelector('[data-basket-total]'), money(sum));

                // Nothing left: swap every "filled" part for the empty state
                scope.querySelectorAll('[data-basket-filled]').forEach(function (part) {
                    part.hidden = items.length === 0;
                });
                scope.querySelectorAll('[data-basket-empty]').forEach(function (part) {
                    part.hidden = items.length > 0;
                });
            }

            basket.addEventListener('change', update);

            basket.addEventListener('click', function (event) {
                var remove = event.target.closest('[data-basket-remove]');

                if (!remove) {
                    return;
                }

                event.preventDefault();
                remove.closest('[data-basket-item]').remove();
                update();
            });

            if (scope === document && new URLSearchParams(window.location.search).has('empty')) {
                basket.querySelectorAll('[data-basket-item]').forEach(function (item) {
                    item.remove();
                });
            }

            update();
        });

        // 4. Add to basket opens the drawer
        var drawer = document.getElementById('basketDrawer');

        if (drawer) {
            document.querySelectorAll('form[action="/cart/add"]').forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
                });
            });
        }
    });
}());
