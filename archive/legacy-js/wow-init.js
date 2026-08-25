// Lightweight replacement for WOW.js — triggers Animate.css classes on scroll.
// Honors existing markup: .wow animate__<name> + data-wow-delay="0.2s"
(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function reveal(el) {
        const delay = el.getAttribute('data-wow-delay');
        if (delay) el.style.animationDelay = delay;
        el.classList.add('animate__animated');
        el.style.visibility = 'visible';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const targets = document.querySelectorAll('.wow');
        if (!targets.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach(el => { el.style.visibility = 'visible'; });
            return;
        }

        targets.forEach(el => { el.style.visibility = 'hidden'; });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

        targets.forEach(el => observer.observe(el));
    });
})();
