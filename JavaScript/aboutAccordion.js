// aboutAccordion.js - Mobile accordion functionality for About section
(function() {
    "use strict";

    const MOBILE_BREAKPOINT = 768;
    let isInitialized = false;
    let clickHandlers = [];

    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function handleSkillCardClick(e) {
        // Don't toggle if clicking on a link inside
        if (e.target.tagName === "A") return;
        
        // Only work on mobile
        if (!isMobile()) return;
        
        this.classList.toggle("expanded");
    }

    function handleHighlightsTitleClick() {
        // Only work on mobile
        if (!isMobile()) return;
        
        const highlightsSection = document.querySelector("#about .skills-proof");
        if (highlightsSection) {
            highlightsSection.classList.toggle("expanded");
        }
    }

    function initAccordion() {
        if (isInitialized) return;
        
        // Skill cards accordion
        const skillCards = document.querySelectorAll("#about .skill-card");
        skillCards.forEach(card => {
            card.addEventListener("click", handleSkillCardClick);
            clickHandlers.push({ element: card, handler: handleSkillCardClick });
        });

        // Highlights section accordion
        const highlightsSection = document.querySelector("#about .skills-proof");
        if (highlightsSection) {
            const highlightsTitle = highlightsSection.querySelector("h3");
            if (highlightsTitle) {
                highlightsTitle.addEventListener("click", handleHighlightsTitleClick);
                clickHandlers.push({ element: highlightsTitle, handler: handleHighlightsTitleClick });
            }
        }

        isInitialized = true;
        
        // Set initial state based on current viewport
        updateAccordionState();
    }

    function updateAccordionState() {
        const skillCards = document.querySelectorAll("#about .skill-card");
        const highlightsSection = document.querySelector("#about .skills-proof");
        
        if (isMobile()) {
            // On mobile: collapse all, then expand first card
            skillCards.forEach((card, index) => {
                if (index === 0) {
                    card.classList.add("expanded");
                } else {
                    card.classList.remove("expanded");
                }
            });
            // Keep highlights collapsed by default on mobile
            if (highlightsSection) {
                highlightsSection.classList.remove("expanded");
            }
        } else {
            // On desktop: remove all expanded classes (CSS handles full display)
            skillCards.forEach(card => {
                card.classList.remove("expanded");
            });
            if (highlightsSection) {
                highlightsSection.classList.remove("expanded");
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAccordion);
    } else {
        // DOM already loaded
        initAccordion();
    }

    // Handle window resize to update state when switching between mobile/desktop
    let resizeTimer;
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateAccordionState, 150);
    });
})();
