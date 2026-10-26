// Dados simulados (no Django seria vindo do banco)
let publicacoes = [
    {
        id: 'P001',
        titulo: 'Portaria Nº 123/2026 - Regulamentação de Procedimentos',
        autor: 'João Silva',
        email: 'joao@example.com',
        status: 'rascunho',
        data: '2026-10-25',
        historico: [
            { acao: 'Criada', data: '2026-10-25 14:30', usuario: 'João Silva' },
        ]
    },
    {
        id: 'P002',
        titulo: 'Decreto Nº 456/2026 - Alterações Orçamentárias',
        autor: 'Maria Santos',
        email: 'maria@example.com',
        status: 'pronto',
        data: '2026-10-24',
        historico: [
            { acao: 'Enviada para aprovação', data: '2026-10-24 10:00', usuario: 'Maria Santos' },
            { acao: 'Criada', data: '2026-10-24 09:15', usuario: 'Maria Santos' },
        ]
    },
    {
        id: 'P003',
        titulo: 'Edital Nº 789/2026 - Processo Seletivo',
        autor: 'Carlos Oliveira',
        email: 'carlos@example.com',
        status: 'publicada',
        data: '2026-10-23',
        historico: [
            { acao: 'Publicada', data: '2026-10-23 16:45', usuario: 'Admin' },
            { acao: 'Aprovada', data: '2026-10-23 15:30', usuario: 'Admin' },
        ]
    },
];

const PREFIXO_REJEICAO = '(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS) ';
let publicacaoEmEdicao = null;

// Elements
const publicationsTable = document.getElementById('publicationsTable');
const editModal = document.getElementById('editModal');
const confirmModal = document.getElementById('confirmModal');
const successModal = document.getElementById('successModal');
const filterSearch = document.getElementById('filterSearch');
const filterStatus = document.getElementById('filterStatus');

// Event Listeners
filterSearch.addEventListener('input', renderPublicacoes);
filterStatus.addEventListener('change', renderPublicacoes);
document.getElementById('selectAll').addEventListener('change', toggleSelectAll);

// Render initial data
renderPublicacoes();

