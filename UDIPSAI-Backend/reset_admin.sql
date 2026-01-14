-- ADVERTENCIA: Este script borrará TODOS los especialistas
-- Solo ejecutar si estás seguro de que no hay datos importantes

-- Paso 1: Borrar todos los especialistas primero
DELETE FROM especialistas;

-- Paso 2: Borrar todos los permisos (ahora que no hay referencias)
DELETE FROM permisos;

-- Paso 3: Reiniciar las secuencias para que el próximo ID sea 1
ALTER SEQUENCE especialistas_id_seq RESTART WITH 1;
ALTER SEQUENCE permisos_id_seq RESTART WITH 1;

-- Verificar que las tablas estén vacías
SELECT COUNT(*) as total_especialistas FROM especialistas;
SELECT COUNT(*) as total_permisos FROM permisos;

-- =========================================================================
-- IMPORTANTE: Después de ejecutar este script:
-- 1. Reinicia el backend (mvn spring-boot:run)
-- 2. El DataSeeder creará automáticamente el usuario admin
-- 3. Credenciales: 0101010101 / admin123
-- =========================================================================
