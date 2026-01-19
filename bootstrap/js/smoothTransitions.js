/**
 * Enhanced Smooth Transitions
 * Adds progressive loading and smooth scroll enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');

    // Smooth scroll with offset for fixed nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Don't prevent default for hash-only links
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.topnav')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy load images with intersection observer for better performance
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Add stagger animation to carousel items
    const carouselItems = document.querySelectorAll('.owl-carousel .item');
    carouselItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Smooth reveal for sections on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    // Observe all major sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
});

// Prevent FOUC (Flash of Unstyled Content) for theme
(function() {
    const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
