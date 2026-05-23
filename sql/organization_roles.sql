// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Roles (system presets + custom roles per organization)
// ----------------------------------------------------------------------------
//
// Example rows:
//   Preset roles (organization_id=NULL):
//     id=1 | name='admin'      | description='Acesso total ao canal'              | is_preset=true | is_system=true
//     id=2 | name='recruiter'  | description='Gerencia Vagas e Triagens de Vaga'  | is_preset=true | is_system=true
//     id=3 | name='sales'      | description='Gerencia Produtos/Serviços'         | is_preset=true | is_system=true
//     id=4 | name='education'  | description='Gerencia Treinamentos'              | is_preset=true | is_system=true
//     id=5 | name='comms'      | description='Gerencia Notícias'                  | is_preset=true | is_system=true
//     id=6 | name='operations' | description='Gerencia Experiências'              | is_preset=true | is_system=true
//     id=7 | name='viewer'     | description='Somente leitura'                    | is_preset=true | is_system=true
//   Custom role of Nubank (organization_id=1):
//     id=8 | organization_id=1 | name='Líder de Talent' | description='Recrutador + métricas' | is_preset=false
//
Table organization_roles {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id]   // NULL = system preset (admin, recruiter…)
  name varchar [not null]
  description varchar
  is_preset boolean [not null, default: false]       // true for system templates
  is_default boolean [not null, default: false]      // assigned to new members by default
  is_system boolean [not null, default: false]       // protected from edition/deletion
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, name) [unique]
  }
}
