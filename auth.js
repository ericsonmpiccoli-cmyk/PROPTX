// ================================================
// auth.js - VERSÃO SEM CHAVE DE ATIVAÇÃO
// Totalmente limpo e sem obfuscation
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const licenseInput = document.getElementById('license-key'); // ainda existe no HTML antigo, mas será ignorado
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const authButton = document.getElementById('auth-button');
    const buttonText = document.getElementById('button-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    // ====================== VISIBILIDADE DA CHAVE ======================
    const toggleBtn = document.getElementById('toggle-visibility');
    const eyeIcon = document.getElementById('eye-icon');

    if (toggleBtn && eyeIcon) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = licenseInput.type === 'password';
            licenseInput.type = isPassword ? 'text' : 'password';
            eyeIcon.innerHTML = isPassword 
                ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />` 
                : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
        });
    }

    // ====================== SUBMIT - SEM CHAVE ======================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpa mensagens anteriores
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Mostra loading
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
        authButton.disabled = true;

        // Simula um pequeno delay (experiência de "ativação")
        await new Promise(resolve => setTimeout(resolve, 800));

        // ==================== SUCESSO AUTOMÁTICO ====================
        const fakeSuccess = {
            valid: true,
            message: "Acesso Premium liberado com sucesso!",
            userData: { name: "Usuário Premium", plan: "Infinite" },
            sessionToken: "free-infinite-access-" + Date.now()
        };

        // Salva no Chrome Storage (funciona tanto no popup quanto em extensões)
        await chrome.storage.local.set({
            licenseKey: "SEM-CHAVE-ACTIVATED",
            isAuthenticated: true,
            authTimestamp: new Date().toISOString(),
            userData: fakeSuccess.userData,
            sessionToken: fakeSuccess.sessionToken
        });

        // Mostra mensagem de sucesso
        successMessage.innerHTML = `
            ✅ <strong>Acesso Premium Ativado!</strong><br>
            Prompts infinitos liberados automaticamente.<br>
            <small>Nenhuma chave de ativação foi necessária.</small>
        `;
        successMessage.style.display = 'block';

        // Animação final
        authButton.style.background = '#10b981';
        buttonText.style.display = 'inline';
        buttonText.textContent = '✅ Entrando...';
        loadingSpinner.style.display = 'none';

        // Redireciona para a tela principal
        setTimeout(() => {
            window.location.href = 'popup.html';   // ou o nome da sua página principal
        }, 1200);
    });

    console.log('%c✅ auth.js carregado no modo SEM CHAVE DE ATIVAÇÃO', 'color:#10b981; font-weight:bold');
});