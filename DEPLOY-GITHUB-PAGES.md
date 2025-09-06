# Deploy para GitHub Pages — Link Hub Pro

Este documento descreve passo-a-passo como publicar o site estático (PWA) deste repositório no GitHub Pages, opções de deploy, testes locais e resolução de problemas comuns.

## Resumo rápido
- Requisito mínimo: branch com conteúdo pronto (ex.: `v0.0.2-gdr` ou `gh-pages`).
- Recomendado: usar caminhos relativos (feito no código) para compatibilidade com project pages.
- Antes de publicar: confirmar que `index.html`, `manifest.json`, `service-worker.js`, `assets/` e `src/` estão com os caminhos corretos.

## Checklist pré-deploy
- [ ] Código está commitado e pushado na branch que será publicada.
- [ ] Caminhos relativos (sem leading slash) para `manifest.json`, `service-worker.js`, `assets/*`, `src/*`.
- [ ] `service-worker.js` registra `service-worker.js` por caminho relativo.
- [ ] CSP permite embeds necessários (YouTube) — `frame-src` adicionado no `index.html`.
- [ ] Arquivos referenciados (beats, mp3) estão no diretório `beats/` ou foram removidos.
- [ ] Ícones gerados (`assets/icons/*`) e OG (`assets/og/*`) presentes.

## Opções de publicação

Opção A — Publicar a branch atual como Pages (recomendado para testes rápidos):

1. Push da branch atual (ex.: `v0.0.2-gdr`):

```bash
git push origin v0.0.2-gdr
```

2. No GitHub, abra Settings → Pages → Source e selecione `Branch: v0.0.2-gdr` e `/(root)`.

3. Aguarde alguns minutos. A URL será `https://<username>.github.io/link-hub-pro/`.

Opção B — Criar uma branch `gh-pages` (padrão para project sites):

```bash
# cria/updade gh-pages apontando para o estado atual da branch v0.0.2-gdr
git push origin v0.0.2-gdr:gh-pages
```

Depois, em Settings → Pages selecione `gh-pages` e `/(root)`.

Opção C — Publicar como user site (username.github.io):
- Neste caso, todos paths absolutos começando com `/` apontam para a raiz do domínio; se preferir essa opção, publique o repositório em `digitalrobertlima/digitalrobertlima.github.io`. Requer renomear o repo e/ou criar um repositório dedicado.

## Arquivo `.nojekyll`
Se você usa arquivos ou pastas que começam com `_` ou quer garantir que o GitHub Pages não execute o Jekyll, adicione `.nojekyll` no root:

```bash
echo '' > .nojekyll
git add .nojekyll
git commit -m "chore: add .nojekyll to avoid Jekyll processing"
git push origin v0.0.2-gdr
```

## Testes locais rápidos

1. Servir localmente (recomendado para testar SW e paths relativos):

```bash
# a partir do diretório do projeto
python3 -m http.server 8000
# abra http://localhost:8000 no navegador
```

2. Testar Service Worker:
- Abra DevTools → Application → Service Workers. Verifique se `service-worker.js` registra. Ou abra a página em uma janela normal (SW só roda em HTTP(s) ou localhost).

3. Limpar SW/Caches localmente (via console):

```js
// no console do navegador
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
```

## Checagens pós-deploy (na URL pública)
- Abrir a página pública e confirmar:
  - `index.html` carrega corretamente (sem 404 em assets importantes).
  - `manifest.json` acessível: https://.../manifest.json
  - `service-worker.js` acessível e registro visível em DevTools → Application → Service Workers.
  - Meta OG preview (Twitter/GitHub) pode demorar a atualizar por cache.

## Troubleshooting comum

- 404 em assets após publicar
  - Causa: caminhos absolutos com leading slash. Solução: usar caminhos relativos (foi aplicado).

- YouTube embed não aparece
  - Causa: CSP bloqueando iframes. Solução: ajuste `frame-src` no `Content-Security-Policy` do `index.html` (já atualizado).

- Service Worker não registra
  - Verifique se o arquivo `service-worker.js` é servido do mesmo diretório do `index.html` e se o registro usa caminho relativo. Teste em `localhost` ou HTTPS.

- Conteúdo antigo sendo servido após deploy
  - Limpe o cache do navegador e/ou desinstale o service worker localmente (veja comandos acima). Considere incrementar `CACHE_NAME` no `service-worker.js` para forçar refresh.

## Recomendações adicionais

- Otimização de imagens: gerar WebP para thumbnails/OG e servir `srcset` se possível.
- Automatizar deploy: usar GitHub Action para criar/atualizar `gh-pages` automaticamente a cada push na branch principal.
- Monitorar a versão do SW: mantenha `CACHE_NAME` versionado (`linkhub-cache-vX`) e documente procedimentos para migração de cache.

## Comandos úteis (resumo)

- Publicar branch atual no remoto:

```bash
git push origin v0.0.2-gdr
```

- Criar/update `gh-pages` a partir de `v0.0.2-gdr`:

```bash
git push origin v0.0.2-gdr:gh-pages
```

- Adicionar `.nojekyll`:

```bash
echo '' > .nojekyll
git add .nojekyll
git commit -m "chore: add .nojekyll"
git push origin v0.0.2-gdr
```

## Pós-publicação (verificação rápida)
1. Acesse a URL do Pages fornecida pelo GitHub.
2. Abra DevTools → Network e filtre por `manifest.json` e `service-worker.js` para confirmar resposta 200.
3. Verifique Application → Service Workers → `status`.

---

Se quiser, eu faço agora:
- (1) criar `gh-pages` automaticamente a partir da branch atual e pushar, e/ou
- (2) adicionar `.nojekyll` e pushar, e/ou
- (3) configurar um workflow GitHub Actions básico para publicar automaticamente.

Escolha quais ações quer que eu execute e eu as aplico.
