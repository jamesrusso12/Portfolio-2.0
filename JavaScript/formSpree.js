function showMessage(event) {
    event.preventDefault(); // Prevent default form submission
    const form = event.target;
    const formData = new FormData(form);
    const msg = document.getElementById("msg");

    // Reset message and add transition
    msg.style.opacity = 0;

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    })
        .then(response => {
            if (response.ok) {
                msg.innerHTML = "Message sent successfully!";
                msg.style.color = "#61b752";
                form.reset();
            } else {
                msg.innerHTML = "Failed to send message. Please try again.";
                msg.style.color = "#ff4d4d";
            }
            msg.style.opacity = 1;

            // Smooth fade-out after delay
            setTimeout(() => {
                msg.style.opacity = 0;
                msg.innerHTML = "";
            }, 5000);
        })
        .catch(() => {
            msg.innerHTML = " Network error. Please try again later.";
            msg.style.color = "#ff4d4d";
            msg.style.opacity = 1;

            setTimeout(() => {
                msg.style.opacity = 0;
                msg.innerHTML = "";
            }, 5000);
        });

    return false;
}
