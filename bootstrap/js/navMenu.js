document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggler = document.querySelector(".sidebar-toggler");
    const menuToggler = document.querySelector(".menu-toggler");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

    if (!sidebar || !sidebarToggler || !menuToggler) return;

    const DESKTOP_WIDTH = 1024;
    const LS_KEY = "sidebar-collapsed";

    // Helpers
    const isDesktop = () => window.innerWidth >= DESKTOP_WIDTH;

    function applyDesktopState() {
        const collapsed = localStorage.getItem(LS_KEY) === "true";
        sidebar.classList.toggle("collapsed", collapsed);
        sidebar.classList.remove("menu-active");
        sidebar.removeAttribute("aria-hidden");
    }

    function applyMobileState() {
        sidebar.classList.remove("collapsed");
        sidebar.classList.remove("menu-active");
        sidebar.setAttribute("aria-hidden", "true");
    }

    function syncLayout() {
        if (isDesktop()) {
            applyDesktopState();
        } else {
            applyMobileState();
        }
    }

    // Initial layout
    syncLayout();

    // Toggle handlers
    sidebarToggler.setAttribute("aria-expanded", String(!sidebar.classList.contains("collapsed")));
    sidebarToggler.addEventListener("click", () => {
        if (isDesktop()) {
            const nowCollapsed = !sidebar.classList.contains("collapsed");
            sidebar.classList.toggle("collapsed");
            localStorage.setItem(LS_KEY, String(nowCollapsed));
            sidebarToggler.setAttribute("aria-expanded", String(!nowCollapsed));
        } else {
            // On mobile, open the menu panel (not collapse)
            sidebar.classList.add("menu-active");
            sidebar.removeAttribute("aria-hidden");
            menuToggler.setAttribute("aria-expanded", "true");
        }
    });

    menuToggler.setAttribute("aria-expanded", "false");
    menuToggler.addEventListener("click", () => {
        const active = sidebar.classList.toggle("menu-active");
        if (active) sidebar.removeAttribute("aria-hidden");
        else sidebar.setAttribute("aria-hidden", "true");
        menuToggler.setAttribute("aria-expanded", String(active));
    });

    // Close menu on link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (!isDesktop()) {
                sidebar.classList.remove("menu-active");
                sidebar.setAttribute("aria-hidden", "true");
                menuToggler.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Resize handling
    window.addEventListener("resize", syncLayout);
});