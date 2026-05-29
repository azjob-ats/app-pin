// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products       → products.sql
//   - creator_groups → creator_groups.sql
//   - users          → users.sql
// ----------------------------------------------------------------------------
//
// Grupos de creators habilitados a vender um produto. Todos os creators
// dos grupos referenciados ficam habilitados.
// Relevante apenas quando products.pitch_eligibility_mode = 'groups'.
//
// Example rows (Vaga Eng. Sr., product_id=1 libera o grupo "Webiner Nubank"):
//   product_id=1 | creator_group_id=1 | added_by_user_id=10
//
Table product_eligible_groups {
  product_id bigint [ref: > products.id, not null]
  creator_group_id bigint [ref: > creator_groups.id, not null]
  added_by_user_id bigint [ref: > users.id]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (product_id, creator_group_id) [pk]
    (creator_group_id)
  }
}
