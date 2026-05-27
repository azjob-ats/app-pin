// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - cta_form_steps → cta_form_steps.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// CTA form step elements (campos de cada step do formulário)
// ----------------------------------------------------------------------------
//
// Espelho de stepperLearnMore[n].elements[] no frontend. Cada linha vira um
// componente renderizado pelo DynamicFieldDirective via COMPONENTS registry
// (ver DYNAMIC_ENGINE.md §5.1).
//
// element_key preserva o mock.id original (ex: 'firstName', 'email') — é
// usado como CHAVE DO FORMCONTROL pelo DynamicFormService:
//   controls[element.id] = [defaultValue, validators]
// e também aparece no payload de submissão como { id, value }.
//
// type aceita qualquer valor registrado em COMPONENTS:
//   'text' | 'email' | 'select' | 'uploadFile' | 'checkboxAuthorize' | 'textHTML'
// (extensível — adicionar novo type não exige migration, basta registrar o
// componente no COMPONENTS do frontend).
//
// static_value guarda o conteúdo HTML quando type='textHTML' (sem FormControl).
// default_value é o valor inicial do FormControl (prioridade sobre static_value
// no DynamicFormService — ver DYNAMIC_ENGINE.md §5.3).
//
// validators é jsonb porque o shape varia por type:
//   text/email/select: { "required": true }
//   uploadFile:        { "required": false, "accept": ".pdf", "multiple": false,
//                        "allowedTypes": ["application/pdf"], "maxFileSizeMB": 15 }
//   checkboxAuthorize: { "required": true }
//   com mensagens:     { "required": true, "errorRequired": "Este campo é obrigatório." }
//
// classes carrega as classes de grid do mock (ex: 'col-12 md:col-6'). Nullable
// porque elementos como textHTML não usam.
//
// Example rows (step id=1 — 'job-content'):
//   id=1 | cta_form_step_id=1 | element_key='applyJob' | display_order=0 | type='textHTML'
//        | label=NULL | placeholder=NULL | classes=NULL | default_value=NULL
//        | static_value='<div class="text-center text-4xl font-medium">Engenheiro de Software Especialista | Python</div><p>...</p>'
//        | validators=NULL
//
// Example rows (step id=2 — 'personal-info'):
//   id=2 | cta_form_step_id=2 | element_key='firstName' | display_order=0 | type='text'
//        | label='Nome completo' | placeholder='Informe seu nome' | classes='col-12 md:col-6'
//        | default_value=NULL | static_value=NULL
//        | validators='{"required": false}'
//
//   id=3 | cta_form_step_id=2 | element_key='phone' | display_order=1 | type='text'
//        | label='Celular com DDD' | placeholder='(11) 99999-9999' | classes='col-12 md:col-6'
//        | validators='{"required": false}'
//
//   id=4 | cta_form_step_id=2 | element_key='linkedin' | display_order=2 | type='text'
//        | label='LinkedIn' | placeholder='linkedin.com/in/seu-perfil' | classes='col-12 md:col-6'
//        | validators=NULL
//
//   id=5 | cta_form_step_id=2 | element_key='email' | display_order=3 | type='email'
//        | label='Seu melhor e-mail' | placeholder='email@exemplo.com' | classes='col-12 md:col-6'
//        | validators='{"required": false}'
//
//   id=6 | cta_form_step_id=2 | element_key='country' | display_order=4 | type='select'
//        | label='País de origem' | placeholder='Selecione' | classes='col-12 md:col-6'
//        | default_value=NULL
//        | validators='{"required": true, "errorRequired": "Este campo é obrigatório."}'
//        | (opções em cta_form_element_options: br, us, pt)
//
//   id=7 | cta_form_step_id=2 | element_key='city' | display_order=5 | type='text'
//        | label='Cidade' | placeholder='Informe sua cidade' | classes='col-12 md:col-6'
//        | validators=NULL
//
//   id=8 | cta_form_step_id=2 | element_key='attachedResume' | display_order=6 | type='uploadFile'
//        | label='Currículo (PDF)' | placeholder=NULL | classes='col-12'
//        | validators='{"required": false, "accept": ".pdf", "multiple": false,
//                       "allowedTypes": ["application/pdf"], "maxFileSizeMB": 15}'
//
//   id=9 | cta_form_step_id=2 | element_key='authorizeDataStorage' | display_order=7 | type='checkboxAuthorize'
//        | label='Concordo que meus dados pessoais sejam armazenados...' | classes='col-12'
//        | validators='{"required": true}'
//
//   id=10 | cta_form_step_id=2 | element_key='authorizeDataSharing' | display_order=8 | type='checkboxAuthorize'
//        | label='Autorizo a RealWe a enviar informações...' | classes='col-12'
//        | validators='{"required": true}'
//
Table cta_form_step_elements {
  id bigint [pk, increment]
  cta_form_step_id bigint [ref: > cta_form_steps.id, not null]
  element_key varchar [not null]                                // = mock.id; chave do FormControl no DynamicFormService
  display_order integer [not null, default: 0]
  type varchar [not null]                                       // 'text' | 'email' | 'select' | 'uploadFile' | 'checkboxAuthorize' | 'textHTML' | …
  label varchar                                                 // nullable — textHTML não tem
  placeholder varchar                                           // nullable — nem todo type usa
  classes varchar                                               // classes de grid (ex: 'col-12 md:col-6'); nullable
  default_value text                                            // valor inicial do FormControl (DynamicFormService prioriza sobre static_value)
  static_value text                                             // conteúdo fixo — usado por textHTML para guardar HTML
  validators jsonb                                              // shape varia por type (ver comentário acima)
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (cta_form_step_id, display_order)
    (cta_form_step_id, element_key) [unique]
  }
}
