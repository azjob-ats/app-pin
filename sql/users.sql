Enum user_status {
  active
  suspended
  banned
  deleted
}

Table users {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  username varchar [unique, not null]
  email varchar [unique, not null]
  status user_status [not null, default: 'active']
  last_login_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
