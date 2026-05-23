// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/metrics.js → buildGrowthSeries()
//
// Naming note:
//   Snapshot diário de métricas agregadas por organização (canal).
//   Alimenta os gráficos de crescimento em "Métricas" (subscribers/views
//   por dia). Distinto de `pitch_metrics`, que é por vídeo individual.

// ----------------------------------------------------------------------------
// Organization growth snapshots (série temporal diária por canal)
// ----------------------------------------------------------------------------
//
// Example rows:
//   organization_id=1 (Digix), snapshot_date='2026-05-17', subscribers=68, views=952
//   organization_id=1, snapshot_date='2026-05-16', subscribers=43, views=890
//   organization_id=1, snapshot_date='2026-05-15', subscribers=51, views=921
//
Table organization_growth_snapshots {
  organization_id bigint [ref: > organizations.id, not null]
  snapshot_date date [not null]                                 // dia coberto (UTC) — chave primária composta
  subscribers integer [not null, default: 0]                    // novos seguidores conquistados nesse dia
  views integer [not null, default: 0]                          // views totais nesse dia (todos os pitches/posts da org)
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, snapshot_date) [pk]
    snapshot_date
  }
}
