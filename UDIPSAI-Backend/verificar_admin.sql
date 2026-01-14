-- Verificar el hash de contraseña almacenado para el usuario admin
SELECT 
    e.id,
    e.cedula,
    e.nombres_apellidos,
    e.contrasenia as hash_almacenado,
    LENGTH(e.contrasenia) as longitud_hash,
    e.activo,
    e.permisos_id
FROM especialistas e 
WHERE e.cedula = '0101010101';

-- Ver los permisos asociados
SELECT p.* 
FROM permisos p
JOIN especialistas e ON e.permisos_id = p.id
WHERE e.cedula = '0101010101';
