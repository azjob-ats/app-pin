// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users                     → users.sql
//   - organizations             → organizations.sql
//   - organization_departments  → people_and_permissions.sql
//   - product_type (enum)       → people_and_permissions.sql
//   - pitches                   → pitches.sql
// ----------------------------------------------------------------------------

Enum product_phase {
  draft         // criado, ainda não publicado
  published     // visível na página pública
  closed        // fechado para novas submissões (vaga preenchida, evento ocorrido)
  archived      // removido da listagem mas preservado para histórico
}

Enum product_cta_type {
  external_link      // só redireciona para uma URL externa
  form               // coleta dados via formulário dinâmico
  confirmation       // 1-click "tenho interesse" (sem campos)
  payment            // checkout (Stripe, Pagar.me, …)
  redirect_internal  // navega para outra tela do RealWe (ex.: inscrição em curso)
}

// ----------------------------------------------------------------------------
// Products (o que a empresa oferece — Vaga, Serviço, Curso, Notícia, Conteúdo)
// ----------------------------------------------------------------------------
//
// Example rows (Nubank, organization_id=1):
//   id=1
//   uuid='b1a2-…-c9f0'
//   organization_id=1
//   department_id=1 (RH)
//   type='job'
//   title='Engenheira(o) de Software Sênior — Backend'
//   description='Atuação no time de Pagamentos, stack Go + Kafka…'
//   cover_image_url='https://cdn.realwe/products/1/cover.jpg'
//   phase='published'
//   starts_at='2026-05-15 09:00:00'
//   ends_at='2026-07-15 23:59:00'
//   type_metadata={"work_mode":"remote","level":"senior","salary_range":"R$ 18k–24k","location":"Brasil"}
//   created_by_user_id=11 (Bruno Lima, recruiter)
//
//   id=2
//   organization_id=1
//   department_id=3 (Universidade)
//   type='training'
//   title='Workshop: Carreira em Engenharia no Nubank'
//   type_metadata={"price_cents":0,"duration_minutes":90,"format":"online_live"}
//
Table products {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]
  department_id bigint [ref: > organization_departments.id]    // RH, Comercial, Universidade…
  type product_type [not null]                                  // job, service, training, news, experience
  title varchar [not null]
  subtitle varchar                                              // chamada curta exibida no card (espelha Product.subtitle no front)
  badges varchar[]                                              // tags curtas exibidas no card (ex.: ["Remoto","Sênior","CLT"])
  location varchar                                              // localidade exibida no card (ex.: "São Paulo / Remoto")
  description jsonb                                             // blocos estruturados: [{ "id":"d1", "title":"Sobre a vaga", "body":"..." }, …]
  cover_image_url varchar
  phase product_phase [not null, default: 'draft']              // coluna padrão do Kanban
  custom_phase_id bigint                                        // override do Kanban quando a org configura fases próprias
  starts_at timestamptz                                         // publicação programada
  ends_at timestamptz                                           // expiração (vaga fecha em…, evento ocorre em…)
  published_at timestamptz                                      // timestamp de publicação efetiva (Product.publishedAt no front)
  type_metadata jsonb                                           // dados específicos por type (ver exemplos)
  views_count integer [not null, default: 0]                    // contador denormalizado — atualizado por evento/trigger
  submissions_count integer [not null, default: 0]              // contador denormalizado — atualizado ao inserir em product_submissions
  created_by_user_id bigint [ref: > users.id, not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, phase)
    (organization_id, type, phase)
    (organization_id, department_id)
  }
}

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
