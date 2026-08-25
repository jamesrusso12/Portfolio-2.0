jQuery(function ($) {
    const $carousel = $('#portfolio .owl-carousel.video-section');

    $carousel.owlCarousel({
        center: true,
        loop: true,
        margin: 10,
        nav: true,
        items: 1,
        dots: false
    });

    function pauseAllVideos() {
        $carousel.find("video").each(function () {
            try { this.pause(); } catch (_) { }
        });
    }

    // Pause other videos whenever we slide
    $carousel.on('changed.owl.carousel', function () {
        pauseAllVideos();
    });

    // Also pause when user navigates via controls
    $carousel.on('translate.owl.carousel', function () {
        pauseAllVideos();
    });

    // Keyboard navigation: when any element inside the carousel has focus
    $carousel.attr('tabindex', '0'); // allow focus
    $carousel.on('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            $carousel.trigger('prev.owl.carousel');
        } else if (e.key === 'ArrowRight') {
            $carousel.trigger('next.owl.carousel');
        }
    });
});
