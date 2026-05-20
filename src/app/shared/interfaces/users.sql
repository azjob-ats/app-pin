/**

    https://dbdiagram.io/d

*/

/*
USER
- usuário padrão da plataforma
- pode criar currículo
- aplicar para vagas
- interagir com conteúdo

CREATOR
- creator/influenciador
- possui portfolio/canal público
- publica conteúdos
- representa marcas/empresas

RECRUITER
- recrutador individual
- gerencia vagas
- visualiza candidatos
- entra em contato com talentos

COMPANY
- conta empresarial
- publica vagas
- possui página da empresa
- gerencia equipe/recrutadores

ADMIN
- acesso total ao sistema

MODERATOR
- moderação de conteúdo
- denúncias
- banimentos

SUPPORT
- suporte operacional
- atendimento ao usuário
- acesso administrativo limitado


Enum user_status {
  active
  suspended
  banned
  deleted
}
*/
Table roles {
  id bigint [pk, increment]
  name varchar [unique, not null]
  description varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_roles {
  user_id bigint [ref: > users.id, not null]
  role_id bigint [ref: > roles.id, not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, role_id) [pk]
  }
}

Table users {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  username varchar [unique, not null]
  email varchar [unique, not null]
  status user_status [not null, default: 'active']
  last_login_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}

Table user_profiles {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  first_name varchar
  last_name varchar
  profile_picture varchar
  bio text
  headline varchar
  current_position varchar
  website varchar
  portfolio_url varchar
  date_of_birth date
  gender varchar
  pronoun varchar
  telephone varchar
  is_pcd boolean [not null, default: false]
  pcd_notes varchar
  skills varchar[]
  profile_visibility varchar [not null, default: 'public']
  is_published boolean [not null, default: false]
  is_verified boolean [not null, default: false]
  verified_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}

Table user_social_links {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  platform varchar [not null]
  handle varchar [not null]
  url varchar [not null]
  is_primary boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (user_profile_id, platform) [unique]
  }
}

Table user_addresses {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, not null]
  label varchar
  street varchar
  number varchar
  complement varchar
  neighborhood varchar
  city varchar
  federal_state varchar
  country varchar
  postal_code varchar
  is_default boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}

Table user_settings {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  language varchar [not null, default: 'pt-BR']
  theme varchar [not null, default: 'light']
  email_notifications boolean [not null, default: true]
  push_notifications boolean [not null, default: true]
  sms_notifications boolean [not null, default: false]
  allow_marketing_emails boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_security {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  password_hash varchar [not null]
  verified_email boolean [not null, default: false]
  verified_phone boolean [not null, default: false]
  email_verified_at timestamptz
  phone_verified_at timestamptz
  two_factor_enabled boolean [not null, default: false]
  failed_login_attempts integer [not null, default: 0]
  locked_until timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_oauth_accounts {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, not null]
  provider varchar [not null]
  provider_user_id varchar [not null]
  access_token text
  refresh_token text
  expires_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (provider, provider_user_id) [unique]
  }
}

Table user_experience {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  position varchar [not null]
  company varchar [not null]
  logo varchar
  employment_type varchar
  work_mode varchar
  location varchar
  start_date date [not null]
  end_date date
  is_current boolean [not null, default: false]
  description varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}

Table user_education {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  name varchar [not null]
  logo varchar
  course varchar [not null]
  start_date date [not null]
  end_date date
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}

Table user_language {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  name varchar [not null]
  proficiency varchar [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_certification {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  name varchar [not null]
  issuer_name varchar [not null]
  issuer_logo varchar
  issued_at date [not null]
  expires_at date
  credential_url varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}

/*
✅ USER (visitante)
✅ CREATOR (como pessoa)
⚠️ Lembrete
O creator institucionalizado (vínculo com canal/empresa, crédito perene "by Fulano", métricas de retenção/conversão) ainda não está — e nem deveria estar aqui. Isso entra quando você for modelar o domínio de organização / canal / conteúdo.
Pode seguir para a próxima entidade.
*/