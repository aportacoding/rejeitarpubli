// Configuração EmailJS (usando public key, totalmente seguro)
const EMAILJS_SERVICE_ID = 'service_demo_rejeicao';
const EMAILJS_TEMPLATE_ID = 'template_rejeicao';
const EMAILJS_PUBLIC_KEY = 'p_rJ7e2L9kM0nOpQr';

// Inicializa EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// Estado da aplicação
let estadoPublicacao = {
    titulo_original: 'Portaria Nº 123/2026 - Regulamentação de Procedimentos',
    titulo_atual: 'Portaria Nº 123/2026 - Regulamentação de Procedimentos',
    status: 'rascunho',
    rejeitada: false
};

const PREFIXO_REJEICAO = '(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS) ';

// Elements
const btnRejeitar = document.getElementById('btnRejeitar');
const btnReset = document.getElementById('btnReset');
const statusSelect = document.getElementById('status');
const tituloInput = document.getElementById('titulo');
const emailInput = document.getElementById('email_test');
const logDiv = document.getElementById('log');
const loadingModal = document.getElementById('loadingModal');
const statusModal = document.getElementById('statusModal');
const statusContent = document.getElementById('statusContent');

// Event Listeners
btnRejeitar.addEventListener('click', rejetarPublicacao);
btnReset.addEventListener('click', resetarPublicacao);
statusSelect.addEventListener('change', handleStatusChange);

// Funções
function addLog(mensagem, tipo = 'info') {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const logItem = document.createElement('p');
    logItem.className = `log-item ${tipo}`;
    logItem.textContent = `[${timestamp}] ${mensagem}`;
    logDiv.insertBefore(logItem, logDiv.firstChild);

    console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
}

function showLoadingModal(show = true) {
    if (show) {
        loadingModal.classList.remove('hidden');
    } else {
        loadingModal.classList.add('hidden');
    }
}

function showStatusModal(titulo, mensagem, tipo = 'success') {
    statusContent.innerHTML = `
        <h2 style="color: ${tipo === 'success' ? '#28a745' : '#dc3545'}; margin-bottom: 15px;">
            ${tipo === 'success' ? '✅' : '❌'} ${titulo}
        </h2>
        <p>${mensagem}</p>
    `;
    statusModal.classList.remove('hidden');
}

function closeModal() {
    statusModal.classList.add('hidden');
}

function handleStatusChange(e) {
    const novoStatus = e.target.value;

    if (novoStatus === 'rejeitado' && !estadoPublicacao.rejeitada) {
        // Evita que o usuário mude manualmente para rejeitado
        // O status deve mudar através da função rejetarPublicacao
        addLog('⚠️ Use o botão "Rejeitar Publicação" para rejeitar', 'warning');
        statusSelect.value = estadoPublicacao.status;
    } else {
        estadoPublicacao.status = novoStatus;
        addLog(`Status alterado para: ${novoStatus}`, 'info');
    }
}

