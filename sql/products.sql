// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations                → organizations.sql
//   - organization_departments     → organization_departments.sql
//   - product_phases               → product_phases.sql
//   - users                        → users.sql
//
// Related tables (pitch eligibility — quem pode vender este produto):
//   - product_eligible_creators    → product_eligible_creators.sql   (mode='creators')
//   - product_eligible_groups      → product_eligible_groups.sql     (mode='groups')
// ----------------------------------------------------------------------------

Enum product_type {
  job          // Vaga          (RH)
  service      // Produto/Serv. (Comercial)
  training     // Treinamento   (Educação)
  news         // Notícia       (Comunicação)
  experience   // Experiência   (Operações)
}

Enum product_phase {
  draft         // criado, ainda não publicado
  published     // visível na página pública
  closed        // fechado para novas submissões (vaga preenchida, evento ocorrido)
  archived      // removido da listagem mas preservado para histórico
}

// Quem pode criar um pitch (vídeo) vendendo este produto.
Enum pitch_eligibility_mode {
  any           // qualquer creator institucionalizado da organização
  creators      // apenas creators específicos  → ver product_eligible_creators
  groups        // apenas grupos de creators     → ver product_eligible_groups
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
  custom_phase_id bigint [ref: > product_phases.id]             // override do Kanban quando a org configura fases próprias
  pitch_eligibility_mode pitch_eligibility_mode [not null, default: 'any']  // quem pode vender/pitchar este produto
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
