// --- CONFIGURAÇÃO: GOOGLE SHEETS ---
// 1. Cole aqui a URL gerada no seu App Script (veja CONEXAO_PLANILHA.md)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyDpDenum_8Azss41UZmFqyjpgt_kAo0v5uAnDVa8Ufp2sr-jW69OQ2sZUN8tfeek5/exec"; 

// Form Submission Handling
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("Iniciando envio do formulário...");
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('span') : null;
    const btnIcon = submitBtn ? (submitBtn.querySelector('i') || submitBtn.querySelector('svg')) : null;
    const btnSpinner = document.getElementById('btnSpinner');
    const successMsg = document.getElementById('successMessage');
    
    // START LOADING STATE
    if (submitBtn) submitBtn.disabled = true;
    const originalBtnText = btnText ? btnText.innerText : "";
    
    if (btnText) {
        btnText.innerText = "Enviando...";
        btnText.style.opacity = '0.7';
    }
    if (btnIcon) btnIcon.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'block';
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // --- ENVIO 1: FORMSUBMIT (E-MAIL) ---
        // Usamos fetch para FormSubmit para evitar o redirect
        const formSubmitPromise = fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // --- ENVIO 2: GOOGLE SHEETS (OPCIONAL) ---
        // Se a URL do script estiver configurada, envia para a planilha também
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para Google Scripts
                body: JSON.stringify(data),
            });
            console.log("Dados enviados para Google Sheets.");
        }

        const response = await formSubmitPromise;
        const result = await response.json();
        
        if (response.ok) {
            // SUCCESS
            form.style.display = 'none';
            successMsg.style.display = 'block';
            
            // Trigger animation
            successMsg.classList.add('fadeIn');
            
            // Clear form
            form.reset();
            console.log('Inscrição enviada com sucesso:', result);
        } else {
            throw new Error('Falha no envio dos dados para FormSubmit');
        }
    } catch (error) {
        // Mensagem de erro amigável
        alert('Erro ao enviar inscrição. Por favor, tente novamente ou entre em contato com a organização.');
        console.error('Submission Error:', error);
    } finally {
        // END LOADING STATE
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) {
            btnText.innerText = originalBtnText || "Finalizar Inscrição";
            btnText.style.opacity = '1';
        }
        if (btnIcon) btnIcon.style.display = 'block';
        if (btnSpinner) btnSpinner.style.display = 'none';
    }
});

// Function to reset form visibility after success (if needed)
function resetForm() {
    const form = document.getElementById('registrationForm');
    const successMsg = document.getElementById('successMessage');
    
    form.style.display = 'block';
    successMsg.style.display = 'none';
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

// Navigation / Tooltip animations or small UI enhancements could be added here
lucide.createIcons();
