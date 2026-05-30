// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations      → organizations.sql
//   - organization_roles → organization_roles.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Departments (HR, Sales, Education, Comms, Ops, Legal, Marketing…)
// ----------------------------------------------------------------------------
//
// Selecionar um departamento é o passo intermediário entre escolher a
// organização e abrir o painel/kanban: /empresa/:slug/:deptSlug/produtos.
// Cada departamento escopa produtos, triagens e equipe da organização.
//
// Example rows (Nubank departments, organization_id=1):
//   id=1 | slug='engenharia' | name='Engenharia'        | icon='code'         | color='#2563eb' | default_role_id=2
//   id=2 | slug='marketing'  | name='Marketing'         | icon='campaign'     | color='#f59e0b' | default_role_id=5
//   id=3 | slug='produto'    | name='Produto'           | icon='inventory_2'  | color='#a855f7' | default_role_id=3
//   id=4 | slug='pessoas'    | name='Pessoas & Cultura' | icon='groups'       | color='#10b981' | default_role_id=2
//
Table organization_departments {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  slug varchar [not null]                                 // URL segment (e.g. 'engenharia' → /empresa/nubank/engenharia)
  name varchar [not null]
  description varchar
  icon varchar                                            // material symbol shown on the department card (e.g. 'code')
  color varchar                                           // accent hex color for the card (e.g. '#2563eb')
  default_role_id bigint [ref: > organization_roles.id]   // optional — new members inherit it
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, slug) [unique]
    (organization_id, name) [unique]
  }
}
