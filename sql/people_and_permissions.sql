/*
# sempre que for criado uma nova feature, deve criar uma flag de permissões

Products:
    create_product
    edit_product
    move_product_between_phases
    close_product
    delete_product
    create_edit_kanban_phases

Screenings:
    view_triages
    move_triage_between_phases

Team:
    access_people_tab
    invite_manage_users

Organization:
    edit_company_settings

Others:
    launch_sponsored_campaign
    view_metrics

*/

Enum organization_member_status {
  active
  pending
  inactive
  removed
}

Enum product_type {
  job          // Vaga          (RH)
  service      // Produto/Serv. (Comercial)
  training     // Treinamento   (Educação)
  news         // Notícia       (Comunicação)
  experience   // Experiência   (Operações)
}

Enum permission_group {
  products
  screenings
  team
  organization
  others
}

// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users          → index.sql
//   - organizations  → organizations.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Permission catalog (canonical list of actions, optionally scoped per product)
// ----------------------------------------------------------------------------
//
// Example rows (system-wide catalog, shared across orgs):
//   id=1  | action='create_product'              | label='Criar Produto'              | group='products'     | product_type=NULL
//   id=2  | action='edit_product'                | label='Editar Produto'             | group='products'     | product_type=NULL
//   id=3  | action='move_product_between_phases' | label='Mover Produto entre fases'  | group='products'     | product_type=NULL
//   id=4  | action='close_product'               | label='Encerrar Produto'           | group='products'     | product_type=NULL
//   id=5  | action='delete_product'              | label='Excluir Produto'            | group='products'     | product_type=NULL
//   id=6  | action='create_edit_kanban_phases'   | label='Criar/editar fases Kanban'  | group='products'     | product_type=NULL
//   id=7  | action='view_triages'                | label='Visualizar Triagens'        | group='screenings'   | product_type=NULL
//   id=8  | action='move_triage_between_phases'  | label='Mover Triagem entre fases'  | group='screenings'   | product_type=NULL
//   id=9  | action='access_people_tab'           | label='Acessar aba Pessoas'        | group='team'         | product_type=NULL
//   id=10 | action='invite_manage_users'         | label='Convidar/gerenciar usuários'| group='team'         | product_type=NULL
//   id=11 | action='edit_company_settings'       | label='Editar empresa'             | group='organization' | product_type=NULL
//   id=12 | action='launch_sponsored_campaign'   | label='Lançar Patrocinada'         | group='others'       | product_type=NULL
//   id=13 | action='view_metrics'                | label='Ver Métricas'               | group='others'       | product_type=NULL
//
Table permissions {
  id bigint [pk, increment]
  action varchar [not null]              // e.g. 'create_product', 'view_triages'
  label varchar [not null]               // human-readable label for UI
  description varchar
  permission_group permission_group [not null]
  product_type product_type              // NULL = generic; set = scoped to a product type
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (action, product_type) [unique]
  }
}

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

//
// Example rows (recruiter role of Nubank):
//   role_id=2 (recruiter) | permission_id=1  (create_product)              | allowed=true
//   role_id=2 (recruiter) | permission_id=2  (edit_product)                | allowed=true
//   role_id=2 (recruiter) | permission_id=3  (move_product_between_phases) | allowed=true
//   role_id=2 (recruiter) | permission_id=7  (view_triages)                | allowed=true
//   role_id=2 (recruiter) | permission_id=10 (invite_manage_users)         | allowed=false
//   role_id=2 (recruiter) | permission_id=11 (edit_company_settings)       | allowed=false
//   role_id=2 (recruiter) | permission_id=13 (view_metrics)                | allowed=true
//
Table organization_role_permissions {
  role_id bigint [ref: > organization_roles.id, not null]
  permission_id bigint [ref: > permissions.id, not null]
  allowed boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (role_id, permission_id) [pk]
  }
}

// ----------------------------------------------------------------------------
// Members (user × organization × role + lifecycle)
// ----------------------------------------------------------------------------
//
// Example rows (members of Nubank, organization_id=1):
//   id=1 | user_id=10 (Ana Souza)     | role_id=1 (admin)      | status='active'  | invited_by=NULL | accepted_at='2026-01-12'
//   id=2 | user_id=11 (Bruno Lima)    | role_id=2 (recruiter)  | status='active'  | invited_by=10   | accepted_at='2026-02-05'
//   id=3 | user_id=12 (Carla Mendes)  | role_id=3 (sales)      | status='active'  | invited_by=10   | accepted_at='2026-02-18'
//   id=4 | user_id=13 (Daniel Rocha)  | role_id=4 (education)  | status='pending' | invited_by=10   | accepted_at=NULL
//   id=5 | user_id=14 (Erica Tavares) | role_id=7 (viewer)     | status='removed' | removed_at='2026-04-30'
//
Table organization_members {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  user_id bigint [ref: > users.id, not null]
  role_id bigint [ref: > organization_roles.id, not null]
  status organization_member_status [not null, default: 'pending']
  invited_by_user_id bigint [ref: > users.id]
  invited_at timestamptz [not null, default: `now()`]
  accepted_at timestamptz
  removed_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, user_id) [unique]
  }
}

