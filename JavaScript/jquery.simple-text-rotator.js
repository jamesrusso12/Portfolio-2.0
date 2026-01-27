(function () {
    const elId = "test1";
    const words = ["Game Developer", "Web Designer", "Game Engine Specialist"];
    const fadeInMs = 500;
    const visibleMs = 1400;
    const fadeOutMs = 500;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function rotate($el, arr, i) {
        if (!$el || !$el.length) return;
        const nextIndex = (i + 1) % arr.length;

        if (prefersReduced) {
            // No animation: just swap text on a timer
            $el.text(arr[i]);
            setTimeout(() => rotate($el, arr, nextIndex), 1200);
            return;
        }

        $el.stop(true, true)
            .text(arr[i])
            .fadeIn(fadeInMs, function () {
                setTimeout(() => {
                    $el.fadeOut(fadeOutMs, function () {
                        rotate($el, arr, nextIndex);
                    });
                }, visibleMs);
            });
    }

    function init() {
        if (!window.jQuery) return;
        const $ = window.jQuery;
        const $el = $("#" + elId);
        if (!$el.length) return;

        // Start hidden for animation, but keep in DOM for a11y
        $el.hide();

        // Pause on hover for better control
        let paused = false;
        $el.on("mouseenter", () => { paused = true; $el.stop(true, true); });
        $el.on("mouseleave", () => {
            if (paused) {
                paused = false;
                // Resume from current word (don’t jump)
                rotate($el, words, (words.indexOf($el.text()) + 1) % words.length || 0);
            }
        });

        rotate($el, words, 0);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
