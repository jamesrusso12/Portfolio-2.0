document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
  
    // Initially collapsed on load
    sidebar.classList.add("collapsed");
  
    // Hide sidebar on mobile, show on desktop
    toggleNavOnMobile();
  
    // Toggler references
    const sidebarToggler = document.querySelector(".sidebar-toggler");
    const menuToggler = document.querySelector(".menu-toggler");
  
    // If you want the ability to collapse or expand the sidebar on larger screens:
    sidebarToggler.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  
    // On smaller screens (<= 1024px), we show/hide via .menu-active:
    menuToggler.addEventListener("click", () => {
      sidebar.classList.toggle("menu-active");
    });
  
    // If you want to dynamically handle heights (optional):
    let collapsedSidebarHeight = "56px"; // example from the snippet
    let fullSidebarHeight = "calc(100vh - 32px)"; // or your custom
  
    window.addEventListener("resize", () => {
      // Hide sidebar if mobile, show if desktop
      toggleNavOnMobile();
  
      if (window.innerWidth >= 1024) {
        sidebar.style.height = fullSidebarHeight;
      } else {
        sidebar.classList.remove("collapsed");
        sidebar.style.height = "auto";
      }
    });
  });
  
  /**
   * Hides the sidebar entirely on mobile (≤ 768px),
   * shows it otherwise.
   */
  function toggleNavOnMobile() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
  
    if (window.innerWidth <= 768) {
      // Hide the entire sidebar
      sidebar.style.display = "none";
    } else {
      // Show it again
      sidebar.style.display = "block";
    }
  }
  