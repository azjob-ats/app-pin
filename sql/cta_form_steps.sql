// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - cta_form → cta_form.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// CTA form steps (etapas do formulário multi-step)
// ----------------------------------------------------------------------------
//
// Espelho de LEARN_MORE_CONFIG.stepperLearnMore[] no frontend. Cada linha
// representa um step renderizado pelo GenericStepperComponent.
//
// step_key preserva o mock.id original (ex: 'job-content', 'personal-info').
// É usado para identificar o step de forma estável entre versões do form
// e para correlacionar com lógica do frontend (ex: classificação de step
// 'stepTextInContent' vs 'dynamicForm' em DynamicLearnMoreService).
//
// display_order é a fonte da verdade para ordenação — o motor renderiza
// na sequência crescente.
//
// O step de revisão (identifier='revisionStepper') NÃO é persistido aqui:
// quando cta_form.set_revision_stepper=true, o motor o injeta em runtime
// (ver DYNAMIC_ENGINE.md §7).
//
// Example rows (form id=1, Vaga Eng. Python):
//   id=1 | cta_form_id=1 | step_key='job-content'   | display_order=0 | title='Descrição da vaga'        | layout='horizontal'
//   id=2 | cta_form_id=1 | step_key='personal-info' | display_order=1 | title='Informações de contato'   | layout='horizontal'
//
Table cta_form_steps {
  id bigint [pk, increment]
  cta_form_id bigint [ref: > cta_form.id, not null]
  step_key varchar [not null]                                   // = mock.id; chave estável do step
  display_order integer [not null, default: 0]
  title varchar [not null]                                      // título exibido no header do step
  layout varchar [not null, default: 'horizontal']              // 'horizontal' | 'vertical' | 'grid'
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (cta_form_id, display_order)
    (cta_form_id, step_key) [unique]
  }
}
