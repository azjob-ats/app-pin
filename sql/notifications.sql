// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users      → users.sql
//   - pins       → pins.sql
//   - pin_boards → pin_boards.sql
//   - posts      → posts.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/notifications.js (MOCK_NOTIFICATIONS)
//
// Polymorphism note:
//   Em vez de (entity_type, entity_id) genérico, usamos colunas opcionais
//   por tipo de alvo (pin_id, board_id, post_id). É menos genérico mas
//   permite FK válidas, ON DELETE CASCADE e índices nativos. Se novos tipos
//   surgirem (ex.: collection, channel), adicionamos novas colunas
//   opcionais — mantendo a simplicidade do schema.

Enum notification_type {
  new_follower      // alguém começou a seguir o usuário
  pin_saved         // alguém salvou um pin do usuário
  pin_comment       // alguém comentou em um pin do usuário
  board_follow      // alguém seguiu uma board do usuário
  mention           // alguém mencionou o usuário em um comentário
  post_like         // (futuro) like em post de feed
  post_comment      // (futuro) comentário em post de feed
}

// ----------------------------------------------------------------------------
// Notifications (notificações entregues ao usuário)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='n1'
//   recipient_user_id=10 (usuário logado)
//   actor_user_id=2 (design_lover)
//   type='new_follower'
//   message='started following you'
//   is_read=false
//
//   id=2
//   uuid='n2'
//   recipient_user_id=10
//   actor_user_id=3 (art_studio)
//   type='pin_saved'
//   pin_id=1 (Sunset vibes in the mountains)
//   message='saved your pin'
//
//   id=4
//   uuid='n4'
//   actor_user_id=5 (creative_hub)
//   type='board_follow'
//   board_id=1 (Travel Inspiration)
//
Table notifications {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  recipient_user_id bigint [ref: > users.id, not null]          // destinatário (a quem aparece a notificação)
  actor_user_id bigint [ref: > users.id, not null]              // quem disparou o evento
  type notification_type [not null]
  message varchar [not null]                                    // texto curto pré-renderizado para o feed
  pin_id bigint [ref: > pins.id]                                // alvo quando type ∈ {pin_saved, pin_comment, mention}
  board_id bigint [ref: > pin_boards.id]                        // alvo quando type=board_follow
  post_id bigint [ref: > posts.id]                              // alvo quando type ∈ {post_like, post_comment}
  is_read boolean [not null, default: false]
  read_at timestamptz                                           // setado quando is_read vira true
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (recipient_user_id, is_read, created_at)
    (recipient_user_id, created_at)
  }
}
