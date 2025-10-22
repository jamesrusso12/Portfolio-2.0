// Google Sheets form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById("msg");

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            // Show loading state
            msg.innerHTML = "Sending...";
            msg.style.color = "#00CED1";
            msg.style.opacity = 1;

            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form)
            })
            .then(response => {
                msg.innerHTML = "Message sent successfully!";
                msg.style.color = "#61b752";
                form.reset();
            })
            .catch(error => {
                msg.innerHTML = "Error! Message not sent. Please try again.";
                msg.style.color = "#ff4d4d";
                console.error('Error!', error.message);
            })
            .finally(() => {
                // Fade out after 5 seconds
                setTimeout(() => {
                    msg.style.opacity = 0;
                    msg.innerHTML = "";
                }, 5000);
            });
        });
    }
});
