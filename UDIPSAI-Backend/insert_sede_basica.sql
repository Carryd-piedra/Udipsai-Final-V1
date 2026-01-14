-- Crear sedes por defecto si no existen

-- Sede Cuenca
INSERT INTO sedes (nombre, activo)
SELECT 'Sede Cuenca', true
WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE nombre = 'Sede Cuenca');

-- Sede Azogues
INSERT INTO sedes (nombre, activo)
SELECT 'Sede Azogues', true
WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE nombre = 'Sede Azogues');

-- Verificar
SELECT * FROM sedes;
