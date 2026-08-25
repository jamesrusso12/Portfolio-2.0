/**
 * Project filter — chip-based filtering for the "What I Work On" grid.
 * Each .project-tile has a `data-categories` attribute (space-separated tokens).
 * Clicking a .filter-chip with data-filter="X" hides any tile whose categories
 * don't include X. data-filter="all" reveals everything.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var chips = document.querySelectorAll('.filter-chip');
        var tiles = document.querySelectorAll('.project-tile');
        if (!chips.length || !tiles.length) return;

        function applyFilter(filter) {
            tiles.forEach(function (tile) {
                var cats = (tile.getAttribute('data-categories') || '').split(/\s+/);
                var match = filter === 'all' || cats.indexOf(filter) !== -1;
                tile.classList.toggle('is-hidden', !match);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (c) {
                    c.classList.remove('active');
                    c.setAttribute('aria-pressed', 'false');
                });
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');
                applyFilter(chip.getAttribute('data-filter') || 'all');
            });
        });

        // Initialize state
        applyFilter('all');
    });
})();
