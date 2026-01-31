/**
 * Lead Form Handler
 *
 * Handles contact form submission with Supabase integration.
 * Includes validation, submission to database, and graceful fallback.
 */

/**
 * Validate form data
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with isValid and errors
 */
function validateLeadForm(formData) {
    const errors = [];

    // Required field validation
    if (!formData.firstName || formData.firstName.trim() === '') {
        errors.push('Le prenom est requis');
    }

    if (!formData.lastName || formData.lastName.trim() === '') {
        errors.push('Le nom est requis');
    }

    if (!formData.email || formData.email.trim() === '') {
        errors.push('L\'email est requis');
    } else if (!isValidEmail(formData.email)) {
        errors.push('L\'email n\'est pas valide');
    }

    if (!formData.restaurant || formData.restaurant.trim() === '') {
        errors.push('Le nom du restaurant est requis');
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && formData.phone.trim() !== '') {
        const cleanPhone = formData.phone.replace(/\s/g, '');
        if (!/^(\+33|0)[0-9]{9}$/.test(cleanPhone)) {
            errors.push('Le numero de telephone n\'est pas valide');
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Extract form data from form element
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data object
 */
function extractFormData(form) {
    return {
        firstName: form.querySelector('#firstName')?.value || '',
        lastName: form.querySelector('#lastName')?.value || '',
        email: form.querySelector('#email')?.value || '',
        phone: form.querySelector('#phone')?.value || '',
        restaurant: form.querySelector('#restaurant')?.value || '',
        type: form.querySelector('#type')?.value || 'demo',
        message: form.querySelector('#message')?.value || ''
    };
}

/**
 * Submit lead data to Supabase
 * @param {Object} leadData - Lead data to submit
 * @returns {Promise<Object>} Result with success status and data/error
 */
async function submitLeadToSupabase(leadData) {
    const client = getSupabaseClient();

    if (!client) {
        return {
            success: false,
            error: 'Supabase client not available',
            fallback: true
        };
    }

    try {
        // Map form fields to database columns
        const dbRecord = {
            first_name: leadData.firstName.trim(),
            last_name: leadData.lastName.trim(),
            email: leadData.email.trim().toLowerCase(),
            phone: leadData.phone ? leadData.phone.trim() : null,
            restaurant_name: leadData.restaurant.trim(),
            request_type: leadData.type,
            message: leadData.message ? leadData.message.trim() : null,
            source: 'landing_page'
        };

        const { data, error } = await client
            .from('leads')
            .insert(dbRecord)
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            return {
                success: false,
                error: error.message,
                fallback: false
            };
        }

        console.log('Lead submitted successfully:', data);
        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error('Lead submission error:', error);
        return {
            success: false,
            error: error.message,
            fallback: false
        };
    }
}

/**
 * Show validation errors to user
 * @param {HTMLFormElement} form - The form element
 * @param {Array<string>} errors - Array of error messages
 */
function showValidationErrors(form, errors) {
    // Remove existing error messages
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(el => el.remove());

    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: rgba(220, 38, 38, 0.1);
        border: 2px solid #DC2626;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #991B1B;
    `;

    const errorList = errors.map(err => `<li>${err}</li>`).join('');
    errorContainer.innerHTML = `
        <strong>Veuillez corriger les erreurs suivantes :</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">${errorList}</ul>
    `;

    // Insert at top of form
    form.insertBefore(errorContainer, form.firstChild);
}

/**
 * Show success message
 * @param {HTMLFormElement} form - The form element
 * @param {HTMLElement} successMessage - The success message element
 */
function showSuccessMessage(form, successMessage) {
    // Remove any error messages
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(el => el.remove());

    // Hide form and show success
    form.style.display = 'none';
    successMessage.classList.add('show');
}

/**
 * Reset form after success display
 * @param {HTMLFormElement} form - The form element
 * @param {HTMLElement} successMessage - The success message element
 * @param {number} delay - Delay in milliseconds before reset
 */
function resetFormAfterDelay(form, successMessage, delay = 5000) {
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMessage.classList.remove('show');
    }, delay);
}

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
async function handleLeadFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const successMessage = document.getElementById('formSuccess');
    const submitButton = form.querySelector('button[type="submit"]');

    // Extract and validate form data
    const formData = extractFormData(form);
    const validation = validateLeadForm(formData);

    if (!validation.isValid) {
        showValidationErrors(form, validation.errors);
        return;
    }

    // Disable submit button during submission
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Envoi en cours...';

    try {
        // Attempt to submit to Supabase
        const result = await submitLeadToSupabase(formData);

        if (result.success || result.fallback) {
            // Show success even in fallback mode (for demo purposes)
            // In production, you might want to handle fallback differently
            if (result.fallback) {
                console.log('Form submitted in fallback mode (Supabase unavailable)');
                console.log('Lead data:', formData);
            }

            showSuccessMessage(form, successMessage);
            resetFormAfterDelay(form, successMessage);
        } else {
            // Show error to user
            showValidationErrors(form, [
                'Une erreur est survenue lors de l\'envoi. Veuillez reessayer.'
            ]);
        }

    } catch (error) {
        console.error('Form submission error:', error);
        showValidationErrors(form, [
            'Une erreur est survenue. Veuillez reessayer ou nous contacter directement.'
        ]);
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Remove any existing handlers by cloning and replacing
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        // Add our handler
        newForm.addEventListener('submit', handleLeadFormSubmit);
        console.log('Lead form handler initialized');
    }
});
