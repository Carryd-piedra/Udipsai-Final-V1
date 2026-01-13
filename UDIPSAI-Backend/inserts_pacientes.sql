-- Insertar Pacientes
DO $$
DECLARE
    v_sede_id INTEGER;
    v_inst_id INTEGER;
BEGIN
    -- Obtener ID de sede principal
    SELECT id INTO v_sede_id FROM sedes WHERE nombre = 'Sede Principal' LIMIT 1;
    
    -- Crear una institución educativa por defecto si no existe
    IF NOT EXISTS (SELECT 1 FROM instituciones_educativas WHERE nombre = 'Institución Default') THEN
        INSERT INTO instituciones_educativas (nombre, activo, direccion, tipo)
        VALUES ('Institución Default', true, 'Centro', 'Fiscal')
        RETURNING id INTO v_inst_id;
    ELSE
        SELECT id INTO v_inst_id FROM instituciones_educativas WHERE nombre = 'Institución Default' LIMIT 1;
    END IF;

    -- Insertar paciente 1
    IF NOT EXISTS (SELECT 1 FROM pacientes WHERE cedula = '0101010101') THEN
        INSERT INTO pacientes (
            cedula, nombres_apellidos, ciudad, fecha_nacimiento, domicilio, 
            foto_url, numero_telefono, numero_celular, 
            sede_id, institucion_educativa_id, 
            fecha_apertura, activo, anio_educacion, jornada, diagnostico, motivo_consulta, nivel_educativo
        ) VALUES (
            '0101010101', 'Juan Pérez', 'Cuenca', '2015-05-10', 'Av. Loja y Don Bosco',
            'https://ui-avatars.com/api/?name=Juan+Perez', '072888888', '0999999991',
            v_sede_id, v_inst_id,
            NOW(), true, '5to EGB', 'MATUTINA', 'TDAH LEVE', 'Problemas de atención', 'Primaria'
        );
    END IF;

    -- Insertar paciente 2
    IF NOT EXISTS (SELECT 1 FROM pacientes WHERE cedula = '0202020202') THEN
        INSERT INTO pacientes (
            cedula, nombres_apellidos, ciudad, fecha_nacimiento, domicilio, 
            foto_url, numero_telefono, numero_celular, 
            sede_id, institucion_educativa_id, 
            fecha_apertura, activo, anio_educacion, jornada, diagnostico, motivo_consulta, nivel_educativo
        ) VALUES (
            '0202020202', 'Maria Lopez', 'Cuenca', '2012-08-20', 'Centro Histórico',
            'https://ui-avatars.com/api/?name=Maria+Lopez', '072777777', '0999999992',
            v_sede_id, v_inst_id,
            NOW(), true, '8vo EGB', 'VESPERTINA', 'Ansiedad Generalizada', 'Dificultad para socializar', 'Secundaria'
        );
    END IF;

    -- Insertar paciente 3
    IF NOT EXISTS (SELECT 1 FROM pacientes WHERE cedula = '0303030303') THEN
        INSERT INTO pacientes (
            cedula, nombres_apellidos, ciudad, fecha_nacimiento, domicilio, 
            foto_url, numero_telefono, numero_celular, 
            sede_id, institucion_educativa_id, 
            fecha_apertura, activo, anio_educacion, jornada, diagnostico, motivo_consulta, nivel_educativo
        ) VALUES (
            '0303030303', 'Carlos Gomez', 'Azogues', '2010-01-15', 'Terminal Terrestre',
            'https://ui-avatars.com/api/?name=Carlos+Gomez', '072666666', '0999999993',
            v_sede_id, v_inst_id,
            NOW(), true, '1ro Bachillerato', 'MATUTINA', 'Ninguno', 'Evaluación Psicológica', 'Secundaria'
        );
    END IF;

    -- Insertar paciente 4 (Con discapacidad)
    IF NOT EXISTS (SELECT 1 FROM pacientes WHERE cedula = '0404040404') THEN
        INSERT INTO pacientes (
            cedula, nombres_apellidos, ciudad, fecha_nacimiento, domicilio, 
            foto_url, numero_telefono, numero_celular, 
            sede_id, institucion_educativa_id, 
            fecha_apertura, activo, anio_educacion, jornada, diagnostico, motivo_consulta, nivel_educativo,
            tiene_discapacidad, portador_carnet, tipo_discapacidad, porcentaje_discapacidad, detalle_discapacidad
        ) VALUES (
            '0404040404', 'Ana Torres', 'Cuenca', '2018-03-30', 'El Vecino',
            'https://ui-avatars.com/api/?name=Ana+Torres', '072555555', '0999999994',
            v_sede_id, v_inst_id,
            NOW(), true, '2do EGB', 'MATUTINA', 'Retraso en el desarrollo', 'Terapia de lenguaje', 'Primaria',
            true, true, 'Intelectual', 40, 'Discapacidad intelectual leve'
        );
    END IF;

     -- Insertar paciente 5 (Inclusión)
    IF NOT EXISTS (SELECT 1 FROM pacientes WHERE cedula = '0505050505') THEN
        INSERT INTO pacientes (
            cedula, nombres_apellidos, ciudad, fecha_nacimiento, domicilio, 
            foto_url, numero_telefono, numero_celular, 
            sede_id, institucion_educativa_id, 
            fecha_apertura, activo, anio_educacion, jornada, diagnostico, motivo_consulta, nivel_educativo,
            pertenece_inclusion, proyecto
        ) VALUES (
            '0505050505', 'Pedro Sanchez', 'Cuenca', '2014-11-05', 'Totoracocha',
            'https://ui-avatars.com/api/?name=Pedro+Sanchez', '072444444', '0999999995',
            v_sede_id, v_inst_id,
            NOW(), true, '6to EGB', 'MATUTINA', 'Autismo', 'Seguimiento escolar', 'Primaria',
            true, 'Proyecto de Inclusión Educativa'
        );
    END IF;

    RAISE NOTICE 'Pacientes insertados correctamente.';
END $$;
