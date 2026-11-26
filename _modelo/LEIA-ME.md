# Alquimia Prisma — página por cliente

- `assets/` — design compartilhado (CSS, logo, fotos). Mudou aqui, muda em todas as páginas.
- `clientes/<slug>.json` — conteúdo de cada cliente (nome, link do YouTube, capítulos, descobertas, óculos/cabelo, orientações).
- `_modelo/build.mjs` — gera `<slug>/index.html` a partir do JSON: `node _modelo/build.mjs <slug>`.
- Endereço publicado: `https://cristinafglima.github.io/alquimia-prisma/<slug>/`
- `index.html` na raiz é a página original da Paula (link antigo, mantido).
- Páginas têm `noindex` e o `robots.txt` bloqueia buscadores: só quem tem o link acessa.
