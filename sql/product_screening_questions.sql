// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products → products.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Product screening questions (perguntas de triagem por produto)
// ----------------------------------------------------------------------------
//
// O frontend já modela isso em Product.screeningQuestions[]:
//   { id, question, idealAnswer, required }
//
// Tabela própria (e não jsonb) porque as respostas dos candidatos (em
// product_submission_screening_answers) precisam referenciar a question_id
// individualmente — permite filtrar/buscar "candidatos cuja resposta à
// pergunta X bateu com idealAnswer".
//
// Example rows (Vaga Eng. Sr., product_id=1):
//   id=1 | product_id=1 | order=0 | question='Anos de experiência com Go?'        | ideal_answer='Mais de 3 anos'      | required=true
//   id=2 | product_id=1 | order=1 | question='Disponibilidade para viagens?'      | ideal_answer='Sim, esporadicamente' | required=false
//   id=3 | product_id=1 | order=2 | question='Pretensão salarial (faixa CLT)?'    | ideal_answer='R$ 18k–22k'          | required=true
//
Table product_screening_questions {
  id bigint [pk, increment]
  product_id bigint [ref: > products.id, not null]
  display_order integer [not null, default: 0]
  question text [not null]
  ideal_answer text                                             // resposta-modelo usada para destacar match no card de Triagem
  required boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (product_id, display_order)
  }
}
