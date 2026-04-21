# Desafio Front-End da Desbravador Software

Aplicação client-side para buscar usuários do GitHub, visualizar os dados públicos do perfil, ordenar repositórios por estrelas e abrir a página de cada repositório em detalhes.

## Stack

- React
- React Router
- Axios
- Bootstrap
- Vite

## Funcionalidades

- Busca de usuário do GitHub
- Exibição de avatar, bio, seguidores, seguindo, email e demais dados públicos
- Listagem de repositórios com ordenação por estrelas
- Alteração da ordem da listagem
- Página de detalhes do repositório
- Layout responsivo com Bootstrap

## Requisitos

- Node.js 20+ recomendado
- npm

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

Abra o endereço mostrado no terminal.

## Build de produção

```bash
npm run build
```

## Preview do build

```bash
npm run preview
```

## Deploy com Firebase Hosting

1. Instale o Firebase CLI, se ainda não tiver:

```bash
npm install -g firebase-tools
```

2. Faça login na sua conta Google:

```bash
firebase login
```

3. Conecte o projeto a um Firebase Project:

```bash
firebase init hosting
```

4. Faça o deploy:

```bash
npm run deploy:firebase
```

O `firebase.json` já está configurado para SPA, então as rotas do React funcionam no Hosting.

## Rotas

- `/` - busca de usuário
- `/users/:username` - perfil e repositórios do usuário
- `/repos/:owner/:repoName` - detalhes de um repositório

## API consumida

- `https://api.github.com/users/{username}`
- `https://api.github.com/users/{username}/repos`
- `https://api.github.com/repos/{owner}/{repo}`

## Observação sobre deploy

Como a aplicação usa roteamento no cliente, o ambiente de hospedagem precisa devolver `index.html` nas rotas internas. Vercel, Netlify, Firebase e outros hosts com rewrite de SPA funcionam bem.
