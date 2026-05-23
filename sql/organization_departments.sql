// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations      → organizations.sql
//   - organization_roles → organization_roles.sql
// ----------------------------------------------------------------------------

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
