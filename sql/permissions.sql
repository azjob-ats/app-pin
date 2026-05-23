// ----------------------------------------------------------------------------
// External enums referenced by this file:
//   - product_type → products.sql
// ----------------------------------------------------------------------------
//
// Canonical permission catalog. Sempre que for criada uma nova feature,
// adicione uma flag de permissão aqui.
//
// Products:
//     create_product
//     edit_product
//     move_product_between_phases
//     close_product
//     delete_product
//     create_edit_kanban_phases
//
// Screenings:
//     view_triages
//     move_triage_between_phases
//
// Team:
//     access_people_tab
//     invite_manage_users
//
// Organization:
//     edit_company_settings
//
// Others:
//     launch_sponsored_campaign
//     view_metrics
//
// ----------------------------------------------------------------------------

Enum permission_group {
  products
  screenings
  team
  organization
  others
}

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
