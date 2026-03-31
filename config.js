// ================================================
// config.js - MODO LIVRE SEM VALIDAÇÃO
// Totalmente funcional sem chaves de ativação
// ================================================

const CONFIG = {
    // Modo livre - sem validação
    VALIDATION_ENABLED: false,
    FREE_ACCESS: true,
    
    // Mensagens padrão
    SUCCESS_MESSAGE: "✅ Acesso Premium Liberado com Sucesso!",
    ERROR_MESSAGE: "❌ Erro ao processar",
    
    // Timeouts
    REQUEST_TIMEOUT: 30000,
    FUNCTION_TIMEOUT: 10000
};

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}