// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
//   - pitches       → pitches.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/campaigns.js (CAMPAIGNS)
//
// Naming note:
//   Campanha = compra paga de "slots" (combinações date+hour) para impulsionar
//   um pitch em buscas por uma keyword específica. As horas compradas vivem em
//   `campaign_slot_hours`. Performance e card são denormalizadas como JSONB
//   porque (a) variam de forma por campanha, (b) raramente queryamos campos
//   internos isoladamente, (c) card_token deve sair daqui em prod (PCI).

Enum campaign_status {
  pending      // criada sem método de pagamento — aguardando card
  scheduled    // paga e agendada — vai começar no windowFrom
  running      // ativa agora (windowFrom ≤ now ≤ windowTo)
  completed    // janela encerrada — performance final disponível
  cancelled    // cancelada pelo dono antes de completar
}

// ----------------------------------------------------------------------------
// Campaigns (boost pago de pitch para keyword + janela temporal)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='cam-001'
//   organization_id=1 (Nubank)
//   pitch_id=1 ('Como nasceu o time de design do Nubank')
//   keyword='design system corporativo'
//   status='running'
//   window_from='2026-05-14', window_to='2026-05-27'
//   total_cost_cents=213000 (R$ 2.130,00)
//   started_at='2026-05-14 00:00:00', ended_at=NULL
//   performance={"impressions":18420,"clicks":1840,"ctr":9.98,"conversions":87,"costPerConversion":24.5,"spent":2130,"remaining":1370}
//   payment_method={"brand":"Visa","last4":"4242","holderName":"Nubank S.A."}
//
//   id=4
//   uuid='cam-004'
//   keyword='cultura organizacional'
//   status='completed'
//   performance={"impressions":9620,"clicks":720,"ctr":7.48,...}
//
Table campaigns {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]    // canal anunciante
  pitch_id bigint [ref: > pitches.id, not null]                 // vídeo impulsionado (`video` no mock)
  keyword varchar [not null]                                    // termo de busca alvo
  status campaign_status [not null, default: 'pending']
  window_from timestamptz [not null]                            // início da janela contratada
  window_to timestamptz [not null]                              // fim da janela contratada
  total_cost_cents integer [not null, default: 0]               // soma de todos os slots em centavos (BRL)
  started_at timestamptz                                        // set quando status vira running
  ended_at timestamptz                                          // set quando status vira completed
  performance jsonb                                             // { impressions, clicks, ctr, conversions, costPerConversion, spent, remaining }
  projection jsonb                                              // { estimatedImpressions, estimatedClicks, winProbability, … } — forecast no momento da criação
  payment_method jsonb                                          // { brand, last4, holderName, expirationMonth, expirationYear } — substituir por payment_method_id em prod (PCI)
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, status, created_at)
    (status, window_from)
    keyword
    pitch_id
  }
}
