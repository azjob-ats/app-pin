// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - creator_groups         → creator_groups.sql
//   - organization_creators  → organization_creators.sql
//   - users                  → users.sql
// ----------------------------------------------------------------------------
//
// Junção N:N entre grupos de creators e os creators que pertencem a eles.
//
// Example rows ("Webiner Nubank", creator_group_id=1):
//   creator_group_id=1 | organization_creator_id=1 (Amanda) | added_by_user_id=10
//   creator_group_id=1 | organization_creator_id=2 (Bruno)  | added_by_user_id=10
//
Table creator_group_members {
  creator_group_id bigint [ref: > creator_groups.id, not null]
  organization_creator_id bigint [ref: > organization_creators.id, not null]
  added_by_user_id bigint [ref: > users.id]
  added_at timestamptz [not null, default: `now()`]

  indexes {
    (creator_group_id, organization_creator_id) [pk]
    (organization_creator_id)
  }
}
