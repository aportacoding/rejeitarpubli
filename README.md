# 🚀 Sistema de Rejeição de Publicações - Protótipo

Um **protótipo funcional** da funcionalidade de rejeição automática de publicações, rodando 100% na nuvem com **GitHub Pages**.

## ✨ Características

- ✅ Interface simples e intuitiva
- ✅ Alteração automática de título com prefixo
- ✅ Mudança de status em tempo real
- ✅ **Envio de e-mail automático** ao clicar em "Rejeitar"
- ✅ Log de ações em tempo real
- ✅ Responsivo (desktop e mobile)
- ✅ Sem banco de dados, sem servidor backend
- ✅ Roda 100% na nuvem (GitHub Pages + EmailJS)

## 🔧 Como Usar

### 1. Acesse a página
Link: https://aportacoding.github.io/rejeitarpubli/

### 2. Preencha seu e-mail (já vem preenchido com o seu)

### 3. Clique em "Rejeitar Publicação"

O sistema irá:
- ✅ Alterar o título adicionando o prefixo: `(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS)`
- ✅ Mudar o status para `Não Aprovada (Rejeitada)`
- ✅ Enviar um e-mail para você com:
  - Título original da publicação
  - Motivo da rejeição
  - Data e hora

### 4. Verifique seu e-mail

O e-mail chegará em alguns segundos. **Não se esqueça de checar a pasta de SPAM!**

## 📧 Funcionamento do E-mail

### Serviço Utilizado: EmailJS

Este projeto usa **EmailJS**, um serviço gratuito que:
- ✅ Envia e-mails sem necessidade de servidor backend
- ✅ Funciona 100% no browser (JavaScript puro)
- ✅ É seguro (usa Public Key, nunca expõe credenciais)
- ✅ Suporta templates personalizados
- ✅ Tem limite generoso na versão gratuita

### Como Funciona:
1. Você clica em "Rejeitar Publicação"
2. O JavaScript envia os dados para o EmailJS
3. EmailJS processa e envia o e-mail via SMTP
4. Você recebe o e-mail

**Nenhuma informação é armazenada. Tudo é processado em tempo real.**

## 📁 Estrutura

```
rejeitarpubli/
├── index.html      # Interface
├── style.css       # Estilos
├── script.js       # Lógica (rejeição + email)
└── README.md       # Este arquivo
```

## 🚀 Deploy no GitHub Pages

1. **O repositório precisa estar público**
2. **Vá em Settings → Pages**
3. **Source**: Deploy from a branch
4. **Branch**: main (ou master)
5. **Folder**: / (root)
6. Clique em "Save"

A página ficará disponível em: `https://seu-usuario.github.io/rejeitarpubli/`

## 🔐 Segurança

- 🔒 Usa **Public Key** do EmailJS (não expõe senha)
- 🔒 Nenhum dado é armazenado
- 🔒 Funciona 100% no browser (lado do cliente)
- 🔒 Sem comunicação com banco de dados

## ⚙️ Customização

Você pode editar em `index.html`:

```html
<!-- Título da publicação -->
<input 
    type="text" 
    id="titulo" 
    value="Portaria Nº 123/2026 - Regulamentação de Procedimentos"
/>

<!-- E-mail do autor -->
<input type="text" value="João Silva (joao@example.com)" readonly>

<!-- Motivo padrão da rejeição -->
<textarea id="motivo" readonly>
(PUBLICAÇÃO REJEITADA, SÓ É PERMITIDO ANEXOS DE DOCUMENTOS FISCAIS)
</textarea>
```

## 📝 Próximos Passos

Para implementar em produção no Django:

1. **Crie um Django Backend** com um endpoint `/api/rejeitar/`
2. **Este protótipo valida o fluxo UX** (o que fazer quando clica)
3. **Implemente o signal Django** com o código que criamos antes
4. **Conecte a interface ao backend**

## 🧪 Testando Localmente

Se quiser testar antes de fazer deploy:

```bash
# Instale um servidor HTTP simples
python3 -m http.server 8000

# Acesse http://localhost:8000
```

## 📞 Troubleshooting

### E-mail não chegou?
- ✅ Verifique a pasta **SPAM**
- ✅ Verifique se o e-mail digitado está correto
- ✅ Aguarde alguns segundos e recarregue

### Sistema não está respondendo?
- ✅ Abra o console do navegador (F12 → Console)
- ✅ Procure por mensagens de erro
- ✅ Verifique sua conexão com internet

### E-mail aberto mas não contém nada?
- ✅ O template do EmailJS pode estar desconfigured
- ✅ Verifique a aba "Log de Ações" para mais detalhes

## 🎯 Casos de Uso

Este protótipo demonstra:
- ✅ Como alterar dados em tempo real
- ✅ Como enviar notificações por email
- ✅ Como criar um fluxo simples de aprovação/rejeição
- ✅ Como rodar na nuvem sem servidor

## 📜 Licença

Código livre para uso e modificação.

---

**Desenvolvido em JavaScript Puro + GitHub Pages + EmailJS** 🚀

Nenhuma dependência pesada, nenhuma complexidade desnecessária!
