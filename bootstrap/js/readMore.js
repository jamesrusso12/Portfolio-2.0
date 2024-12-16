//JavaScript for Read More Functionality
function toggleReadMore(button) {
    var parent = button.previousElementSibling;
    var dots = parent.querySelector(".dots");
    var moreText = parent.querySelector(".more-content");

    if (dots.style.display === "none") {
        dots.style.display = "inline";
        button.innerHTML = "Read more";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        button.innerHTML = "Read less";
        moreText.style.display = "inline";
    }
}
