//JavaScript Code for Form Submission
const scriptURL = 'https://script.google.com/macros/s/AKfycbwc9eSEMNy4XTqUvX0S3UfOrmSghUTTsCwsn5QPkIrcrP3Oi9qWuSinn8eBjTemIezb/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            msg.innerHTML = "Message sent successfully!";
            setTimeout(function () {
                msg.innerHTML = "";
            }, 5000);
            form.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            msg.innerHTML = "Failed to send message!";
        });
});


