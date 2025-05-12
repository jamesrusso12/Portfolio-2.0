document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
  
    sidebar.classList.add("collapsed");
  
    toggleNavOnMobile();
  
    const sidebarToggler = document.querySelector(".sidebar-toggler");
    const menuToggler = document.querySelector(".menu-toggler");
  
    sidebarToggler.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  
    menuToggler.addEventListener("click", () => {
      sidebar.classList.toggle("menu-active");
    });
  
    let collapsedSidebarHeight = "56px"; 
    let fullSidebarHeight = "calc(100vh - 32px)"; 
  
    window.addEventListener("resize", () => {
      toggleNavOnMobile();
  
      if (window.innerWidth >= 1024) {
        sidebar.style.height = fullSidebarHeight;
      } else {
        sidebar.classList.remove("collapsed");
        sidebar.style.height = "auto";
      }
    });
  });
  
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
  