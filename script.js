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
    const modalTriggers = document.querySelectorAll('.modal-trigger');
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

    // Open Modal (handle multiple buttons)
    if (modalTriggers) {
        modalTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                resetModal();
            });
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


// Sidebar Toggles
const sidebarHeaders = document.querySelectorAll('.group-header');

sidebarHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const group = header.parentElement;
        group.classList.toggle('active');
    });
});


// Help Page Search Functionality
const helpSearchInput = document.querySelector('.help-search');
if (helpSearchInput) {
    helpSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // Filter FAQs
        const faqItems = document.querySelectorAll('.faq-item');
        let hasFaqResults = false;

        faqItems.forEach(item => {
            const question = item.querySelector('h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-body').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                hasFaqResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Filter Categories
        const categories = document.querySelectorAll('.category-card');
        let hasCategoryResults = false;

        categories.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = 'block';
                hasCategoryResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Optional: Toggle section visibility if no results (can be improved)
    });
}


// --- Profit Calculator Logic ---
const agressiveProfitPerHour = 1.12; // Fixed for $100
const flipProfitPerHour = 4.20; // Fixed for $100 Flip Mode
const safeProfitPerHourBase = 1.54; // Per $1000
let currentMode = 'safe'; // Default

function selectMode(mode) {
    currentMode = mode;
    const slider = document.getElementById('capital-slider');
    const depositDisplay = document.getElementById('deposit-display');
    const depositLabelMin = document.getElementById('min-label');
    const depositLabelMax = document.getElementById('max-label');
    const btns = document.querySelectorAll('.mode-btn');

    btns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode='${mode}']`).classList.add('active');

    if (mode === 'aggressive') {
        slider.disabled = true;
        slider.value = 100;
        depositDisplay.textContent = '$100 (Fixed)';
        depositLabelMin.textContent = '$100';
        depositLabelMax.textContent = '$100';
    } else if (mode === 'flip') {
        slider.disabled = true;
        slider.value = 100;
        depositDisplay.textContent = '$100 (Fixed)';
        depositLabelMin.textContent = '$100';
        depositLabelMax.textContent = '$100';
    } else {
        slider.disabled = false;
        slider.min = 1000;
        slider.max = 50000;
        slider.step = 1000;
        slider.value = 1000;
        depositDisplay.textContent = '$1,000';
        depositLabelMin.textContent = '$1,000';
        depositLabelMax.textContent = '$50,000';
    }
    calculateProfit();
}

function calculateProfit() {
    const slider = document.getElementById('capital-slider');
    const depositDisplay = document.getElementById('deposit-display');
    const hourlyEl = document.getElementById('hourly-profit');
    const dailyEl = document.getElementById('daily-profit');
    const weeklyEl = document.getElementById('weekly-profit');
    const monthlyEl = document.getElementById('monthly-profit');

    let capital = parseFloat(slider.value);
    let hourlyProfit = 0;

    if (currentMode === 'aggressive') {
        capital = 100;
        hourlyProfit = agressiveProfitPerHour;
    } else if (currentMode === 'flip') {
        capital = 100;
        hourlyProfit = flipProfitPerHour;
    } else {
        // Safe Steady scaling
        hourlyProfit = (capital / 1000) * safeProfitPerHourBase;
        depositDisplay.textContent = '$' + capital.toLocaleString();
    }

    // Gross Calculations
    const hourlyGross = hourlyProfit;
    const dailyGross = hourlyGross * 22;
    const weeklyGross = dailyGross * 5;
    const monthlyGross = dailyGross * 22;

    // Apply 20% Deduction
    const hourlyNet = hourlyGross * 0.80;
    const dailyNet = dailyGross * 0.80;
    const weeklyNet = weeklyGross * 0.80;

    // Monthly Breakdown
    const profitShare = monthlyGross * 0.20;
    const monthlyNet = monthlyGross - profitShare;

    // Monthly Elements
    const monthlyGrossEl = document.getElementById('monthly-gross');
    const deductionEl = document.getElementById('monthly-deduction');
    const monthlyNetEl = document.getElementById('monthly-net');

    hourlyEl.textContent = '$' + hourlyNet.toFixed(2);
    if (dailyEl) dailyEl.textContent = '$' + dailyNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (weeklyEl) weeklyEl.textContent = '$' + weeklyNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Update Breakdown
    if (monthlyGrossEl) monthlyGrossEl.textContent = '$' + monthlyGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (deductionEl) deductionEl.textContent = '-$' + profitShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (monthlyNetEl) monthlyNetEl.textContent = '$' + monthlyNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Initialize calculator listeners
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('capital-slider');
    if (slider) {
        slider.addEventListener('input', calculateProfit);
        // Set initial state
        selectMode('safe');
    }
});

