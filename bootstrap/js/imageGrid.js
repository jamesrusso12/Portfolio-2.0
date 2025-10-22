document.addEventListener("DOMContentLoaded", () => {

    // ===== MODAL HANDLING =====
    let slideIndex = 1;
    const modal = document.getElementById("myModal");
    const modalSlides = document.getElementById("modal-slides");
    const captionText = document.getElementById("caption");

    window.openModal = function (section) {
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // prevent background scroll

        // Generate slides dynamically from the selected gallery section
        const slides = document.querySelectorAll(`#${section} .image-grid img`);
        modalSlides.innerHTML = "";

        slides.forEach((img, index) => {
            const slide = document.createElement("div");
            slide.className = "mySlides fade";
            slide.innerHTML = `
        <div class="numbertext">${index + 1} / ${slides.length}</div>
        <img src="${img.src}" alt="${img.alt}" class="modal-image">
      `;
            modalSlides.appendChild(slide);
        });

        showSlides(slideIndex = 1);
    };

    window.closeModal = function () {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    };

    // ===== SLIDE NAVIGATION =====
    window.plusSlides = function (n) { showSlides(slideIndex += n); };
    window.currentSlide = function (n) { showSlides(slideIndex = n); };

    function showSlides(n) {
        const slides = document.getElementsByClassName("mySlides");
        if (!slides.length) return;

        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        // Hide all slides
        [...slides].forEach(s => {
            s.style.display = "none";
            s.classList.remove("active");
        });
        
        // Show current slide
        slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add("active");
        captionText.innerHTML = `Image ${slideIndex} of ${slides.length}`;
    }

    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener("keydown", e => {
        if (modal.style.display === "block") {
            if (e.key === "ArrowLeft") plusSlides(-1);
            if (e.key === "ArrowRight") plusSlides(1);
            if (e.key === "Escape") closeModal();
        }
    });

    // ===== GALLERY SECTION SWITCHING =====
    const buttons = document.querySelectorAll(".gallery-navigation .btn");
    const sections = document.querySelectorAll(".gallery-content");

    function showGallerySection(sectionId) {
        sections.forEach(s => s.classList.remove("active"));
        buttons.forEach(b => b.classList.remove("active"));
        document.getElementById(sectionId).classList.add("active");
        document.querySelector(`[data-section="${sectionId}"]`).classList.add("active");
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const sectionId = button.getAttribute("data-section");
            showGallerySection(sectionId);
        });
    });

    // Set Unity gallery active by default
    showGallerySection("unity-gallery");
});
