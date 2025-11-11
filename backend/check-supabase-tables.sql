-- Script para verificar qué tablas tienes en Supabase
-- Ejecuta esto primero para ver qué estructura tienes

-- Verificar tablas existentes
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar tipos ENUM existentes
SELECT 
  typname as enum_name,
  array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE typname IN ('role_type', 'status_type', 'priority_type', 'Role', 'Status', 'Priority')
GROUP BY typname
ORDER BY typname;

