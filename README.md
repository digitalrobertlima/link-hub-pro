Link Hub Pro — Modularização

Resumo
- Projetado para ser um PWA estático, agora modularizado.
- Estrutura principal:
  - index.html
  - manifest.json
  - service-worker.js
  - src/css/styles.css
  - src/js/main.js
  - data/drops.json
  - assets/ (imagens, svg)
  - beats/ (assets de áudio)

O que fizemos
- Extraímos o CSS inline para `src/css/styles.css`.
- Criamos `src/js/main.js` com a lógica de inicialização, carregamento de dados e registro do SW.
- Movemos dados estáticos (drops) para `data/drops.json`.
- Atualizamos `service-worker.js` para cachear os novos caminhos.
- Atualizamos `manifest.json` para apontar para os assets existentes (SVG).

Próximos passos sugeridos
- Adicionar ícones PNG otimizados (192x192, 512x512) para compatibilidade máxima.
- Adicionar testes automatizados simples (lint/ci) e um `package.json` se desejar usar build tools.
- Implementar versionamento de cache mais avançado com estratégias separadas por rota/tipo.

Como commitar
  git add .
  git commit -m "Modularização: extrair CSS/JS/data, atualizar manifest e SW, adicionar README"

