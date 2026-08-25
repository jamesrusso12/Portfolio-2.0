function showMessage(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const msg = document.getElementById("msg");
    if (!msg) return false;

    msg.style.opacity = 0;
    msg.classList.remove("form-msg--success", "form-msg--error");

    const setMessage = (text, state) => {
        msg.textContent = text;
        msg.classList.add(state === "success" ? "form-msg--success" : "form-msg--error");
        msg.style.opacity = 1;
        setTimeout(() => {
            msg.style.opacity = 0;
            msg.textContent = "";
            msg.classList.remove("form-msg--success", "form-msg--error");
        }, 5000);
    };

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    })
        .then(response => {
            if (response.ok) {
                setMessage("Message sent successfully!", "success");
                form.reset();
            } else {
                setMessage("Failed to send message. Please try again.", "error");
            }
        })
        .catch(() => {
            setMessage("Network error. Please try again later.", "error");
        });

    return false;
}
