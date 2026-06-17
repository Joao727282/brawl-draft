# Brawl Draft

Ferramenta de draft para Brawl Stars ranqueado — escolha modo, mapa e veja o melhor first pick e counter picks.

## Como rodar localmente (opcional, pra testar antes de publicar)

Precisa ter o Node.js instalado (baixe em nodejs.org, versão LTS).

```
npm install
npm run dev
```

Abre em `http://localhost:5173`

## Como publicar (passo a passo)

### 1. Criar conta no GitHub
Vá em github.com e crie uma conta gratuita, se ainda não tiver.

### 2. Criar um repositório novo
- Clique em "New repository"
- Dê um nome, ex: `brawl-draft`
- Deixe público
- Não marque nenhuma opção extra (sem README, sem .gitignore — já temos os arquivos)
- Clique em "Create repository"

### 3. Subir esta pasta pro GitHub
O GitHub vai te mostrar comandos parecidos com isto (rode no terminal, dentro desta pasta):

```
git init
git add .
git commit -m "primeira versão"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/brawl-draft.git
git push -u origin main
```

(Troque `SEU_USUARIO` pelo seu nome de usuário do GitHub)

### 4. Conectar com a Vercel
- Vá em vercel.com e crie conta (pode entrar direto com o GitHub)
- Clique em "Add New Project"
- Selecione o repositório `brawl-draft` que você acabou de subir
- A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar nada
- Clique em "Deploy"

Em 1-2 minutos seu site estará no ar com uma URL gratuita do tipo `brawl-draft.vercel.app`.

### 5. Atualizações futuras
Sempre que você quiser mudar algo no código e publicar a nova versão, é só rodar de novo:
```
git add .
git commit -m "descrição da mudança"
git push
```
A Vercel republica automaticamente sozinha.

## Domínio próprio (opcional, pra depois)
Se no futuro quiser um domínio como `brawldraft.com` em vez do `.vercel.app`, você compra o domínio (Registro.br, GoDaddy, Namecheap) e conecta nas configurações do projeto na Vercel, em "Domains".
