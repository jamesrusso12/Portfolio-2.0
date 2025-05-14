jQuery(function ($) {
    $('#portfolio .owl-carousel.video-section').owlCarousel({
        center: true,
        loop: true,
        margin: 10,
        nav: true,
        items: 1,
        dots: false,
        stagePadding: 120,     // shows ~120px of each side slide
        responsive: {
            0: { stagePadding: 30 },
            600: { stagePadding: 60 },
            1000: { stagePadding: 120 }
        }
    });
});
