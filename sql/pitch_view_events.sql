// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users   → users.sql
//   - pitches → pitches.sql
// ----------------------------------------------------------------------------
//
// Stream bruta de views de pitches (vídeos do creator). É a fonte que
// alimenta `pitch_metrics` (views, watch_time_seconds, retention_curve)
// via job de rollup.
//
// Operação recomendada em produção:
//   - PARTITION BY RANGE (created_at), partição mensal
//   - Job noturno popula `pitch_metrics` (1:1 com pitches)
//   - TTL de 90 dias na partição raw — após rollup, só a agregação importa
//   - `watched_seconds` permite reconstruir curva de retenção real
//   - Em escala alta, mover para Kafka → ClickHouse e manter aqui só `pitch_metrics`

Table pitch_view_events {
  id bigint [pk, increment]
  pitch_id bigint [ref: > pitches.id, not null]
  viewer_user_id bigint [ref: > users.id]                       // nullable — view anônimo
  session_id varchar                                            // dedupe / correlaciona com outros eventos da sessão
  watched_seconds integer [not null, default: 0]                // até qual segundo o viewer assistiu (usado em curva de retenção)
  completion_percent integer                                    // 0-100 — derivado de watched_seconds / duration
  device varchar                                                // 'web' | 'ios' | 'android' | 'tv'
  ip_hash varchar                                               // bot detection sem PII
  user_agent_hash varchar
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (pitch_id, created_at)
    (viewer_user_id, created_at)
    (pitch_id, watched_seconds)                                 // queries de retenção por bucket de segundo
  }
}
