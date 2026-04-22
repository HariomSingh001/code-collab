// Session schema is now managed by Supabase PostgreSQL
// See src/lib/schema.sql for the table definition
//
// Table: sessions
// Columns: id (UUID), problem (TEXT), difficulty (TEXT), host_id (UUID FK),
//          participant_id (UUID FK), status (TEXT), call_id (TEXT),
//          created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)

