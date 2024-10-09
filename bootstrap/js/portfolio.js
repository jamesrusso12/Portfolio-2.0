// Function to toggle the side menu
function toggleMenu() {
    const menu = document.getElementById("sidemenu");
    menu.style.right = menu.style.right === "0px" ? "-200px" : "0";
}

// Add event listeners to each portfolio item for preview functionality
document.querySelectorAll('.portfolio-item__demo').forEach(item => {
    item.addEventListener('click', function() {
        const demoUrl = this.closest('.portfolio-item__wrapper').dataset.demo;
        const iframeContent = document.getElementById('iframe-content');
        iframeContent.innerHTML = `
            <div class="iframe-wrapper">
                <iframe src="${demoUrl}" frameborder="0"></iframe>
            </div>
        `;
        iframeContent.style.display = 'block';
    });
});


// Function to close the preview
function closePreview() {
    document.getElementById('iframe-content').style.display = 'none';
}
