// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products → products.sql
// ----------------------------------------------------------------------------

Enum product_cta_type {
  external_link      // só redireciona para uma URL externa
  form               // coleta dados via formulário dinâmico
  confirmation       // 1-click "tenho interesse" (sem campos)
  payment            // checkout (Stripe, Pagar.me, …)
  redirect_internal  // navega para outra tela do RealWe (ex.: inscrição em curso)
}

// ----------------------------------------------------------------------------
// Product CTA forms (o "Saiba Mais" — polimórfico via type + jsonb config)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1 | product_id=1 (Vaga Eng. Sr.) | type='form' | label='Candidatar-me'
//        config={
//          "fields":[
//            {"key":"full_name","label":"Nome completo","type":"text","required":true},
//            {"key":"email","label":"Email","type":"email","required":true},
//            {"key":"linkedin","label":"LinkedIn","type":"url"},
//            {"key":"cv","label":"Currículo (PDF)","type":"file","accept":[".pdf"],"required":true}
//          ],
//          "submit_label":"Enviar candidatura",
//          "privacy_required":true
//        }
//
//   id=2 | product_id=2 (Workshop) | type='confirmation' | label='Quero participar'
//        config={"confirmation_message":"Inscrição confirmada! Você receberá o link no email."}
//
//   id=3 | product_id=N (Curso pago) | type='payment' | label='Comprar curso'
//        config={"provider":"stripe","price_cents":29900,"currency":"BRL","success_url":"/obrigado"}
//
//   id=4 | product_id=N (Vaga externa) | type='external_link' | label='Ver na nossa página'
//        config={"url":"https://nubank.com.br/carreiras/abc","open_in":"new_tab"}
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
