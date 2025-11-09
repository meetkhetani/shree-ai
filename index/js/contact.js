// ===============================================
// CONTACT PAGE - FORM VALIDATION
// ===============================================

const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            topic: document.getElementById('topic').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.topic || !formData.message) {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address!');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        contactForm.reset();
        
        // Log to console (in real app, this would send to server)
        console.log('Form submitted:', formData);
    });
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeSuccessModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeSuccessModal();
    }
});

// Form field validation on blur
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value) {
                input.style.borderColor = 'var(--color-error)';
            } else {
                input.style.borderColor = 'var(--color-gray-200)';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--color-primary)';
        });
    });
}
