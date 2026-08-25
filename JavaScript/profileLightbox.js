/**
 * Profile image lightbox — click the hero avatar to expand the full photo.
 *
 * Focus handling: we only restore focus to the trigger button when the user
 * opened the lightbox via keyboard. Restoring focus after a mouse click was
 * leaving the trigger with a sticky focus state that some browsers (Safari
 * especially) render as :focus-visible, which then looked like a stuck hover.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var trigger = document.getElementById('profile-image-trigger');
        var lightbox = document.getElementById('profile-lightbox');
        if (!trigger || !lightbox) return;

        var closeBtn = lightbox.querySelector('.profile-lightbox-close');
        var openedViaKeyboard = false;

        // Keep Tab inside the overlay while it is open, otherwise focus walks off
        // into the page behind it and the dialog is effectively unusable by keyboard.
        function trapFocus(container, e) {
            if (e.key !== "Tab") return;
            var focusable = container.querySelectorAll(
                'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            var visible = [];
            for (var i = 0; i < focusable.length; i++) {
                if (focusable[i].offsetParent !== null) visible.push(focusable[i]);
            }
            if (!visible.length) return;
            var first = visible[0];
            var last = visible[visible.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        function open() {
            lightbox.hidden = false;
            void lightbox.offsetWidth;       // force reflow so transition runs
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (closeBtn) closeBtn.focus();
        }

        function close() {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(function () {
                if (!lightbox.classList.contains('is-open')) {
                    lightbox.hidden = true;
                }
            }, 250);

            // Only refocus the trigger for keyboard users. For mouse users,
            // drop focus entirely so no :focus / :focus-visible sticks.
            if (openedViaKeyboard) {
                trigger.focus();
            } else {
                trigger.blur();
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            }
            openedViaKeyboard = false;
        }

        // Track the modality of the open event so we can decide on close
        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openedViaKeyboard = true;
            }
        });
        trigger.addEventListener('mousedown', function () {
            openedViaKeyboard = false;
        });
        trigger.addEventListener('click', open);

        if (closeBtn) closeBtn.addEventListener('click', close);

        // Backdrop click closes (but not when clicking the image itself)
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') {
                close();
                return;
            }
            trapFocus(lightbox, e);
        });
    });
})();
