select
  table_schema,
  table_name,
  column_name,
  column_default,
  is_nullable::boolean,
  data_type,
  udt_schema,
  udt_name,
  col_description((table_schema || '.' || table_name)::regclass, ordinal_position)
from information_schema.columns
where table_schema = $1
order by table_schema, table_name, ordinal_position
