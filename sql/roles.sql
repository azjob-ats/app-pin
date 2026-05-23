// ----------------------------------------------------------------------------
// Role concepts on the platform (documentation reference for the `roles` table):
//
// USER
// - usuário padrão da plataforma
// - pode criar currículo
// - aplicar para vagas
// - interagir com conteúdo
//
// CREATOR
// - creator/influenciador
// - possui portfolio/canal público
// - publica conteúdos
// - representa marcas/empresas
//
// RECRUITER
// - recrutador individual
// - gerencia vagas
// - visualiza candidatos
// - entra em contato com talentos
//
// COMPANY
// - conta empresarial
// - publica vagas
// - possui página da empresa
// - gerencia equipe/recrutadores
//
// ADMIN
// - acesso total ao sistema
//
// MODERATOR
// - moderação de conteúdo
// - denúncias
// - banimentos
//
// SUPPORT
// - suporte operacional
// - atendimento ao usuário
// - acesso administrativo limitado
// ----------------------------------------------------------------------------

Table roles {
  id bigint [pk, increment]
  name varchar [unique, not null]
  description varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}
