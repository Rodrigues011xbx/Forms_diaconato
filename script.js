// --- CONFIGURAÇÃO: GOOGLE SHEETS ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyDpDenum_8Azss41UZmFqyjpgt_kAo0v5uAnDVa8Ufp2sr-jW69OQ2sZUN8tfeek5/exec"; 

// Form Submission Handling
document.getElementById('registrationForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn?.querySelector('span');
    const btnIcon = submitBtn?.querySelector('i, svg');
    const btnSpinner = document.getElementById('btnSpinner');
    const successMsg = document.getElementById('successMessage');
    
    // Validate if button exists
    if (!submitBtn) return;

    // START LOADING STATE
    submitBtn.disabled = true;
    const originalBtnText = btnText ? btnText.innerText : "Finalizar Inscrição";
    
    if (btnText) {
        btnText.innerText = "Processando...";
        btnText.style.opacity = '0.7';
    }
    if (btnIcon) btnIcon.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'block';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // --- ENVIO 1: FORMSUBMIT (E-MAIL) ---
        const formSubmitPromise = fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // --- ENVIO 2: GOOGLE SHEETS (OPCIONAL) ---
        let sheetsPromise = Promise.resolve();
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
            sheetsPromise = fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data),
            });
        }

        // Wait for both but prioritize FormSubmit result for the UI
        const [response] = await Promise.all([formSubmitPromise, sheetsPromise]);
        
        if (response.ok) {
            // SUCCESS
            form.style.display = 'none';
            successMsg.style.display = 'block';
            
            // Focus on success message for screen readers
            successMsg.focus();
            
            form.reset();
            console.log('Inscrição enviada com sucesso');
        } else {
            throw new Error('Falha no servidor');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        alert('Ops! Tivemos um problema técnico. Por favor, tente novamente ou fale conosco diretamente.');
    } finally {
        // END LOADING STATE
        submitBtn.disabled = false;
        if (btnText) {
            btnText.innerText = originalBtnText;
            btnText.style.opacity = '1';
        }
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

