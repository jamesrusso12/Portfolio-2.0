// Add event listeners for quick-view buttons
document.querySelectorAll('.quick-view').forEach(item => {
    item.addEventListener('click', function() {
        const portfolioItem = this.closest('.portfolio-item');
        const demoUrl = portfolioItem.querySelector('.portfolio-item__wrapper').dataset.demo;

        // Add a class to disable hover effects
        portfolioItem.classList.add('no-hover');

        const iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add('iframe-wrapper');
        iframeWrapper.innerHTML = `
            <iframe src="${demoUrl}"></iframe>
            <div class="devices-wrapper">
                <button onclick="closePreview(this)">Close</button>
                <button onclick="openInNewTab('${demoUrl}')">Open in New Tab</button>
            </div>
        `;
        portfolioItem.appendChild(iframeWrapper);
    });
});

// Function to close the preview and restore hover effects
function closePreview(button) {
    const iframeWrapper = button.closest('.iframe-wrapper');
    const portfolioItem = iframeWrapper.closest('.portfolio-item');
    iframeWrapper.remove();

    // Remove the class to enable hover effects again
    portfolioItem.classList.remove('no-hover');
}

// Function to open the preview in a new tab
function openInNewTab(url) {
    window.open(url, '_blank');
}

// Function to toggle the side menu
function toggleMenu() {
    const menu = document.getElementById("sidemenu");
    menu.style.right = menu.style.right === "0px" ? "-200px" : "0";
}