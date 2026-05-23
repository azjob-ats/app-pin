// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
//   - media_assets  → media_assets.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/winning-slots.js (MOCK_WINNING_SLOTS)
//
// Naming note:
//   Slots injetados pelo backend em buracos da grid do feed. Diferente de
//   `posts` (conteúdo orgânico do canal) — winning slot é selecionado por
//   algoritmo (recomendação, anúncio, banner informativo) e carrega um
//   payload renderizado por `content_type`:
//     - movie / image → referência a `media_assets.id`
//     - html          → payload com markup + CSS embutidos
//     - component     → referência a um Angular component registrado
//   `aspect_ratio` determina em quais buracos da grid o slot encaixa
//   (9:16 = 1 col; 16:9 = 3 cols desktop / 2 cols mobile).

Enum winning_slot_kind {
  recommendation   // sugestão orgânica priorizada pelo ranker
  ad               // anúncio pago (vinculável a campaigns no futuro)
  informative      // banner institucional (newsletter, premium, etc.)
  interactive      // bloco com componente Angular interativo (poll, signup)
}

Enum winning_slot_content_type {
  movie       // vídeo (usa media_assets)
  image       // imagem estática (usa media_assets)
  html        // markup HTML+CSS embutido (sanitizado no front)
  component   // referência a componente Angular registrado
}

// ----------------------------------------------------------------------------
// Winning slots (slots injetados na grid — ads/recos/banners interativos)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='ws-mv-169-001'
//   organization_id=1 (Digix)
//   slot_kind='recommendation'
//   content_type='movie'
//   media_id=42 (vídeo 'Hack Hunters - Cyber investigations')
//   aspect_ratio='16:9'
//   title='Hack Hunters - Cyber investigations'
//   slug='hack-hunters-cyber-investigations'
//   views_count=12589, likes_count=1247
//
//   id=3
//   uuid='ws-img-169-001'
//   organization_id=1 (Digix)
//   slot_kind='ad'
//   content_type='image'
//   media_id=87
//   aspect_ratio='16:9'
//   external_link='https://digix.com'
//   cta_label='Saiba mais'
//
//   id=5
//   uuid='ws-html-169-001'
//   organization_id=1 (Digix)
//   slot_kind='informative'
//   content_type='html'
//   media_id=NULL
//   payload={"html":"<div class=\"ws-banner\">...</div>","css":".ws-banner{...}"}
//   external_link='https://digix.com/newsletter'
//
//   id=7
//   uuid='ws-cmp-916-001'
//   slot_kind='interactive'
//   content_type='component'
//   payload={"componentId":"newsletter-signup","props":{"title":"...","placeholder":"seu@email.com","submitLabel":"Criar uma conta"}}
//
Table winning_slots {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]    // canal patrocinador
  slot_kind winning_slot_kind [not null]                        // classificação semântica (usada por reporting/targeting)
  content_type winning_slot_content_type [not null]             // define qual renderer o front usa
  media_id bigint [ref: > media_assets.id]                      // preenchido quando content_type ∈ {movie, image}
  aspect_ratio varchar [not null]                               // '16:9' | '9:16' | etc. — define encaixe na grid
  title varchar [not null]                                      // exibido no overlay/legenda
  slug varchar                                                  // `titleLink` no mock
  description text
  external_link varchar                                         // `link` no mock — destino do clique
  cta_label varchar                                             // `cta` no mock — texto do botão (ex.: 'Saiba mais')
  payload jsonb                                                 // { html, css } para html | { componentId, props } para component
  views_count integer [not null, default: 0]                    // denormalizado — atualizado por evento
  likes_count integer [not null, default: 0]
  comments_count integer [not null, default: 0]
  shares_count integer [not null, default: 0]
  is_reported boolean [not null, default: false]
  is_blocked boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, slot_kind)
    (slot_kind, aspect_ratio)
  }
}
