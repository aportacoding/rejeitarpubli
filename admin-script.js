// Estado
let publicacao = {
    id: 'P001',
    titulo: 'PORTARIA Nº 022/2026',
    autor: 'João Silva',
    email: 'joao@example.com',
    status: 'edicao',
    dataPub: '2026-10-27',
    tipo: 'Atos Administrativos',
    statusAnterior: null
};

const PREFIXO_REJEICAO = '(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS) ';

// Elements
const form = document.getElementById('publicacaoForm');
const statusRadios = document.querySelectorAll('input[name="status"]');
const confirmModal = document.getElementById('confirmModal');
const successModal = document.getElementById('successModal');
const titleInput = document.getElementById('titulo');

// Status labels
const STATUS_LABELS = {
    'edicao': 'Editando',
    'pronta': 'Pronta p/ publicação',
    'publicada': 'Publicada',
    'nao_aprovada': 'Não Aprovada (Rejeitada)',
    'arquivada': 'Arquivada',
    'moderacao': 'Moderação (aguardando aprovação)'
};

// Event Listeners
statusRadios.forEach(radio => {
    radio.addEventListener('change', handleStatusChange);
});

// Collapsar fieldsets
document.querySelectorAll('.legend').forEach(legend => {
    legend.addEventListener('click', function() {
        const fieldset = this.closest('.fieldset');
        fieldset.classList.toggle('collapsed');
        this.classList.toggle('collapsed');
    });
});

function handleStatusChange(e) {
    const novoStatus = e.target.value;

    // Se está mudando PARA "não_aprovada", pede confirmação
    if (novoStatus === 'nao_aprovada' && publicacao.status !== 'nao_aprovada') {
        // Desmarca o radio para não mudar ainda
        statusRadios.forEach(r => {
            r.checked = r.value === publicacao.status;
        });

        // Abre modal de confirmação
        document.getElementById('confirmTitle').textContent = titleInput.value;
        confirmModal.classList.remove('hidden');
        confirmModal.classList.add('show');
    } else {
        // Para outros status, só muda direto
        publicacao.statusAnterior = publicacao.status;
        publicacao.status = novoStatus;
        console.log(`✅ Status alterado para: ${STATUS_LABELS[novoStatus]}`);
    }
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
    confirmModal.classList.add('hidden');
}

function confirmarRejeicao() {
    closeConfirmModal();
    rejetarPublicacao();
}

function rejetarPublicacao() {
    // Altera o título (se ainda não tiver o prefixo)
    const tituloOriginal = publicacao.titulo;

    if (!publicacao.titulo.startsWith(PREFIXO_REJEICAO)) {
        publicacao.titulo = PREFIXO_REJEICAO + tituloOriginal;
        titleInput.value = publicacao.titulo;
    }

    // Muda status
    publicacao.statusAnterior = publicacao.status;
    publicacao.status = 'nao_aprovada';

    // Marca o radio correto
    statusRadios.forEach(r => {
        r.checked = r.value === 'nao_aprovada';
    });

    // Simula envio de e-mail
    console.log('📧 ENVIANDO E-MAIL:');
    console.log(`Para: ${publicacao.email}`);
    console.log(`Assunto: Publicação Rejeitada`);
    console.log(`Corpo: Sua publicação "${tituloOriginal}" foi rejeitada.`);
    console.log(`Motivo: SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS`);

    // Mostra modal de sucesso
    document.getElementById('successMessage').innerHTML = `
        <p><strong>${tituloOriginal}</strong></p>
        <p>✅ Publicação rejeitada com sucesso!</p>
        <p>📧 E-mail enviado para: <strong>${publicacao.email}</strong></p>
        <p style="font-size: 0.9em; color: #666; margin-top: 15px;">
            O título foi alterado e o status foi atualizado para "Não Aprovada (Rejeitada)"
        </p>
    `;

    successModal.classList.remove('hidden');
    successModal.classList.add('show');
}

function closeSuccessModal() {
    successModal.classList.remove('show');
    successModal.classList.add('hidden');
}

function salvarPublicacao() {
    // Salva os dados
    publicacao.titulo = titleInput.value;
    publicacao.dataPub = document.getElementById('dataPub').value;
    publicacao.tipo = document.getElementById('tipo').value;

    // Mostra mensagem de sucesso
    document.getElementById('successMessage').innerHTML = `
        <p><strong>${publicacao.titulo}</strong></p>
        <p>✅ Publicação salva com sucesso!</p>
        <p>Status: <strong>${STATUS_LABELS[publicacao.status]}</strong></p>
    `;

    successModal.classList.remove('hidden');
    successModal.classList.add('show');

    console.log('💾 Publicação salva:', publicacao);
}

function closeSuccessModal() {
    successModal.classList.remove('show');
    successModal.classList.add('hidden');
}

// Fecha modal ao clicar fora
window.onclick = function(event) {
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
}

// Log inicial
console.log('✅ Painel de Publicações carregado');
console.log('Publicação atual:', publicacao);
