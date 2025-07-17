document.addEventListener('DOMContentLoaded', function() {
    // Get the form and status elements
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Add a submit event listener to the form
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission (which causes a page reload)
        event.preventDefault();

        // --- NEW VALIDATION CHECK ---
        // Check if the form's fields are all valid according to their attributes (required, pattern, etc.)
        if (form.checkValidity()) {
            // If the form IS valid, proceed with sending the data
            const formData = new FormData(form);
            const action = form.getAttribute('action');
            const method = form.getAttribute('method');

            // Show a "Sending..." message
            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#333';

            // Use the Fetch API to submit the data
            fetch(action, {
                method: method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = currentTranslations.form_success_message;
                    formStatus.style.color = 'green';
                    form.reset(); // Clear the form fields
                } else {
                    formStatus.textContent = currentTranslations.form_error_message;
                    formStatus.style.color = 'red';
                }
            }).catch(error => {
                console.error('Error:', error);
                formStatus.textContent = currentTranslations.form_networkerror_message;
                formStatus.style.color = 'red';
            });

        } else {
            // If the form IS NOT valid, show an error message
            formStatus.textContent = currentTranslations.form_validation_message;
            formStatus.style.color = 'red';
        }
    });
});