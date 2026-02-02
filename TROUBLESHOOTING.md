# Guia de Troubleshooting - Erro ao Criar Ingresso em Produção

## Problema Reportado

**Erro**: "Failed to create ticket" ao tentar criar um novo ingresso em produção.

## Causa Provável

O erro geralmente ocorre quando o usuário autenticado no Supabase não está sincronizado com o banco de dados PostgreSQL.

## Solução Implementada

### 1. Melhor Logging e Diagnóstico

Adicionei logs detalhados em:
- **`/api/auth/sync`** - Para rastrear sincronização de usuários
- **`/sell` page** - Para capturar erros específicos

### 2. Tratamento de Erros Melhorado

**Arquivo**: `src/app/api/auth/sync/route.ts`
- Adicionado tratamento para constraint violations (P2002)
- Logs detalhados de erros Prisma
- Mensagens de erro mais específicas

**Arquivo**: `src/app/sell/page.tsx`
- Console logs para debug
- Mensagens de erro mais descritivas
- Melhor feedback para o usuário

## Como Testar Após Deploy

1. **Abra o Console do Navegador** (F12)
2. Tente criar um ingresso
3. Verifique os logs no console
4. Se houver erro, copie a mensagem completa

## Possíveis Erros e Soluções

### Erro: "User not found. Please logout and login again"

**Solução**:
1. Faça logout
2. Faça login novamente
3. Tente criar o ingresso

### Erro: "Erro ao sincronizar usuário"

**Solução**:
1. Verifique se as variáveis de ambiente estão configuradas no Vercel
2. Verifique se o banco de dados está acessível
3. Verifique logs no Vercel Dashboard

### Erro: "Invalid event ID"

**Solução**:
1. Verifique se o evento existe no banco de dados
2. Tente selecionar outro evento

## Verificar Logs em Produção

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para o projeto **secure-ticket-platform**
3. Clique em **Logs**
4. Filtre por "Error" ou busque por "ticket"
5. Verifique os logs detalhados

## Próximos Passos

Se o erro persistir após o deploy:

1. **Capture os logs do console do navegador**
2. **Verifique os logs do Vercel**
3. **Tente fazer logout e login novamente**
4. **Verifique se o usuário existe no banco de dados**

## Deploy Realizado

✅ Commit: `fix: improve error handling for ticket creation in production`
✅ Push para GitHub concluído
🔄 Vercel deployment em andamento

Aguarde ~2 minutos para o deploy completar e teste novamente.
