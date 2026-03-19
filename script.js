// --- CONFIGURAÇÃO: GOOGLE SHEETS ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyDpDenum_8Azss41UZmFqyjpgt_kAo0v5uAnDVa8Ufp2sr-jW69OQ2sZUN8tfeek5/exec"; 

// --- MULTI-STEP FORM NAVIGATION ---
const steps = document.querySelectorAll('.form-step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
let currentStep = 1;

function updateSteps() {
    steps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === currentStep) {
            step.classList.add('active');
        }
    });

    // Update Progress
    const progress = (currentStep / steps.length) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Update Buttons
    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
    
    if (currentStep === steps.length) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'flex';
    } else {
        if (nextBtn) nextBtn.style.display = 'flex';
        if (submitBtn) submitBtn.style.display = 'none';
    }

    // Focus first input of the step
    const activeStep = document.querySelector('.form-step.active');
    activeStep?.querySelector('input, textarea')?.focus();
}

function validateStep() {
    const activeStep = document.querySelector('.form-step.active');
    const inputs = activeStep?.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs?.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.parentElement.classList.add('shake');
            setTimeout(() => input.parentElement.classList.remove('shake'), 400);
        }
    });

    return isValid;
}

nextBtn?.addEventListener('click', () => {
    if (validateStep()) {
        currentStep++;
        updateSteps();
    }
});

prevBtn?.addEventListener('click', () => {
    currentStep--;
    updateSteps();
});

// Initialize Steps
updateSteps();

// Form Submission Handling
document.getElementById('registrationForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const btnText = submitBtn?.querySelector('span');
    const btnIcon = submitBtn?.querySelector('i, svg');
    const btnSpinner = document.getElementById('btnSpinner');
    const successMsg = document.getElementById('successMessage');
    const progressContainer = document.querySelector('.progress-container');
    
    if (!submitBtn) return;

    submitBtn.disabled = true;
    const originalBtnText = btnText ? btnText.innerText : "Finalizar Inscrição";
    
    if (btnText) {
        btnText.innerText = "Processando...";
    }
    if (btnIcon) btnIcon.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'block';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const formSubmitPromise = fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let sheetsPromise = Promise.resolve();
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
            sheetsPromise = fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data),
            });
        }

        const [response] = await Promise.all([formSubmitPromise, sheetsPromise]);
        
        if (response.ok) {
            form.style.display = 'none';
            if (progressContainer) progressContainer.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.focus();
            form.reset();
        } else {
            throw new Error('Falha no servidor');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        alert('Ops! Tivemos um problema técnico. Por favor, tente novamente.');
    } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.innerText = originalBtnText;
        if (btnIcon) btnIcon.style.display = 'block';
        if (btnSpinner) btnSpinner.style.display = 'none';
        lucide.createIcons();
    }
});

// Function to reset form visibility
function resetForm() {
    const form = document.getElementById('registrationForm');
    const successMsg = document.getElementById('successMessage');
    
    if (form && successMsg) {
        form.style.display = 'block';
        successMsg.style.display = 'none';
        // Focus first input
        form.querySelector('input')?.focus();
    }
}

// Visual Effects on Input Focus
document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('focus', () => {
        element.parentElement.style.zIndex = "10";
    });
    
    element.addEventListener('blur', () => {
        element.parentElement.style.zIndex = "1";
    });
});

// Initialize Icons
lucide.createIcons();

// Parallax effect for the hero image
const imageContainer = document.querySelector('.image-container');
const heroImage = document.querySelector('.hero-image');

if (imageContainer && heroImage) {
    imageContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = imageContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        const rotateY = x * 30; // Tilt intensity
        const rotateX = -y * 30;
        
        heroImage.style.transform = `rotateY(${rotateY - 15}deg) rotateX(${rotateX + 5}deg) scale(1.03)`;
        heroImage.style.filter = `brightness(1) contrast(1.1) drop-shadow(${x * 50}px ${y * 50}px 30px rgba(0,0,0,0.5))`;
    });

    imageContainer.addEventListener('mouseleave', () => {
        heroImage.style.transform = `rotateY(-15deg) rotateX(5deg) scale(1)`;
        heroImage.style.filter = `brightness(0.8) contrast(1.1)`;
    });
}

