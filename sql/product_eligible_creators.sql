// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products               → products.sql
//   - organization_creators  → organization_creators.sql
//   - users                  → users.sql
// ----------------------------------------------------------------------------
//
// Creators específicos habilitados a vender um produto.
// Relevante apenas quando products.pitch_eligibility_mode = 'creators'.
//
// Example rows (Workshop Signals, product_id=2 libera 2 creators):
//   product_id=2 | organization_creator_id=1 (Amanda) | added_by_user_id=10
//   product_id=2 | organization_creator_id=2 (Bruno)  | added_by_user_id=10
//
Table product_eligible_creators {
  product_id bigint [ref: > products.id, not null]
  organization_creator_id bigint [ref: > organization_creators.id, not null]
  added_by_user_id bigint [ref: > users.id]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (product_id, organization_creator_id) [pk]
    (organization_creator_id)
  }
}
