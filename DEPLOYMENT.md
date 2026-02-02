# 🚀 Deployment Guide - Stripe Payment Integration

## ✅ Commits Pushed Successfully

9 commits foram enviados para produção:

1. **266d7fd** - `feat: install Stripe dependencies for payment integration`
2. **2e9e890** - `feat: add Stripe payment service with checkout session creation`
3. **e0fe5a4** - `feat: add payment API endpoints for checkout and transaction details`
4. **0071e0c** - `feat: add Stripe webhook handler for payment confirmation`
5. **d791628** - `feat: update purchase flow to create pending transactions`
6. **159ce15** - `feat: add purchase confirmation and success pages`
7. **c8639f1** - `docs: add Stripe setup guide and environment variables example`
8. **7c94cf2** - `feat: add external event API integration (Ticketmaster and Eventbrite)`
9. **9cfe439** - `fix: update dashboard page for better UX`

## 📦 Vercel Deployment

O Vercel detectará automaticamente os commits e iniciará o deploy. Você pode acompanhar em:
- **Dashboard**: https://vercel.com/dashboard
- **Deployments**: https://vercel.com/gabrielsalazar/secure-ticket-platform/deployments

## 🔑 Configurar Variáveis de Ambiente no Vercel

### Passo 1: Acessar Configurações do Projeto

1. Vá para https://vercel.com/dashboard
2. Selecione o projeto **secure-ticket-platform**
3. Clique em **Settings** → **Environment Variables**

### Passo 2: Adicionar Variáveis do Stripe

Adicione as seguintes variáveis (todas são **obrigatórias**):

#### STRIPE_SECRET_KEY
```
sk_test_51... (ou sk_live_51... para produção)
```
- **Onde obter**: [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
- **Ambiente**: Production, Preview, Development

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
pk_test_51... (ou pk_live_51... para produção)
```
- **Onde obter**: [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
- **Ambiente**: Production, Preview, Development

#### STRIPE_WEBHOOK_SECRET
```
whsec_...
```
- **Onde obter**: Configurar webhook primeiro (veja abaixo)
- **Ambiente**: Production, Preview, Development

#### NEXT_PUBLIC_APP_URL
```
https://secure-ticket-platform.vercel.app
```
- **Valor**: URL do seu app em produção
- **Ambiente**: Production, Preview, Development

### Passo 3: Configurar Webhook no Stripe

#### Para Produção:

1. Acesse [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em **Add endpoint**
3. Configure:
   - **Endpoint URL**: `https://secure-ticket-platform.vercel.app/api/webhooks/stripe`
   - **Events to send**:
     - ✅ `checkout.session.completed`
     - ✅ `checkout.session.expired`
4. Clique em **Add endpoint**
5. Copie o **Signing secret** (whsec_...)
6. Adicione como `STRIPE_WEBHOOK_SECRET` no Vercel

#### Para Preview/Development:

Use o Stripe CLI para testes locais:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Passo 4: Redeploy

Após adicionar as variáveis de ambiente:

1. Vá para **Deployments**
2. Clique nos três pontos (...) no último deployment
3. Selecione **Redeploy**
4. Ou simplesmente faça um novo push para o GitHub

## 🧪 Testar em Produção

### 1. Verificar Build

Aguarde o deployment completar e verifique:
- ✅ Build bem-sucedido
- ✅ Sem erros de variáveis de ambiente
- ✅ Todas as rotas acessíveis

### 2. Testar Fluxo de Compra

1. Acesse https://secure-ticket-platform.vercel.app
2. Faça login
3. Navegue para um evento
4. Clique em "Comprar" em um ingresso
5. Confirme a compra
6. Você será redirecionado para `/purchase/[transactionId]`
7. Clique em "Prosseguir para Pagamento"
8. Use cartão de teste: `4242 4242 4242 4242`
9. Complete o pagamento
10. Verifique redirecionamento para página de sucesso

### 3. Verificar Webhook

1. Acesse [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique no endpoint configurado
3. Veja a aba **Events** para verificar eventos recebidos
4. Verifique status `200 OK` nas respostas

## 🔍 Monitoramento

### Logs do Vercel

Acesse logs em tempo real:
```
https://vercel.com/gabrielsalazar/secure-ticket-platform/logs
```

### Stripe Dashboard

Monitore transações:
- **Payments**: https://dashboard.stripe.com/test/payments
- **Events**: https://dashboard.stripe.com/test/events
- **Webhooks**: https://dashboard.stripe.com/test/webhooks

## 🐛 Troubleshooting

### Build falha com "STRIPE_SECRET_KEY is not defined"

**Solução**: Adicione a variável de ambiente no Vercel e faça redeploy.

### Webhook retorna 401 ou 403

**Solução**: Verifique se `STRIPE_WEBHOOK_SECRET` está configurado corretamente.

### Pagamento não confirma

**Possíveis causas**:
1. Webhook não configurado
2. Webhook secret incorreto
3. URL do webhook incorreta
4. Eventos não selecionados no Stripe

**Solução**: Revise configuração do webhook no Stripe Dashboard.

### Redirecionamento após pagamento falha

**Solução**: Verifique se `NEXT_PUBLIC_APP_URL` está configurado com a URL correta de produção.

## ✅ Checklist de Deploy

- [x] Commits enviados para GitHub
- [ ] Vercel deployment iniciado
- [ ] Build bem-sucedido
- [ ] Variáveis de ambiente configuradas:
  - [ ] STRIPE_SECRET_KEY
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] NEXT_PUBLIC_APP_URL
- [ ] Webhook configurado no Stripe
- [ ] Teste de compra em produção realizado
- [ ] Webhook recebendo eventos corretamente

## 🎯 Próximos Passos

1. **Configurar variáveis de ambiente** no Vercel
2. **Configurar webhook** no Stripe Dashboard
3. **Testar fluxo completo** em produção
4. **Monitorar logs** para garantir tudo funcionando
5. **Migrar para chaves live** quando pronto para produção real

---

**Deployment Status**: 🟡 Aguardando configuração de variáveis de ambiente

**Estimated Time**: ~10 minutos para configuração completa
