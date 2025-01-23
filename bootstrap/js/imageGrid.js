document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".gallery-navigation .btn");
    const sections = document.querySelectorAll(".gallery-content");

    function showGallerySection(sectionId) {
        sections.forEach(section => {
            section.classList.remove("active");
        });

        document.getElementById(sectionId).classList.add("active");
    }

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const sectionId = this.getAttribute("data-section");
            showGallerySection(sectionId);
        });
    });

    // Set default section (Unity Gallery)
    showGallerySection('unity-gallery');

    // Lightbox Functionality
    const lightbox = document.getElementById("lightbox");
    const lightboxContent = document.getElementById("lightbox-content");
    const closeLightbox = document.querySelector(".close-lightbox");

    document.querySelectorAll(".image-grid img, .image-grid video").forEach(media => {
        media.addEventListener("click", function () {
            lightbox.classList.add("show");

            if (this.tagName === "VIDEO") {
                lightboxContent.innerHTML = `
                    <video controls autoplay>
                        <source src="${this.querySelector('source') ? this.querySelector('source').src : this.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
            } else {
                lightboxContent.innerHTML = `<img src="${this.src}" alt="Expanded Image">`;
            }
        });
    });

    closeLightbox.addEventListener("click", function () {
        lightbox.classList.remove("show");
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
            lightbox.classList.remove("show");
        }
    });
});
