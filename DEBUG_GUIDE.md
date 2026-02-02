# Como Capturar Logs do Console - Guia Rápido

## Passo a Passo

### 1. Abra o Console do Navegador
- **Chrome/Edge**: Pressione `F12` ou `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Pressione `F12`

### 2. Vá para a Aba Console
- Clique na aba **"Console"** no topo do DevTools

### 3. Limpe o Console
- Clique no ícone 🚫 (Clear console) para limpar logs antigos

### 4. Tente Criar o Ingresso
1. Vá para "Vender Ingressos"
2. Preencha o formulário
3. Clique em "Publicar Ingresso"

### 5. Copie TODOS os Logs
- Clique com botão direito no console
- Selecione "Save as..." ou copie todo o texto

## O Que Procurar

Procure por mensagens que contenham:
- ❌ Erros em vermelho
- ⚠️ Warnings em amarelo
- 🔴 Failed requests (requisições falhadas)
- Mensagens com "Error", "Failed", "Sync", "Ticket"

## Exemplo do Que Enviar

```
Syncing user...
POST https://secure-ticket-platform.vercel.app/api/tickets 400 (Bad Request)
Ticket creation failed: {error: "Invalid event ID"}
Error in handleSubmit: ...
```

## Informações Importantes

Por favor, me envie:
1. **Todos os logs do console** (texto completo)
2. **Screenshot do erro** (se houver)
3. **Qual evento você selecionou** no dropdown

Isso me ajudará a identificar exatamente o que está causando o erro!