function renderPublicacoes() {
    const search = filterSearch.value.toLowerCase();
    const statusFilter = filterStatus.value;

    // Filtra publicações
    const filtered = publicacoes.filter(pub => {
        const matchSearch = pub.titulo.toLowerCase().includes(search) ||
                           pub.autor.toLowerCase().includes(search);
        const matchStatus = !statusFilter || pub.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Limpa tabela
    publicationsTable.innerHTML = '';

    // Renderiza linhas
    filtered.forEach(pub => {
        const row = document.createElement('tr');
        const statusClass = `status-${pub.status}`;
        const statusLabel = {
            'rascunho': 'Rascunho',
            'pronto': 'Pronto para Publicação',
            'publicada': 'Publicada',
            'rejeitada': 'Rejeitada'
        }[pub.status];

        row.innerHTML = `
            <td style="text-align: center;">
                <input type="checkbox" class="select-checkbox" value="${pub.id}">
            </td>
            <td>
                <a href="#" onclick="openEditModal('${pub.id}'); return false;" style="color: #667eea; text-decoration: none; cursor: pointer;">
                    ${pub.titulo.substring(0, 50)}${pub.titulo.length > 50 ? '...' : ''}
                </a>
            </td>
            <td>${pub.autor}</td>
            <td>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </td>
            <td>${new Date(pub.data).toLocaleDateString('pt-BR')}</td>
            <td style="text-align: center;">
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openEditModal('${pub.id}'); return false;">✏️</button>
                    ${pub.status !== 'rejeitada' ? `<button class="btn-delete" onclick="openConfirmModal('${pub.id}'); return false;">✕</button>` : ''}
                </div>
            </td>
        `;

        publicationsTable.appendChild(row);
    });
}

function openEditModal(id) {
    publicacaoEmEdicao = publicacoes.find(p => p.id === id);

    if (!publicacaoEmEdicao) return;

    // Preenche campos
    document.getElementById('editId').value = publicacaoEmEdicao.id;
    document.getElementById('editTitulo').value = publicacaoEmEdicao.titulo;
    document.getElementById('editAutor').value = publicacaoEmEdicao.autor;
    document.getElementById('editEmail').value = publicacaoEmEdicao.email;
    document.getElementById('editStatus').value = publicacaoEmEdicao.status;

    // Renderiza histórico
    const historyLog = document.getElementById('historyLog');
    const historySection = document.getElementById('historySection');
    historyLog.innerHTML = publicacaoEmEdicao.historico
        .map(h => `<div class="history-item">
            <strong>${h.acao}</strong> - ${h.data} por ${h.usuario}
        </div>`)
        .join('');
    historySection.style.display = 'block';

    // Mostra modal
    editModal.classList.add('show');
}

function closeEditModal() {
    editModal.classList.remove('show');
    publicacaoEmEdicao = null;
}

function handleStatusChange(e) {
    const novoStatus = e.target.value;

    if (novoStatus === 'rejeitada' && publicacaoEmEdicao.status !== 'rejeitada') {
        // Abre modal de confirmação
        closeEditModal();
        document.getElementById('confirmTitle').textContent = publicacaoEmEdicao.titulo;
        confirmModal.classList.add('show');
    }
}

function openConfirmModal(id) {
    const pub = publicacoes.find(p => p.id === id);
    if (pub) {
        publicacaoEmEdicao = pub;
        document.getElementById('confirmTitle').textContent = pub.titulo;
        confirmModal.classList.add('show');
    }
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
}

function confirmarRejeicao() {
    closeConfirmModal();
    rejetarPublicacao();
}

async function rejetarPublicacao() {
    if (!publicacaoEmEdicao) return;

    const pub = publicacaoEmEdicao;

    // Altera o título (se ainda não tiver o prefixo)
    if (!pub.titulo.startsWith(PREFIXO_REJEICAO)) {
        const tituloOriginal = pub.titulo;
        pub.titulo = PREFIXO_REJEICAO + tituloOriginal;
    }

    // Altera o status
    pub.status = 'rejeitada';

    // Adiciona ao histórico
    const agora = new Date();
    const dataHora = agora.toLocaleString('pt-BR');
    pub.historico.unshift({
        acao: 'Rejeitada via Admin',
        data: dataHora,
        usuario: 'Admin'
    });

    // Simula envio de e-mail
    console.log('📧 Enviando e-mail para:', pub.email);
    console.log('Assunto: Publicação Rejeitada');
    console.log('Corpo: Sua publicação foi rejeitada. Título original:',
        pub.titulo.replace(PREFIXO_REJEICAO, ''));

    // Renderiza tabela novamente
    renderPublicacoes();

    // Mostra sucesso
    document.getElementById('successContent').innerHTML = `
        <p><strong>${pub.titulo.replace(PREFIXO_REJEICAO, '')}</strong></p>
        <p>✅ Publicação rejeitada com sucesso!</p>
        <p>📧 E-mail enviado para: <strong>${pub.email}</strong></p>
    `;
    successModal.classList.add('show');
}

function closeSuccessModal() {
    successModal.classList.remove('show');
    closeEditModal();
}

function salvarPublicacao() {
    if (!publicacaoEmEdicao) return;

    // Atualiza dados
    publicacaoEmEdicao.titulo = document.getElementById('editTitulo').value;
    publicacaoEmEdicao.email = document.getElementById('editEmail').value;

    // Renderiza tabela
    renderPublicacoes();

    // Feedback
    alert('✅ Publicação salva com sucesso!');
}

function toggleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.select-checkbox');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
}

// Fecha modais ao clicar fora
window.onclick = function(event) {
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
}
