document.addEventListener("DOMContentLoaded", function () {
    // Lightbox Setup
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    document.body.appendChild(lightbox);

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <div id="lightbox-inner"></div>
        </div>`;

    const lightboxInner = document.getElementById("lightbox-inner");
    const closeLightbox = document.querySelector(".close-lightbox");

    // Image Gallery Navigation (Unity, Web, Unreal)
    function showGallerySection(sectionId) {
        document.querySelectorAll(".gallery-content").forEach(section => {
            section.classList.remove("active");
        });

        document.getElementById(sectionId).classList.add("active");
    }

    document.querySelectorAll(".gallery-navigation .btn").forEach(button => {
        button.addEventListener("click", function () {
            const sectionId = this.getAttribute("data-section");
            showGallerySection(sectionId);
        });
    });

    // Set default section (Unity Gallery)
    showGallerySection('unity-gallery');

    // Lightbox Functionality (Enlarging Images & Videos)
    document.querySelectorAll(".image-grid img, .image-grid video").forEach(media => {
        media.addEventListener("click", function () {
            lightbox.classList.add("show");

            if (this.tagName === "VIDEO") {
                lightboxInner.innerHTML = `
                    <video controls autoplay>
                        <source src="${this.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
            } else {
                lightboxInner.innerHTML = `<img src="${this.src}" alt="Expanded Image">`;
            }
        });
    });

    // Lightbox Closing
    closeLightbox.addEventListener("click", function () {
        lightbox.classList.remove("show");
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox || e.target.classList.contains("close-lightbox")) {
            lightbox.classList.remove("show");
        }
    });
});
