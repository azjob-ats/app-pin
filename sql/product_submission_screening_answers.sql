// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - product_submissions         → product_submissions.sql
//   - product_screening_questions → product_screening_questions.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Product submission screening answers (respostas às perguntas de triagem)
// ----------------------------------------------------------------------------
//
// Espelho de Submission.screeningAnswers[] no frontend:
//   { questionId, question, idealAnswer, answer, required, matchesIdeal }
//
// Snapshot dos campos `question`/`ideal_answer` no momento da resposta —
// preserva o que o candidato realmente viu mesmo que a empresa edite a
// pergunta depois.
//
// Example rows (resposta da Ana Pereira à Vaga Eng. Sr.):
//   id=1 | submission_id=1 | question_id=1 | question_snapshot='Anos de experiência com Go?'     | ideal_answer_snapshot='Mais de 3 anos'      | answer='4 anos, atualmente em produção' | matches_ideal=true
//   id=2 | submission_id=1 | question_id=2 | question_snapshot='Disponibilidade para viagens?'   | ideal_answer_snapshot='Sim, esporadicamente' | answer='Sim'                            | matches_ideal=true
//   id=3 | submission_id=1 | question_id=3 | question_snapshot='Pretensão salarial?'             | ideal_answer_snapshot='R$ 18k–22k'          | answer='R$ 24k'                         | matches_ideal=false
//
Table product_submission_screening_answers {
  id bigint [pk, increment]
  submission_id bigint [ref: > product_submissions.id, not null]
  question_id bigint [ref: > product_screening_questions.id, not null]
  question_snapshot text [not null]                             // texto da pergunta no momento da resposta
  ideal_answer_snapshot text                                    // ideal_answer no momento da resposta
  answer text [not null]
  required_snapshot boolean [not null, default: false]
  matches_ideal boolean [not null, default: false]              // resultado da comparação (avaliada pelo backend/heurística)
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (submission_id, question_id) [unique]
    (question_id, matches_ideal)
  }
}
