function showMessage(event) {
    event.preventDefault(); // Prevent default form submission
    var form = event.target;
    var formData = new FormData(form);

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    }).then(response => {
        if (response.ok) {
            document.getElementById("msg").innerHTML = "Message sent successfully!";
            form.reset();
            setTimeout(() => document.getElementById("msg").innerHTML = "", 5000);
        } else {
            document.getElementById("msg").innerHTML = "Failed to send message!";
        }
    }).catch(() => {
        document.getElementById("msg").innerHTML = "Failed to send message!";
    });

    return false;
}