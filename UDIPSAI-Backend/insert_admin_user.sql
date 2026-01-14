-- Script para crear usuario ADMINISTRADOR con todos los permisos
-- Ejecutar este script en la base de datos PostgreSQL

-- =====================================================
-- IMPORTANTE: Este script crea un usuario admin
-- Usuario: 0101010101
-- Contraseña: admin123
-- =====================================================

-- Primero, verificar si el usuario admin ya existe
-- Si existe, lo eliminamos para recrearlo (esto también eliminará el registro de permisos por CASCADE)
DELETE FROM especialistas WHERE cedula = '0101010101';

-- =====================================================
-- PASO 1: Insertar permisos (todos habilitados)
-- =====================================================
INSERT INTO permisos (
    pacientes,
    pasantes,
    sedes,
    especialistas,
    especialidades,
    asignaciones,
    recursos,
    instituciones_educativas,
    historia_clinica,
    fonoaudiologia,
    psicologia_clinica,
    psicologia_educativa
) VALUES (
    true,  -- pacientes
    true,  -- pasantes
    true,  -- sedes
    true,  -- especialistas
    true,  -- especialidades
    true,  -- asignaciones
    true,  -- recursos
    true,  -- instituciones_educativas
    true,  -- historia_clinica
    true,  -- fonoaudiologia
    true,  -- psicologia_clinica
    true   -- psicologia_educativa
);

-- =====================================================
-- PASO 2: Insertar especialista con referencia a permisos
-- =====================================================
-- Hash BCrypt de "admin123": $2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2
INSERT INTO especialistas (
    cedula,
    nombres_apellidos,
    contrasenia,
    activo,
    permisos_id
) VALUES (
    '0101010101',
    'Administrador del Sistema',
    '$2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2',
    true,
    (SELECT MAX(id) FROM permisos)  -- Obtiene el ID del permiso recién insertado
);

-- =====================================================
-- VERIFICACIÓN: Mostrar usuario y permisos creados
-- =====================================================
SELECT 
    e.id as especialista_id,
    e.cedula,
    e.nombres_apellidos,
    e.activo,
    p.id as permisos_id,
    p.pacientes,
    p.pasantes,
    p.sedes,
    p.especialistas,
    p.especialidades,
    p.asignaciones,
    p.recursos,
    p.instituciones_educativas,
    p.historia_clinica,
    p.fonoaudiologia,
    p.psicologia_clinica,
    p.psicologia_educativa
FROM especialistas e 
LEFT JOIN permisos p ON e.permisos_id = p.id 
WHERE e.cedula = '0101010101';

-- Información de acceso
SELECT '=====================================' as info
UNION ALL SELECT 'USUARIO ADMINISTRADOR CREADO' as info
UNION ALL SELECT '=====================================' as info
UNION ALL SELECT 'Cédula: 0101010101' as info
UNION ALL SELECT 'Contraseña: admin123' as info
UNION ALL SELECT '=====================================' as info;
