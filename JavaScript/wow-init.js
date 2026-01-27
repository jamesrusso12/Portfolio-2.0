document.addEventListener('DOMContentLoaded', () => {
    if (typeof WOW === 'function') {
        new WOW({
            boxClass: 'wow',
            animateClass: 'animate__animated',
            offset: 60,
            mobile: true,
            live: true
        }).init();
    }
});
