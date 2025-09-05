Pasta material — pacote temporário de assets para integrar ao site

Coloque aqui os arquivos que estão faltando e eu os integrarei ao site. Estrutura sugerida:

- material/
  - assets/
    - cover.jpg (ou .png) — capa do álbum (ideal 1200x1200 ou 1200x800)
    - logo.png (192x192 ou svg) — ícone do app
    - avatar.jpg — foto do artista
  - videos/
    - clip.mp4 — clipe oficial (arquivo grande) ou um arquivo de referência
    - clip-embed.txt — se preferir colar a URL do YouTube, coloque aqui
  - audio/
    - beat1.mp3
    - beat2.mp3

O que eu preciso que você coloque aqui para eu integrar:
1) cover.jpg (ou cover.svg) — capa do álbum. Se possível, também uma versão widescreen para OG image.
2) logo.png ou logo.svg — ícone do app (192x192 e 512x512 são ideais).
3) avatar.jpg — foto do artista para header.
4) clip.mp4 ou um arquivo `clip-embed.txt` com a URL embed do YouTube (preferível usar URL embed).
5) beats/ .mp3 — os arquivos de áudio usados nos previews e downloads.

Quando colocar os arquivos, me avise que eu vou:
- mover os assets para `/assets` corretos,
- atualizar `index.html` para usar as imagens locais,
- atualizar `data`/`drops` se necessário,
- atualizar o service worker e manifest com os novos assets.