async function rejetarPublicacao() {
    addLog('🔄 Iniciando processo de rejeição...', 'info');

    // Validação
    const emailTeste = emailInput.value.trim();
    if (!emailTeste) {
        addLog('❌ Erro: Informe um e-mail para teste', 'error');
        showStatusModal('Erro', 'Por favor, informe um e-mail válido', 'error');
        return;
    }

    if (!emailTeste.includes('@')) {
        addLog('❌ Erro: E-mail inválido', 'error');
        showStatusModal('Erro', 'O e-mail informado é inválido', 'error');
        return;
    }

    // Mostra loading
    showLoadingModal(true);
    addLog('📧 Preparando e-mail para envio...', 'info');

    try {
        // Simula o delay de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Altera o título
        const tituloOriginal = estadoPublicacao.titulo_atual;

        // Se já não começa com o prefixo, adiciona
        if (!estadoPublicacao.titulo_atual.startsWith(PREFIXO_REJEICAO)) {
            estadoPublicacao.titulo_atual = PREFIXO_REJEICAO + tituloOriginal;
            tituloInput.value = estadoPublicacao.titulo_atual;
            addLog('✏️ Título alterado com prefixo de rejeição', 'success');
        }

        // Altera o status
        estadoPublicacao.status = 'rejeitado';
        estadoPublicacao.rejeitada = true;
        statusSelect.value = 'rejeitado';

        // Atualiza badge de status
        const statusBadge = document.querySelector('.status');
        statusBadge.textContent = 'Não Aprovada';
        statusBadge.classList.remove('status-rascunho');
        statusBadge.classList.add('status-rejeitado');
        addLog('📋 Status alterado para "Não Aprovada (Rejeitada)"', 'success');

        // Prepara dados do e-mail
        const templateParams = {
            to_email: emailTeste,
            titulo_original: tituloOriginal,
            titulo_novo: estadoPublicacao.titulo_atual,
            motivo: '(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS)',
            data_hora: new Date().toLocaleString('pt-BR'),
            author_name: 'Usuário'
        };

        addLog('📤 Enviando e-mail...', 'info');

        // Envia o e-mail via EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        addLog(`✅ E-mail enviado com sucesso para ${emailTeste}`, 'success');
        addLog(`📨 ID de envio: ${response.status}`, 'success');
        addLog('✅ Processo de rejeição concluído com sucesso!', 'success');

        showLoadingModal(false);
        showStatusModal(
            'Rejeição Concluída!',
            `
                <p>✅ Título alterado</p>
                <p>✅ Status atualizado para "Não Aprovada"</p>
                <p>✅ E-mail enviado para: <strong>${emailTeste}</strong></p>
                <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                    Verifique sua caixa de entrada (e spam) para receber a notificação
                </p>
            `,
            'success'
        );

        // Desabilita o botão de rejeição após sucesso
        btnRejeitar.disabled = true;
        btnRejeitar.style.opacity = '0.6';
        btnRejeitar.style.cursor = 'not-allowed';

    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);

        if (error.status === 0) {
            // Erro de rede ou CORS
            addLog('⚠️ Erro de rede. Simularemos o envio...', 'warning');

            // Mesmo assim, completamos o processo localmente
            const tituloOriginal = estadoPublicacao.titulo_atual;
            if (!estadoPublicacao.titulo_atual.startsWith(PREFIXO_REJEICAO)) {
                estadoPublicacao.titulo_atual = PREFIXO_REJEICAO + tituloOriginal;
                tituloInput.value = estadoPublicacao.titulo_atual;
            }

            estadoPublicacao.status = 'rejeitado';
            estadoPublicacao.rejeitada = true;
            statusSelect.value = 'rejeitado';

            const statusBadge = document.querySelector('.status');
            statusBadge.textContent = 'Não Aprovada';
            statusBadge.classList.remove('status-rascunho');
            statusBadge.classList.add('status-rejeitado');

            addLog('✅ Rejeição processada (simulada)', 'success');
            showLoadingModal(false);
            showStatusModal(
                'Rejeição Processada',
                `
                    <p>✅ Título alterado</p>
                    <p>✅ Status atualizado para "Não Aprovada"</p>
                    <p style="margin-top: 15px; font-size: 0.9em; color: #ffc107;">
                        Nota: O e-mail foi processado localmente. Para funcionar em produção,
                        configure suas credenciais do EmailJS ou use um backend próprio.
                    </p>
                `,
                'success'
            );

            btnRejeitar.disabled = true;
            btnRejeitar.style.opacity = '0.6';
            btnRejeitar.style.cursor = 'not-allowed';
        } else {
            showLoadingModal(false);
            addLog(`❌ Erro ao enviar e-mail: ${error.message || error}`, 'error');
            showStatusModal(
                'Erro ao Enviar E-mail',
                `
                    <p>${error.message || 'Ocorreu um erro desconhecido'}</p>
                    <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                        Você pode tentar novamente ou usar outro e-mail.
                    </p>
                `,
                'error'
            );
        }
    }
}

function resetarPublicacao() {
    if (!confirm('Deseja resetar a publicação para o estado inicial?')) {
        return;
    }

    addLog('🔄 Resetando publicação...', 'info');

    // Reseta estado
    estadoPublicacao.titulo_atual = estadoPublicacao.titulo_original;
    estadoPublicacao.status = 'rascunho';
    estadoPublicacao.rejeitada = false;

    // Atualiza interface
    tituloInput.value = estadoPublicacao.titulo_original;
    statusSelect.value = 'rascunho';

    const statusBadge = document.querySelector('.status');
    statusBadge.textContent = 'Rascunho';
    statusBadge.classList.remove('status-rejeitado');
    statusBadge.classList.add('status-rascunho');

    btnRejeitar.disabled = false;
    btnRejeitar.style.opacity = '1';
    btnRejeitar.style.cursor = 'pointer';

    addLog('✅ Publicação resetada com sucesso', 'success');
}

// Inicialização
window.addEventListener('load', () => {
    addLog('✅ Sistema pronto. Clique em "Rejeitar Publicação" para testar.', 'success');
});
