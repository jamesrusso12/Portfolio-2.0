/**
 * cathodeNav.js — nav and theme handling for the Cathode landing.
 *
 * Shares the `theme` localStorage key with the legacy pages so a visitor's
 * choice carries across the whole site while the redesign is partial.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        /* ---- mobile menu ------------------------------------------------ */
        var burger = document.querySelector('[data-nav-toggle]');
        var links = document.querySelector('[data-nav-links]');

        if (burger && links) {
            var setOpen = function (open) {
                links.classList.toggle('is-open', open);
                burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            };

            burger.addEventListener('click', function () {
                setOpen(!links.classList.contains('is-open'));
            });

            links.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () { setOpen(false); });
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && links.classList.contains('is-open')) {
                    setOpen(false);
                    burger.focus();
                }
            });

            document.addEventListener('click', function (e) {
                if (!links.classList.contains('is-open')) return;
                if (!e.target.closest('[data-nav-links]') && !e.target.closest('[data-nav-toggle]')) {
                    setOpen(false);
                }
            });
        }

        /* ---- theme ------------------------------------------------------ */
        var toggle = document.querySelector('[data-theme-toggle]');
        var icon = toggle && toggle.querySelector('[data-theme-icon]');

        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) { /* private mode */ }
        // Dark is the primary world, so it is the default for everyone,
        // whatever the OS appearance. Light only appears when a visitor picks
        // it with the toggle, and that choice is remembered.
        var theme = saved === 'light' ? 'light' : 'dark';

        function apply(next) {
            document.documentElement.setAttribute('data-theme', next);
            if (icon) icon.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
            if (toggle) {
                toggle.setAttribute('aria-label',
                    next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            }
        }

        apply(theme);

        if (toggle) {
            toggle.addEventListener('click', function () {
                var next = document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'light' : 'dark';
                try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
                apply(next);
            });
        }

        /* ---- footer year ------------------------------------------------ */
        var year = document.querySelector('[data-year]');
        if (year) year.textContent = new Date().getFullYear();
    });
})();
