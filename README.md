# 🚀 Sistema de Rejeição de Publicações - Protótipos

Dois protótipos de **interface web** para demonstrar a funcionalidade de rejeição automática de publicações, rodando 100% no GitHub Pages.

## 📑 Páginas Disponíveis

### 1️⃣ **Página de Teste Rápido** (`index.html`)
Link: `https://seu-usuario.github.io/rejeitarpubli/`

Interface simples para testar o fluxo de rejeição com:
- ✅ Simulação de uma publicação
- ✅ Botão "Rejeitar Publicação"
- ✅ Envio de e-mail automático
- ✅ Log de ações em tempo real

**Use para:** Testar rapidamente o conceito

---

### 2️⃣ **Painel de Admin** (`admin.html`)
Link: `https://seu-usuario.github.io/rejeitarpubli/admin.html`

Dashboard estilo **Django Admin** com:
- ✅ Lista de publicações em tabela
- ✅ Filtro por título/autor/status
- ✅ Edição de publicações
- ✅ Modal de confirmação de rejeição
- ✅ Histórico de alterações
- ✅ Sidebar com navegação

**Use para:** Mostrar ao seu DEV como será a interface real em produção

---

## 🎯 Como Usar

### Teste Rápido (index.html)

1. Acesse: https://seu-usuario.github.io/rejeitarpubli/
2. Deixe o e-mail como está (aportacoding@gmail.com)
3. Clique em **"Rejeitar Publicação"**
4. Veja o título mudar e o log registrar as ações

### Painel Admin (admin.html)

1. Acesse: https://seu-usuario.github.io/rejeitarpubli/admin.html
2. Você verá uma lista de publicações (dados simulados)
3. Clique no lápis (✏️) para editar uma publicação
4. Ou clique no X (✕) para rejeitar direto
5. Confirme a rejeição no modal
6. Veja o histórico atualizado

---

## 🏗️ Arquitetura

### Teste Rápido
```
index.html → style.css → script.js
   ↓
   Simula publicação única
   Foco: Fluxo de rejeição
```

### Painel Admin
```
admin.html → admin-style.css → admin-script.js
   ↓
   Lista completa de publicações
   Foco: UI similar ao Django Admin
```

---

## 📧 E-mail

### Como Funciona (Em Produção)

No protótipo:
- O script loga as ações
- Simula o envio de e-mail
- Não envia e-mail de verdade (para não gerar ruído)

Em produção (Django):
```python
# signals.py
@receiver(post_save, sender=Publicacao)
def rejeitar_publicacao(sender, instance, **kwargs):
    if instance.status == 'nao_aprovada':
        # Altera título
        instance.titulo = PREFIXO + instance.titulo
        
        # Envia e-mail
        send_mail(
            'Publicação Rejeitada',
            render_email(instance),
            settings.DEFAULT_FROM_EMAIL,
            [instance.autor.email],
        )
```

---

## 💻 Para o Seu DEV

### Arquivos de Referência

**O que o DEV precisa implementar em Django:**

1. **Model** (`models.py`)
   ```python
   class Publicacao(models.Model):
       titulo = models.CharField(max_length=500)
       autor = models.ForeignKey(User, ...)
       status = models.CharField(choices=[...])
   ```

2. **Signal** (`signals.py`)
   - Detecta mudança de status para 'rejeitada'
   - Altera título com prefixo
   - Envia e-mail

3. **Admin** (`admin.py`)
   - Igual ao painel em admin.html
   - Com filtros, busca, edição inline
   - Histórico via LogEntry

---

## 📋 Fluxo de Rejeição

Tanto no protótipo quanto no Django:

```
1. Clica em "Rejeitar" / Seleciona status "Rejeitada"
   ↓
2. Modal de confirmação
   ↓
3. Clica "Confirmar Rejeição"
   ↓
4. Sistema faz:
   ✅ Altera título: "(PUBLICAÇÃO REJEITADA, ...) Título Original"
   ✅ Muda status: "Não Aprovada (Rejeitada)"
   ✅ Envia e-mail ao autor
   ✅ Registra no histórico
   ↓
5. Sucesso! Modal com confirmação
```

---

## 🔧 Customização

### Mudar o Prefixo de Rejeição

**index.html (linha ~150):**
```javascript
const PREFIXO_REJEICAO = "(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS) ";
```

**admin-script.js (linha ~16):**
```javascript
const PREFIXO_REJEICAO = "(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS) ";
```

### Adicionar Mais Publicações (admin.html)

**admin-script.js (linhas 8-40):**
```javascript
let publicacoes = [
    {
        id: 'P004',
        titulo: 'Nova Publicação',
        autor: 'Seu Nome',
        email: 'seu@email.com',
        status: 'rascunho',
        data: '2026-10-26',
        historico: [...]
    },
    // ... adicione mais
];
```

---

## ✅ Checklist para Implementação em Django

- [ ] Criar Model Publicacao
- [ ] Criar signal post_save
- [ ] Implementar lógica de rejeição no signal
- [ ] Configurar SMTP (Gmail, etc)
- [ ] Criar template de e-mail
- [ ] Customizar Admin (igual ao painel.html)
- [ ] Testes unitários
- [ ] Documentação

---

## 🚀 Próximos Passos

1. **Testar os protótipos** (este repositório)
2. **Mostrar para o DEV** (como referência visual)
3. **Implementar no Django** (com o código que já foi criado)
4. **Conectar frontend ao backend** (AJAX/Fetch)

---

## 📞 Estrutura do Projeto

```
rejeitarpubli/
├── index.html           # Teste rápido
├── style.css            # Estilos (teste rápido)
├── script.js            # Lógica (teste rápido)
├── admin.html           # Painel Django-like
├── admin-style.css      # Estilos (painel)
├── admin-script.js      # Lógica (painel)
└── README.md            # Este arquivo
```

---

## 🔐 Segurança

- ✅ Zero dados sensíveis armazenados
- ✅ Sem comunicação com servidores externos
- ✅ Tudo roda no browser (lado do cliente)
- ✅ HTML/CSS/JS puro, sem dependências pesadas

---

## 📝 Notas

- Os dados no `admin.html` são **simulados** (localStorage poderia ser usado para persistência)
- O e-mail é **simulado** (seria real no Django)
- Foco é na **UX/UI** e **fluxo de trabalho**
- Ideal como **mockup para design review**

---

**Desenvolvido com HTML/CSS/JavaScript Puro** 🎨

Nenhuma dependência, nenhuma compilação, pronto para usar!
