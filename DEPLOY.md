# Guia de Deploy (Colocar no Ar)

Para publicar seu projeto gratuitamente na internet e torná-lo acessível para qualquer pessoa ("local público"), a melhor opção para aplicações **Next.js** é a **Vercel**.

Siga os passos abaixo:

## Pré-requisitos
1.  Uma conta no [GitHub](https://github.com/).
2.  Uma conta na [Vercel](https://vercel.com/) (pode criar com o GitHub).
3.  O código do projeto salvo (commitado) no GitHub.

## Passo a Passo

### 1. Subir o Código para o GitHub
Se você ainda não subiu o código:
1.  Crie um novo repositório no GitHub (ex: `secure-ticket-platform`).
2.  No terminal do VS Code, execute:
    ```bash
    git add .
    git commit -m "Projeto completo"
    git branch -M main
    git remote add origin https://github.com/SEU_USUARIO/secure-ticket-platform.git
    git push -u origin main
    ```

### 2. Conectar na Vercel
1.  Acesse seu dashboard na [Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Selecione o repositório `secure-ticket-platform` que você acabou de criar (Clique em "Import").

### 3. Configurar e Deploy
1.  Na tela de configuração ("Configure Project"), você verá as opções de Build. O padrão do Next.js já funciona automaticamente.
2.  **Variáveis de Ambiente**:
    *   Se você já tiver integrado o Supabase, precisará adicionar as chaves (`NEXT_PUBLIC_SUPABASE_URL`, etc) na seção **"Environment Variables"**.
    *   Como estamos usando dados fictícios (mocks) por enquanto, não precisa configurar nada agora.
3.  Clique em **"Deploy"**.

### 4. Resultado
A Vercel vai construir seu site e, em alguns instantes, te dará um link público (ex: `secure-ticket-platform.vercel.app`).
Você pode enviar esse link para qualquer pessoa acessar!

---

## Outras Opções Gratuitas
- **Netlify**: Processo muito similar ao da Vercel.
- **Render**: Bom para backend, mas também aceita sites estáticos/Next.js.
