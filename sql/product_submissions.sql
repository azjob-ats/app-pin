// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products          → products.sql
//   - product_cta_forms → product_cta_forms.sql
//   - users             → users.sql
//   - pitches           → pitches.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Product submissions (respostas recebidas pelo CTA — entram na Triagem)
// ----------------------------------------------------------------------------
//
// Example rows (candidaturas para a Vaga Eng. Sr., product_id=1):
//   id=1
//   uuid='7c3f-…-9a01'
//   product_id=1
//   cta_form_id=1
//   submitter_user_id=42 (Ana Pereira, tem conta na RealWe)
//   submitter_email='ana.pereira@gmail.com'
//   payload={
//     "full_name":"Ana Pereira",
//     "email":"ana.pereira@gmail.com",
//     "linkedin":"https://linkedin.com/in/anapereira",
//     "cv":"https://cdn.realwe/submissions/1/cv.pdf"
//   }
//   triage_phase='inbox'
//   attributed_pitch_id=8 (pitch da Amanda — gerou essa candidatura)
//   source_url='https://nubank.realwe/vagas/eng-sr-backend'
//
//   id=2 | submitter_user_id=NULL | submitter_email='joao@anonimo.com' | (visitante sem conta)
//
Table product_submissions {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  product_id bigint [ref: > products.id, not null]
  cta_form_id bigint [ref: > product_cta_forms.id, not null]
  submitter_user_id bigint [ref: > users.id]                    // NULL = visitante anônimo
  submitter_email varchar                                       // capturado quando anônimo
  submitter_name_snapshot varchar                               // snapshot do nome no momento da submissão (Submission.candidate.name)
  submitter_avatar_url_snapshot varchar                         // snapshot do avatar (Submission.candidate.avatarUrl)
  submitter_context_line varchar                                // linha de contexto exibida no card (Submission.candidate.contextLine)
  payload jsonb [not null]                                      // respostas dos fields do form (Submission.answers[] no front)
  triage_phase varchar [not null, default: 'inbox']             // Kanban de Triagem
  assigned_to_user_id bigint [ref: > users.id]                  // recrutador/responsável atribuído (Submission.assignedTo)
  internal_notes text                                           // anotações privadas da equipe (Submission.internalNotes)
  attributed_pitch_id bigint [ref: > pitches.id]                // qual pitch gerou a conversão (atribuição)
  source_url varchar                                            // referrer
  ip_hash varchar                                               // LGPD: hash SHA-256, não IP cru
  user_agent varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (product_id, triage_phase)
    (product_id, created_at)
    (assigned_to_user_id, triage_phase)
    (attributed_pitch_id)
  }
}
