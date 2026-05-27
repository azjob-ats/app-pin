// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products → products.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// CTA form (cabeçalho do formulário dinâmico — "Saiba Mais")
// ----------------------------------------------------------------------------
//
// Espelho do LEARN_MORE_CONFIG.stepperConfig do frontend.
// Caminho paralelo a product_cta_forms — esta tabela modela exclusivamente
// formulários dinâmicos multi-step consumidos pelo Dynamic Form Engine
// (src/app/shared/components/dynamic-form).
//
// As 4 flags abaixo correspondem 1-1 ao stepperConfig do mock:
//   stepperConfig.showStepProgress           → show_step_progress
//   stepperConfig.showCheckboxPrivacyPolicy  → show_checkbox_privacy_policy
//   stepperConfig.nameLastButton             → name_last_button
//   stepperConfig.setRevisionStepper         → set_revision_stepper
//
// 1:N com products: um mesmo produto pode ter múltiplos forms (versionamento,
// A/B test). is_active controla qual é o vigente.
//
// Example rows:
//   id=1
//   product_id=1 (Vaga Eng. Sr. Python — Digix)
//   name='Form Candidatura — Eng. Python'
//   description='Formulário de candidatura para a vaga de Engenheiro de Software Especialista | Python'
//   show_step_progress=true
//   show_checkbox_privacy_policy=true
//   name_last_button='Candidatar-se para a vaga'
//   set_revision_stepper=true
//   is_active=true
//
Table cta_form {
  id bigint [pk, increment]
  product_id bigint [ref: > products.id, not null]
  name varchar [not null]                                       // nome admin-friendly do form (não exibido ao usuário final)
  description varchar                                           // descrição interna do propósito do form
  show_step_progress boolean [not null, default: true]          // exibe SpinnerStepsComponent no header do stepper
  show_checkbox_privacy_policy boolean [not null, default: true] // exibe checkbox de política de privacidade no step de revisão
  name_last_button varchar [not null, default: 'Enviar']        // texto do botão final (ex: 'Candidatar-se para a vaga')
  set_revision_stepper boolean [not null, default: true]        // se true, motor injeta automaticamente um step de revisão ao final
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (product_id, is_active)
  }
}