//
// Example rows (pending invitations for Nubank):
//   id=1 | email='novo.recrutador@nubank.com.br' | role_id=2 (recruiter) | invited_by=10 | token='inv_a1b2…' | expires_at='2026-05-26' | accepted_at=NULL
//   id=2 | email='comercial@nubank.com.br'       | role_id=3 (sales)     | invited_by=10 | token='inv_c3d4…' | expires_at='2026-05-26' | accepted_at=NULL
//
Table organization_member_invitations {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  email varchar [not null]
  role_id bigint [ref: > organization_roles.id, not null]
  invited_by_user_id bigint [ref: > users.id, not null]
  token varchar [unique, not null]
  expires_at timestamptz [not null]                  // default +7 days
  accepted_at timestamptz
  cancelled_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, email) [unique]
  }
}

// ----------------------------------------------------------------------------
// Departments (HR, Sales, Education, Comms, Ops, Legal, Marketing…)
// ----------------------------------------------------------------------------
//
// Example rows (Nubank departments, organization_id=1):
//   id=1 | name='RH'           | description='Departamento de recrutamento'  | default_role_id=2 (recruiter)
//   id=2 | name='Comercial'    | description='Departamento de vendas B2B'    | default_role_id=3 (sales)
//   id=3 | name='Universidade' | description='Educação e treinamentos'       | default_role_id=4 (education)
//   id=4 | name='Comunicação'  | description='Comunicação institucional'     | default_role_id=5 (comms)
//   id=5 | name='Eventos'      | description='Experiências e eventos live'   | default_role_id=6 (operations)
//
Table organization_departments {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  name varchar [not null]
  description varchar
  default_role_id bigint [ref: > organization_roles.id]   // optional — new members inherit it
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, name) [unique]
  }
}

//
// Example rows (memberships):
//   department_id=1 (RH)        | member_id=2 (Bruno Lima)    | added_by=10
//   department_id=2 (Comercial) | member_id=3 (Carla Mendes)  | added_by=10
//   department_id=3 (Univ.)     | member_id=4 (Daniel Rocha)  | added_by=10
//
Table organization_department_members {
  department_id bigint [ref: > organization_departments.id, not null]
  member_id bigint [ref: > organization_members.id, not null]
  added_by_user_id bigint [ref: > users.id]
  added_at timestamptz [not null, default: `now()`]

  indexes {
    (department_id, member_id) [pk]
  }
}

// ----------------------------------------------------------------------------
// Audit log (supports the rule "Logs de ações por usuário")
// ----------------------------------------------------------------------------
//
// Example rows (Nubank activity):
//   id=1 | actor_user_id=10 | action='member.invited'           | target_type='invitation' | target_id=1 | metadata={"email":"novo.recrutador@nubank.com.br","role":"recruiter"}
//   id=2 | actor_user_id=10 | action='role.permission.updated'  | target_type='role'       | target_id=2 | metadata={"changed":["create_product:true"]}
//   id=3 | actor_user_id=10 | action='department.member.added'  | target_type='department' | target_id=1 | metadata={"member_id":2}
//   id=4 | actor_user_id=11 | action='member.removed'           | target_type='member'     | target_id=5 | metadata={"reason":"left_company"}
//
Table organization_audit_logs {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  actor_user_id bigint [ref: > users.id]
  action varchar [not null]                  // e.g. 'member.invited', 'role.permission.updated'
  target_type varchar                        // e.g. 'member', 'role', 'department', 'invitation'
  target_id bigint
  metadata jsonb
  created_at timestamptz [not null, default: `now()`]
}

/*
----------------------------------------------------------------------------
Seed reference (not part of DDL — guide for seeders/migrations)
----------------------------------------------------------------------------

Preset roles  (organization_id IS NULL, is_preset = true, is_system = true):
  - admin         Full access
  - recruiter     Manages products of type 'job' and their screenings
  - sales         Manages products of type 'service' and their screenings
  - education     Manages products of type 'training' and their screenings
  - comms         Manages products of type 'news' and their screenings
  - operations    Manages products of type 'experience' and their screenings
  - viewer        Read-only
  - guest         Limited access (single phase)

Permission catalog  (action — group — product_type):
  create_product               products       NULL   (or split per type: job/service/training/news/experience)
  edit_product                 products       NULL
  move_product_between_phases  products       NULL
  close_product                products       NULL
  delete_product               products       NULL
  create_edit_kanban_phases    products       NULL

  view_triages                 screenings     NULL   (can be scoped per type)
  move_triage_between_phases   screenings     NULL

  access_people_tab            team           NULL
  invite_manage_users          team           NULL

  edit_company_settings        organization   NULL

  launch_sponsored_campaign    others         NULL
  view_metrics                 others         NULL
*/
