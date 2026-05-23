// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
//   - posts → posts.sql
// ----------------------------------------------------------------------------
//
// Append-only — 1 linha por view do feed (não idempotente, mesmo user pode
// ver o mesmo post N vezes em sessões diferentes).
//
// Operação recomendada em produção:
//   - PARTITION BY RANGE (created_at), partição mensal
//   - Job noturno agrega para `posts.views_count` + `organization_growth_snapshots`
//   - TTL de 90 dias na partição raw (after rollup)
//   - Em escala alta, considerar mover para Kafka → ClickHouse/BigQuery
//     e manter no Postgres apenas o counter denormalizado

Table post_views {
  id bigint [pk, increment]
  post_id bigint [ref: > posts.id, not null]
  viewer_user_id bigint [ref: > users.id]                       // nullable — view anônimo conta
  session_id varchar                                            // dedupe de view duplicado na mesma sessão
  device varchar                                                // 'web' | 'ios' | 'android' | …
  ip_hash varchar                                               // SHA-256(ip + salt) — bot detection sem PII
  user_agent_hash varchar                                       // SHA-256(ua) — fingerprint leve
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (post_id, created_at)
    (viewer_user_id, created_at)
  }
}
