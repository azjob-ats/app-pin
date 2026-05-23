// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - pitches → pitches.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/metrics.js (VIDEO_TEMPLATES, VIDEOS)
//
// Naming note:
//   Métricas agregadas por pitch (vídeo do creator). 1:1 com `pitches`.
//   A curva de retenção (12 pontos no mock — gerada por buildRetentionCurve)
//   é armazenada como JSONB ao invés de tabela filha, porque (a) o array é
//   sempre lido inteiro junto da métrica, (b) tamanho é fixo (≤ 50 pontos)
//   e (c) raramente atualizado fora do batch noturno.

// ----------------------------------------------------------------------------
// Pitch metrics (analytics agregadas por pitch — atualizado por job noturno)
// ----------------------------------------------------------------------------
//
// Example rows:
//   pitch_id=1 ('Como nasceu o time de design do Nubank')
//   views=18420
//   watch_time_seconds=6171264
//   avg_retention_percent=62
//   hook_retention_percent=88
//   climax_at_second=210
//   climax_retention_percent=76
//   drop_off_at_second=340
//   subscribers_gained=412
//   conversions=89
//   retention_curve=[{"second":0,"retention":88}, ..., {"second":540,"retention":42}]
//
//   pitch_id=2 ('O processo que reduziu nosso churn em 30%')
//   views=12340
//   avg_retention_percent=54
//
Table pitch_metrics {
  pitch_id bigint [pk, ref: > pitches.id]                       // 1:1 — PK + FK
  views integer [not null, default: 0]                          // total de views agregado
  watch_time_seconds bigint [not null, default: 0]              // tempo total assistido (todos viewers somados)
  avg_retention_percent integer [not null, default: 0]          // % média de retenção no vídeo (0-100)
  hook_retention_percent integer [not null, default: 0]         // retenção nos primeiros 3s (qualidade do gancho)
  climax_at_second integer                                      // segundo em que ocorre o pico de engajamento
  climax_retention_percent integer                              // retenção no segundo de clímax
  drop_off_at_second integer                                    // segundo em que começa a queda forte
  subscribers_gained integer [not null, default: 0]             // novos seguidores atribuídos a este pitch
  conversions integer [not null, default: 0]                    // cliques em "Saiba mais" / submissão de form
  retention_curve jsonb                                         // [{ "second": int, "retention": int(0-100) }, ...]
  computed_at timestamptz [not null, default: `now()`]          // quando o job rodou pela última vez
}
