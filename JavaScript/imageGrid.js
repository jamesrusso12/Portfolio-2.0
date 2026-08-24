document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("myModal");
    if (!modal) return;

    const modalSlides = document.getElementById("modal-slides");
    const captionText = document.getElementById("caption");
    const closeBtn = modal.querySelector(".close");
    const prevBtn = modal.querySelector(".prev");
    const nextBtn = modal.querySelector(".next");

    let slideIndex = 1;
    let lastFocused = null;

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

    function openModal(section, startIndex) {
        const slides = document.querySelectorAll(`#${section} .image-grid img`);
        if (!slides.length) return;

        lastFocused = document.activeElement;
        modalSlides.innerHTML = "";

        slides.forEach((img, i) => {
            const slide = document.createElement("div");
            slide.className = "mySlides fade";
            slide.innerHTML = `
                <div class="numbertext">${i + 1} / ${slides.length}</div>
                <img src="${img.src}" alt="${img.alt}" class="modal-image">
            `;
            modalSlides.appendChild(slide);
        });

        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        showSlides(slideIndex = startIndex || 1);

        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
        }
    }

    function plusSlides(n) { showSlides(slideIndex += n); }

    function showSlides(n) {
        const slides = modalSlides.getElementsByClassName("mySlides");
        if (!slides.length) return;

        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        [...slides].forEach(s => {
            s.style.display = "none";
            s.classList.remove("active");
        });

        slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add("active");
        if (captionText) captionText.textContent = `Image ${slideIndex} of ${slides.length}`;
    }

    // Event delegation: any image inside an .image-grid opens its parent gallery
    document.querySelectorAll(".image-grid").forEach(grid => {
        const gallery = grid.closest(".gallery-content");
        if (!gallery || !gallery.id) return;

        const images = [...grid.querySelectorAll("img")];

        images.forEach((img, i) => {
            img.setAttribute("role", "button");
            img.setAttribute("aria-label", `Open ${img.alt || "image"} in gallery viewer`);

            img.addEventListener("click", () => openModal(gallery.id, i + 1));
            img.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(gallery.id, i + 1);
                }
            });
        });
    });

    // Modal controls
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (prevBtn) prevBtn.addEventListener("click", () => plusSlides(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => plusSlides(1));

    // Click outside modal content to close
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    // Keyboard navigation
    document.addEventListener("keydown", e => {
        if (modal.style.display !== "block") return;
        if (e.key === "ArrowLeft") plusSlides(-1);
        else if (e.key === "ArrowRight") plusSlides(1);
        else if (e.key === "Escape") closeModal();
        else trapFocus(modal, e);
    });

    // Legacy global fallbacks (kept minimal in case older inline handlers remain)
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.plusSlides = plusSlides;
    window.currentSlide = n => showSlides(slideIndex = n);

    // Optional gallery section switching
    const buttons = document.querySelectorAll(".gallery-navigation .btn");
    const sections = document.querySelectorAll(".gallery-content");
    if (buttons.length) {
        function showGallerySection(id) {
            sections.forEach(s => s.classList.remove("active"));
            buttons.forEach(b => b.classList.remove("active"));
            const target = document.getElementById(id);
            const btn = document.querySelector(`[data-section="${id}"]`);
            if (target) target.classList.add("active");
            if (btn) btn.classList.add("active");
        }
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-section");
                if (id) showGallerySection(id);
            });
        });
        const firstId = buttons[0].getAttribute("data-section");
        if (firstId) showGallerySection(firstId);
    }
});
