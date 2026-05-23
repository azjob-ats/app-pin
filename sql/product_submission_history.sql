// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - product_submissions → product_submissions.sql
//   - users               → users.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Product submission history (timeline de eventos por submission)
// ----------------------------------------------------------------------------
//
// Espelho de Submission.history[] no frontend. Mantém o histórico de movimentação
// no Kanban de Triagem, notas, atribuições, etc.
//
// Example rows (histórico da submission_id=1):
//   id=1 | submission_id=1 | actor_user_id=NULL | actor_label='Sistema'      | action='submission.created' | from_phase=NULL      | to_phase='inbox'       | note=NULL
//   id=2 | submission_id=1 | actor_user_id=11   | actor_label='Bruno Lima'   | action='triage.moved'       | from_phase='inbox'   | to_phase='shortlist'   | note='Boa aderência ao perfil'
//   id=3 | submission_id=1 | actor_user_id=11   | actor_label='Bruno Lima'   | action='note.added'         | from_phase=NULL      | to_phase=NULL          | note='Marcar entrevista técnica'
//   id=4 | submission_id=1 | actor_user_id=11   | actor_label='Bruno Lima'   | action='member.assigned'    | from_phase=NULL      | to_phase=NULL          | note='Atribuído a Carla Mendes'
//
Table product_submission_history {
  id bigint [pk, increment]
  submission_id bigint [ref: > product_submissions.id, not null]
  actor_user_id bigint [ref: > users.id]                        // NULL quando ação foi do sistema
  actor_label varchar [not null]                                // snapshot do nome ('Sistema', 'Bruno Lima') para histórico estável
  action varchar [not null]                                     // 'submission.created', 'triage.moved', 'note.added', 'member.assigned', …
  from_phase varchar                                            // fase anterior (quando aplicável)
  to_phase varchar                                              // fase nova (quando aplicável)
  note text                                                     // texto livre opcional do evento
  metadata jsonb                                                // payload adicional do evento
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (submission_id, created_at)
  }
}
