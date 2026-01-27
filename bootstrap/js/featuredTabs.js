/**
 * Featured Projects Tab Switching
 * Handles toggling between featured project panels in the showcase section.
 */
document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('.featured-tab');
    var panels = document.querySelectorAll('.featured-panel');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) { t.classList.remove('active'); });
            panels.forEach(function (p) { p.classList.remove('active'); });

            tab.classList.add('active');
            document.getElementById('panel-' + tab.getAttribute('data-tab')).classList.add('active');
        });
    });
});
