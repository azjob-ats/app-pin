// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products → products.sql
// ----------------------------------------------------------------------------
//
// NOTA: formulários dinâmicos ("Saiba Mais" com múltiplos campos) NÃO usam
// esta tabela — eles vivem em cta_form + cta_form_steps + cta_form_step_elements
// + cta_form_element_options (ver cta_form.sql). Esta tabela cobre apenas os
// CTAs polimórficos não-formulário.

Enum product_cta_type {
  external_link      // só redireciona para uma URL externa
  confirmation       // 1-click "tenho interesse" (sem campos)
  payment            // checkout (Stripe, Pagar.me, …)
  redirect_internal  // navega para outra tela do RealWe (ex.: inscrição em curso)
}

// ----------------------------------------------------------------------------
// Product CTA forms (CTAs não-formulário — polimórfico via type + jsonb config)
// ----------------------------------------------------------------------------
//
// Cobre os 4 tipos de CTA que NÃO são formulários multi-step. Para "Saiba Mais"
// com campos preenchíveis, ver cta_form.sql.
//
// Example rows:
//   id=1 | product_id=2 (Workshop) | type='confirmation' | label='Quero participar'
//        config={"confirmation_message":"Inscrição confirmada! Você receberá o link no email."}
//
//   id=2 | product_id=N (Curso pago) | type='payment' | label='Comprar curso'
//        config={"provider":"stripe","price_cents":29900,"currency":"BRL","success_url":"/obrigado"}
//
//   id=3 | product_id=N (Vaga externa) | type='external_link' | label='Ver na nossa página'
//        config={"url":"https://nubank.com.br/carreiras/abc","open_in":"new_tab"}
//
//   id=4 | product_id=N (Inscrição em curso interno) | type='redirect_internal' | label='Acessar'
//        config={"route":"/cursos/inscricao/123"}
//
Table product_cta_forms {
  id bigint [pk, increment]
  product_id bigint [ref: > products.id, unique, not null]      // 1:1 com produto (remover unique para A/B test)
  type product_cta_type [not null]
  label varchar [not null, default: 'Saiba Mais']               // texto do botão
  config jsonb [not null]                                       // schema depende do type (ver exemplos)
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}
