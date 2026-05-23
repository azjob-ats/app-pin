// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
//   - users         → users.sql
//   - product_type (enum) → products.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Organization product phases (colunas customizadas do Kanban de Products)
define as colunas do Kanban (nome, cor, ordem). Os produtos referenciam sua fase via FK em products.sql
// ----------------------------------------------------------------------------
//
// Fonte de verdade das fases customizadas exibidas pelo componente
// `app-kanban-board` (src/app/domain/empresa/components/kanban-board).
//
// Mapeamento 1:1 com a interface KanbanColumn do front:
//   slug         → KanbanColumn.id
//   label        → KanbanColumn.label
//   color        → KanbanColumn.color
//   description  → KanbanColumn.description
//   can_create   → KanbanColumn.canCreate
//
// Substitui o blob `organizations.custom_phases jsonb` (não normalizado) e
// passa a ser o alvo da FK `products.custom_phase_id`.
//
// `product_type` permite que a mesma org configure fases distintas por tipo
// de produto (ex.: backlog/em campanha/pausa só para 'job'). NULL = vale
// para todos os tipos.
//
// `is_system=true` é reservado para fases seedadas pela plataforma (ex.:
// "Backlog", "Em campanha", "Pausa") — protegidas contra edição/deleção.
//
// Example rows (Nubank, organization_id=1):
//   id=1 | organization_id=1 | product_type=NULL    | slug='backlog'      | label='Backlog'      | color='#9ca3af' | display_order=0 | is_system=true
//   id=2 | organization_id=1 | product_type=NULL    | slug='em_campanha'  | label='Em campanha'  | color='#22c55e' | display_order=1 | is_system=true
//   id=3 | organization_id=1 | product_type=NULL    | slug='pausa'        | label='Pausa'        | color='#facc15' | display_order=2 | is_system=true
//   id=4 | organization_id=1 | product_type='job'   | slug='em_revisao'   | label='Em revisão'   | color='#f97316' | display_order=3 | is_system=false | created_by_user_id=10
//
Table product_phases {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  product_type product_type                              // NULL = aplica a todos os tipos; set = restrito ao tipo ('job', 'service', …)
  slug varchar [not null]                                // identificador estável (vira KanbanColumn.id no front)
  label varchar [not null]                               // texto exibido na coluna do Kanban
  color varchar [not null]                               // cor da coluna (#hex)
  description varchar                                    // texto auxiliar exibido no header da coluna
  can_create boolean [not null, default: true]           // true = mostra o botão "+ criar nesta fase"
  display_order integer [not null, default: 0]           // ordem das colunas no board
  is_system boolean [not null, default: false]           // true = fase seedada pela plataforma (protegida)
  created_by_user_id bigint [ref: > users.id]            // NULL para fases system
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, product_type, slug) [unique]
    (organization_id, product_type, display_order)
  }
}
