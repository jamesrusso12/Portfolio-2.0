function toggleReadMore(btn) {
    const para = btn.previousElementSibling;                 // <p> before the button
    const dots = para.querySelector('.dots');

    // Prefer aria-controls target if present
    const ctrlId = btn.getAttribute('aria-controls');
    const more = ctrlId ? document.getElementById(ctrlId)
        : para.querySelector('.more-content');

    if (!more) return; // safety

    const isHidden = more.hasAttribute('hidden') || more.style.display === 'none';

    if (isHidden) {
        more.removeAttribute('hidden');
        more.style.display = 'inline'; // ensure visible even if old CSS lingers
        if (dots) dots.style.display = 'none';
        btn.textContent = 'Show less';
        btn.setAttribute('aria-expanded', 'true');
    } else {
        more.setAttribute('hidden', '');
        if (dots) dots.style.display = 'inline';
        btn.textContent = 'Read more';
        btn.setAttribute('aria-expanded', 'false');
    }
}
