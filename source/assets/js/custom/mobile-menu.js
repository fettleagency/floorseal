// Menu glue.
// Bootstrap does the work: Collapse opens the main menu (#mainMenu) on mobile, and Surfaces and
// Help & advice are Dropdowns whose .dropdown-menu is the sub-menu panel on mobile and desktop.
// Opening, Escape and clicking outside (including the X in the header) are all Bootstrap's.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var mainMenu = document.getElementById('mainMenu');
        if (!mainMenu) {
            return;
        }

        function closeSubmenus() {
            mainMenu.querySelectorAll('[data-bs-toggle="dropdown"].show').forEach(function (toggle) {
                bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
            });
        }

        // 1. The "Menu" back button sits inside the dropdown, where a click doesn't close it
        //    (data-bs-auto-close="outside"), so close it here and go back to its link.
        mainMenu.querySelectorAll('[data-submenu-back]').forEach(function (button) {
            button.addEventListener('click', function () {
                var toggle = button.closest('.dropdown').querySelector('[data-bs-toggle="dropdown"]');
                bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
                toggle.focus();
            });
        });

        // 2. The main menu always opens on its first screen, even if a sub-menu was left open
        //    (for example after resizing from desktop to mobile).
        mainMenu.addEventListener('show.bs.collapse', function (event) {
            if (event.target === mainMenu) {
                closeSubmenus();
            }
        });
    });
}());
