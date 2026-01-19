/**
 * Auto-update copyright year in footer
 * Automatically sets the copyright year to the current year
 */

document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('year');

    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});
