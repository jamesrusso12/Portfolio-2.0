document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.video-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    let currentIdx = slides.findIndex(s => s.classList.contains('active'));
    if (currentIdx < 0) currentIdx = 0;

    /**
     * Switches the `.active` class from the current slide to the one at newIndex.
     * Wraps around at either end.
     */
    function showSlide(newIndex) {
        slides[currentIdx].classList.remove('active');
        currentIdx = (newIndex + slides.length) % slides.length;
        slides[currentIdx].classList.add('active');
    }

    // Hook up arrow buttons
    prevBtn.addEventListener('click', () => showSlide(currentIdx - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIdx + 1));

    // Optional: arrow-key navigation when the slider has focus
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') showSlide(currentIdx - 1);
        if (e.key === 'ArrowRight') showSlide(currentIdx + 1);
    });
});
