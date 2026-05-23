// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - campaigns → campaigns.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/campaigns.js → buildMockCampaign().hours[]
//
// Naming note:
//   Cada linha = 1 slot horário (1h de exibição prioritária na keyword da
//   campanha). O preço é congelado no momento da reserva (priceFor() roda
//   na inserção) para que mudanças nas bandas de preço não retroajam.
//   Calendário de disponibilidade não vive aqui — é computado em runtime
//   a partir de regras de pricing + (date, hour) já reservados.

// ----------------------------------------------------------------------------
// Campaign slot hours (slots horários comprados por uma campanha)
// ----------------------------------------------------------------------------
//
// Example rows (campaign_id=1, keyword='design system corporativo'):
//   campaign_id=1, slot_date='2026-05-14', hour=9,  price_cents=60000   // R$ 600,00
//   campaign_id=1, slot_date='2026-05-14', hour=10, price_cents=60000
//   campaign_id=1, slot_date='2026-05-14', hour=11, price_cents=60000
//   campaign_id=1, slot_date='2026-05-14', hour=14, price_cents=37500
//   campaign_id=1, slot_date='2026-05-14', hour=15, price_cents=37500
//   campaign_id=1, slot_date='2026-05-15', hour=9,  price_cents=60000
//   ...
//
Table campaign_slot_hours {
  campaign_id bigint [ref: > campaigns.id, not null]
  slot_date date [not null]                                     // dia do slot (UTC)
  hour integer [not null]                                       // 0..23
  price_cents integer [not null]                                // preço congelado em centavos (BRL)
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (campaign_id, slot_date, hour) [pk]
    (slot_date, hour)                                          // reverso: dado um slot, quais campanhas o disputam
  }
}
