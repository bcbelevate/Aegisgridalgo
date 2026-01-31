document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu on click

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe specific fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Also observe cards for a staggered effect if added later
    document.querySelectorAll('.glass-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- Modal Logic ---
    const modal = document.getElementById('access-modal');
    const btn = document.getElementById('get-access-btn');
    const span = document.getElementsByClassName('close-modal')[0];

    // Steps
    const step1 = document.getElementById('modal-step-1');
    const stepPlan = document.getElementById('modal-step-plan'); // New Step
    const step2 = document.getElementById('modal-step-2');

    // Elements
    const backBtns = document.querySelectorAll('.back-btn'); // Multiple back buttons
    const accessOptionBtns = document.querySelectorAll('.access-option-btn');
    const planOptionBtns = document.querySelectorAll('.plan-option-btn'); // New buttons
    const formTitle = document.getElementById('form-title');
    const accessTypeInput = document.getElementById('access-type');
    const planTypeInput = document.getElementById('plan-type'); // New input
    const form = document.getElementById('access-form');

    // Open Modal
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            resetModal();
        });
    }

    // Close Modal
    if (span) {
        span.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.remove('active');
        }
    });

    // Step 1: Access Type Selection -> Go to Plan Selection
    accessOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            accessTypeInput.value = type;

            step1.style.display = 'none';
            stepPlan.style.display = 'block';
        });
    });

    // Step 1.5: Plan Selection -> Go to Form
    planOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            planTypeInput.value = plan;

            // Update Title
            formTitle.textContent = `${accessTypeInput.value} - ${plan}`;

            stepPlan.style.display = 'none';
            step2.style.display = 'block';
        });
    });

    // Back Buttons
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-to');

            if (target === 'step-1') {
                stepPlan.style.display = 'none';
                step1.style.display = 'block';
            } else if (target === 'step-plan') {
                step2.style.display = 'none';
                stepPlan.style.display = 'block';
            }
        });
    });

    function resetModal() {
        step1.style.display = 'block';
        stepPlan.style.display = 'none';
        step2.style.display = 'none';
        form.reset();
    }

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Thank you! Request submitted.\nType: ${accessTypeInput.value}\nPlan: ${planTypeInput.value}\nWe will contact you shortly.`);
        modal.classList.remove('active');
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
        // Toggle active class on the clicked item
        item.classList.toggle('active');
        
        // Optional: Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
    });
});

