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

// ----------------------------------------------------
// THEME TOGGLE LOGIC
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");

    if (!toggleBtn || !icon) return; // safeguard if not found

    // Determine the current theme: check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    // Apply theme and sync icon immediately on page load
    document.documentElement.setAttribute("data-theme", currentTheme);
    icon.textContent = currentTheme === "dark" ? "light_mode" : "dark_mode";

    // Toggle on click
    toggleBtn.addEventListener("click", () => {
        const activeTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = activeTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        icon.textContent = newTheme === "dark" ? "light_mode" : "dark_mode";
    });
});
