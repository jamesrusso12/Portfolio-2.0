// navMenu.js (top nav version)
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".topnav");
    const burger = document.querySelector(".hamburger");
    const links = document.querySelector(".nav-links");
    let lastY = window.pageYOffset;

    // Hamburger toggle
    if (burger && links) {
        burger.addEventListener("click", () => {
            const open = links.classList.toggle("open");
            burger.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // Close menu when a link is clicked (mobile)
        links.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                links.classList.remove("open");
                burger.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Auto hide on scroll down, show on scroll up
    window.addEventListener("scroll", () => {
        const y = window.pageYOffset || 0;
        if (y > 120) {
            if (y > lastY) nav.classList.add("hide");
            else nav.classList.remove("hide");
        } else {
            nav.classList.remove("hide");
        }
        lastY = y;
    });
});
