document.addEventListener("DOMContentLoaded", function () {
    // Expose openModal globally
    window.openModal = function (section) {
        document.getElementById("myModal").style.display = "block";

        // Generate slides dynamically based on the selected section
        let slides = document.querySelectorAll(`#${section} .image-grid img`);
        let modalSlides = document.getElementById("modal-slides");
        modalSlides.innerHTML = "";

        slides.forEach((img, index) => {
            modalSlides.innerHTML += `
                <div class="mySlides">
                    <div class="numbertext">${index + 1} / ${slides.length}</div>
                    <img src="${img.src}" style="width:100%">
                </div>
            `;
        });

        showSlides(1);
    };

    // Expose closeModal globally
    window.closeModal = function () {
        document.getElementById("myModal").style.display = "none";
    };

    let slideIndex = 1;

    // Next/previous controls
    window.plusSlides = function (n) {
        showSlides(slideIndex += n);
    };

    // Thumbnail image controls
    window.currentSlide = function (n) {
        showSlides(slideIndex = n);
    };

    function showSlides(n) {
        let slides = document.getElementsByClassName("mySlides");
        let captionText = document.getElementById("caption");
        if (n > slides.length) { slideIndex = 1; }
        if (n < 1) { slideIndex = slides.length; }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
        captionText.innerHTML = `Image ${slideIndex} of ${slides.length}`;
    }

    // Filtering between Unity, Web, and Unreal sections
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

    showGallerySection('unity-gallery');  // Default section
});
