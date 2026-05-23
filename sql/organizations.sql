// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------

Enum organization_status {
  pending_verification   // org created, corporate email not verified yet
  active                 // verified and operational
  suspended              // admin / moderation action
  deleted                // soft-deleted
}

Enum company_size {
  micro        // 1-9 employees
  small        // 10-49
  medium       // 50-249
  large        // 250-999
  enterprise   // 1000+
}

// ----------------------------------------------------------------------------
// Organization (root of the company domain)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='8e2a-...-fa01'
//   slug='nubank'                              (→ public URL: nubank.realwe)
//   name='Nubank'
//   tagline='O banco digital roxinho'
//   about='Nubank é uma fintech brasileira fundada em 2013...'
//   corporate_email='ana.souza@nubank.com.br'
//   corporate_email_verified_at='2026-01-12 09:42:00'
//   corporate_telephone='+55 11 4002-0022'
//   corporate_telephone_verified_at=NULL
//   industry='Fintech'
//   company_size='large'
//   founded_at='2013-05-06'
//   verified_at='2026-01-15 11:30:00'
//   website='https://nubank.com.br'
//   logo_url='https://cdn.realwe/orgs/1/logo.png'
//   banner_url='https://cdn.realwe/orgs/1/banner.jpg'
//   status='active'
//   is_public_page_active=true
//   is_official_representative_confirmed=true
//   created_by_user_id=10
//
// Note: fases customizadas do Kanban (antigo `custom_phases jsonb`) foram
// normalizadas em product_phases.sql.
//
Table organizations {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  slug varchar [unique, not null]                          // realwe subdomain (e.g. 'nubank' → nubank.realwe)
  name varchar [not null]
  tagline varchar                                          // short headline shown on the public page
  about text                                               // long description (form field "Sobre a Empresa")
  corporate_email varchar [not null]                       // declared at creation, requires verification link
  corporate_email_verified_at timestamptz                  // set when the verification link is clicked
  corporate_telephone varchar                              // optional contact number
  corporate_telephone_verified_at timestamptz              // set when the SMS code is confirmed
  industry varchar                                         // e.g. 'Fintech', 'Education', 'Healthcare'
  company_size company_size                                // employee count range
  founded_at date                                          // company founding date (public info)
  verified_at timestamptz                                  // platform-level verified badge (RealWe-confirmed)
  website varchar                                          // e.g. https://nubank.com.br
  logo_url varchar
  banner_url varchar
  status organization_status [not null, default: 'pending_verification']
  is_public_page_active boolean [not null, default: false] // switch in "Página da Empresa"
  is_official_representative_confirmed boolean [not null, default: false]
  followers_count integer [not null, default: 0]           // numberOfFollowers — counter denormalizado (mantido por trigger em follows)
  publications_count integer [not null, default: 0]        // numberOfPublication — denormalizado (count de posts publicados)
  following_count integer [not null, default: 0]           // numberOfToFollow — denormalizado (canais que esta org segue)
  created_by_user_id bigint [ref: > users.id, not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
