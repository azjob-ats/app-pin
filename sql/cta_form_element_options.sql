// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - cta_form_step_elements → cta_form_step_elements.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// CTA form element options (opções dos campos select/radio/checkbox group)
// ----------------------------------------------------------------------------
//
// Espelho de elements[].options[] no frontend. Cada linha representa uma
// alternativa selecionável.
//
// option_code é o valor persistido no payload de submissão quando o usuário
// seleciona a opção (ex: 'br' vai para product_submissions.payload.country).
// option_name é o rótulo visível na UI.
//
// Tabela separada (em vez de jsonb dentro de cta_form_step_elements) porque:
//   - permite reordenar opções via display_order sem reescrever o jsonb inteiro
//   - permite soft-delete por opção (deleted_at) preservando submissões antigas
//   - habilita query "todos os forms que oferecem a opção 'br'"
//
// O mock usa { name, code }; o DynamicLearnMoreService.toFormElement()
// converte para { name, code } novamente para o componente app-select.
// O LearnMoreMap intermediário usa { value, label } como padrão interno.
// No banco persistimos o padrão final consumido pelo motor:
//   option_code  = mock.code = FormElement.options[].code
//   option_name  = mock.name = FormElement.options[].name
//
// Example rows (element id=6 — 'country', select de País de origem):
//   id=1 | cta_form_step_element_id=6 | display_order=0 | option_code='br' | option_name='Brasil'
//   id=2 | cta_form_step_element_id=6 | display_order=1 | option_code='us' | option_name='EUA'
//   id=3 | cta_form_step_element_id=6 | display_order=2 | option_code='pt' | option_name='Portugal'
//
Table cta_form_element_options {
  id bigint [pk, increment]
  cta_form_step_element_id bigint [ref: > cta_form_step_elements.id, not null]
  display_order integer [not null, default: 0]
  option_code varchar [not null]                                // valor persistido na submissão (= mock.code)
  option_name varchar [not null]                                // rótulo exibido na UI (= mock.name)
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (cta_form_step_element_id, display_order)
    (cta_form_step_element_id, option_code) [unique]
  }
}
