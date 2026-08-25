/**
 * sectionBlades.js — Xbox-dashboard section markers.
 *
 * Each section owns a blade (orb + wire + label bar). Exactly one blade is
 * active at a time, and scrolling moves that active state down the page, the
 * way moving down the original Xbox dashboard lit each item in turn.
 *
 * Deliberately not driven by requestAnimationFrame: a plain scroll handler
 * over a handful of getBoundingClientRect calls is cheap, and it keeps the
 * behaviour testable in environments where rAF never fires.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var blades = Array.prototype.slice.call(document.querySelectorAll('[data-blade]'));
        if (!blades.length) return;

        // Pair each blade with the section that owns it.
        var items = blades.map(function (blade) {
            var owner = blade.closest('[data-blade-section]') ||
                        blade.closest('section') ||
                        blade.closest('header');
            return { blade: blade, owner: owner || blade };
        }).filter(function (i) { return i.owner; });

        if (!items.length) return;

        var activeIndex = -1;

        function setActive(i) {
            if (i === activeIndex) return;
            activeIndex = i;
            for (var n = 0; n < items.length; n++) {
                items[n].blade.classList.toggle('is-active', n === i);
            }
        }

        /**
         * The section whose top has most recently passed the focus line wins.
         * If nothing has passed it yet (right at the top of the page) the
         * first blade stays lit, so a blade is always active.
         */
        function update() {
            var line = window.innerHeight * 0.38;
            var chosen = 0;
            for (var n = 0; n < items.length; n++) {
                var top = items[n].owner.getBoundingClientRect().top;
                if (top - line <= 0) chosen = n;
            }
            // At the very bottom, favour the last section even if its top
            // never crossed the line on a short final section.
            var doc = document.documentElement;
            if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
                chosen = items.length - 1;
            }
            setActive(chosen);
        }

        // Expose for tests and for anything that needs to force a recompute.
        window.__updateBlades = update;

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    });
})();
