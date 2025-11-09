// ===============================================
// PRICING PAGE - INTERACTIVE FEATURES
// ===============================================

// Billing toggle
const billingToggle = document.getElementById('billingToggle');
const priceAmounts = document.querySelectorAll('.amount');

if (billingToggle) {
    billingToggle.addEventListener('change', function() {
        const isYearly = this.checked;
        
        priceAmounts.forEach(amount => {
            if (amount.classList.contains('custom')) return;
            
            const monthly = amount.getAttribute('data-monthly');
            const yearly = amount.getAttribute('data-yearly');
            
            if (isYearly) {
                amount.textContent = yearly;
            } else {
                amount.textContent = monthly;
            }
        });
    });
}

// FAQ Accordion
function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Initialize first FAQ item as open
document.addEventListener('DOMContentLoaded', () => {
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
        firstFaq.classList.add('active');
    }
});
