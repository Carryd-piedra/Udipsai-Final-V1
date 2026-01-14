-- Script para crear la vista vista_citas_completa
CREATE OR REPLACE VIEW vista_citas_completa AS
SELECT 
    c.id_cita,
    c.ficha_paciente,
    c.id_profesional,
    c.id_especialidad AS id_area,
    esp.area AS nombre_area,
    c.fecha,
    c.hora_inicio AS horainicio,
    c.hora_fin AS horafin,
    c.estado AS estado_cita,
    c.fecha_creacion AS fecha_creacion_cita,
    c.fecha_modificacion AS fecha_modificacion_cita,
    esp.area AS especialidad,
    CASE WHEN e.activo = true THEN 'ACTIVO' ELSE 'INACTIVO' END AS estado_profesional,
    COALESCE(SPLIT_PART(e.nombres_apellidos, ' ', 2), '') AS apellidos,
    p.cedula,
    p.numero_celular AS celular,
    '' AS email,
    CASE WHEN p.activo = true THEN 'ACTIVO' ELSE 'INACTIVO' END AS estado_usuario,
    COALESCE(SPLIT_PART(e.nombres_apellidos, ' ', 1), e.nombres_apellidos) AS nombres
FROM 
    citas c
INNER JOIN pacientes p ON c.ficha_paciente = p.id
INNER JOIN especialistas e ON c.id_profesional = e.id
LEFT JOIN especialidades esp ON c.id_especialidad = esp.id;