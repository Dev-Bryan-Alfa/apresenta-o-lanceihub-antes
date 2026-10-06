# LanceiHub: versão antiga (demonstração)

**Acesse:** https://dev-bryan-alfa.github.io/apresenta-o-lanceihub-antes/

Este repositório mostra o frontend do LanceiHub como ele estava em **16/06/2026**, antes da migração para o design system e do redesign. Ele existe para apresentar o "antes e depois" do sistema.

## Como usar

- Na tela de login, digite **qualquer e-mail e qualquer senha**, marque o reCAPTCHA e clique em Entrar.
- Todos os dados são **fictícios**. Nenhuma informação é enviada a um servidor: as respostas da API são geradas no próprio navegador.
- Ao recarregar a página, os dados voltam ao estado inicial.

## O que foi alterado para rodar no GitHub Pages

O código das telas é o original. As alterações se limitam ao necessário para publicar sem backend:

- `src/demo/` (novo): os dados fictícios, o adaptador que responde às chamadas da API e o selo "versão antiga".
- O roteamento passou de `BrowserRouter` para `HashRouter` (os endereços ficam com `#/`), e as imagens com caminho absoluto (`/arquivo.png`) passaram a usar caminho relativo.
- O WebSocket de notificações fica desligado no modo demonstração.
- Foram removidos três imports acidentais de `handlebars` que impediam o build fora do repositório original.
- O `.env` e o `deploy.sh` ficaram de fora, porque continham dados do ambiente de produção.
- O `index.html` agora tem `noindex`, para que a página não apareça nos buscadores.

## Publicação

O workflow `.github/workflows/publica-pages.yml` gera o build (`npm run build`, usando `.env.production`) e publica no GitHub Pages a cada push na `main`.
