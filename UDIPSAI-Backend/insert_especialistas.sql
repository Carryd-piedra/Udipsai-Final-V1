-- Insertar 4 especialistas con sus permisos
DO $$
DECLARE
    v_permisos_id1 INTEGER;
    v_permisos_id2 INTEGER;
    v_permisos_id3 INTEGER;
    v_permisos_id4 INTEGER;
    v_especialidad_psico_clinica INTEGER;
    v_especialidad_psico_educativa INTEGER;
    v_especialidad_fono INTEGER;
    v_sede_cuenca INTEGER;
BEGIN
    -- Obtener IDs de especialidades y sede
    SELECT id INTO v_especialidad_psico_clinica FROM especialidades WHERE area = 'Psicología Clínica' LIMIT 1;
    SELECT id INTO v_especialidad_psico_educativa FROM especialidades WHERE area = 'Psicología Educativa' LIMIT 1;
    SELECT id INTO v_especialidad_fono FROM especialidades WHERE area = 'Fonoaudiología' LIMIT 1;
    SELECT id INTO v_sede_cuenca FROM sedes WHERE nombre = 'Sede Cuenca' LIMIT 1;

    -- Si no existen especialidades, crearlas
    IF v_especialidad_psico_clinica IS NULL THEN
        INSERT INTO especialidades (area, activo) VALUES ('Psicología Clínica', true) RETURNING id INTO v_especialidad_psico_clinica;
    END IF;
    
    IF v_especialidad_psico_educativa IS NULL THEN
        INSERT INTO especialidades (area, activo) VALUES ('Psicología Educativa', true) RETURNING id INTO v_especialidad_psico_educativa;
    END IF;
    
    IF v_especialidad_fono IS NULL THEN
        INSERT INTO especialidades (area, activo) VALUES ('Fonoaudiología', true) RETURNING id INTO v_especialidad_fono;
    END IF;

    -- ====================================
    -- ESPECIALISTA 1: Dra. María González - Psicología Clínica
    -- ====================================
    IF NOT EXISTS (SELECT 1 FROM especialistas WHERE cedula = '0102030405') THEN
        -- Crear permisos
        INSERT INTO permisos (
            pacientes, pasantes, sedes, especialistas, especialidades,
            asignaciones, recursos, instituciones_educativas,
            historia_clinica, fonoaudiologia, psicologia_clinica, psicologia_educativa
        ) VALUES (
            true, false, false, false, false,
            false, true, false,
            true, false, true, false
        ) RETURNING id INTO v_permisos_id1;

        -- Crear especialista
        INSERT INTO especialistas (
            cedula, nombres_apellidos, contrasenia, activo, 
            especialidad_id, sede_id, permisos_id
        ) VALUES (
            '0102030405',
            'Dra. María González',
            '$2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2', -- admin123
            true,
            v_especialidad_psico_clinica,
            v_sede_cuenca,
            v_permisos_id1
        );
        RAISE NOTICE 'Especialista 1 creado: Dra. María González (Psicología Clínica)';
    END IF;

    -- ====================================
    -- ESPECIALISTA 2: Dr. Carlos Mendoza - Psicología Educativa
    -- ====================================
    IF NOT EXISTS (SELECT 1 FROM especialistas WHERE cedula = '0203040506') THEN
        INSERT INTO permisos (
            pacientes, pasantes, sedes, especialistas, especialidades,
            asignaciones, recursos, instituciones_educativas,
            historia_clinica, fonoaudiologia, psicologia_clinica, psicologia_educativa
        ) VALUES (
            true, false, false, false, false,
            false, true, true,
            true, false, false, true
        ) RETURNING id INTO v_permisos_id2;

        INSERT INTO especialistas (
            cedula, nombres_apellidos, contrasenia, activo,
            especialidad_id, sede_id, permisos_id
        ) VALUES (
            '0203040506',
            'Dr. Carlos Mendoza',
            '$2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2',
            true,
            v_especialidad_psico_educativa,
            v_sede_cuenca,
            v_permisos_id2
        );
        RAISE NOTICE 'Especialista 2 creado: Dr. Carlos Mendoza (Psicología Educativa)';
    END IF;

    -- ====================================
    -- ESPECIALISTA 3: Lcda. Ana Rodríguez - Fonoaudiología
    -- ====================================
    IF NOT EXISTS (SELECT 1 FROM especialistas WHERE cedula = '0304050607') THEN
        INSERT INTO permisos (
            pacientes, pasantes, sedes, especialistas, especialidades,
            asignaciones, recursos, instituciones_educativas,
            historia_clinica, fonoaudiologia, psicologia_clinica, psicologia_educativa
        ) VALUES (
            true, false, false, false, false,
            false, true, false,
            true, true, false, false
        ) RETURNING id INTO v_permisos_id3;

        INSERT INTO especialistas (
            cedula, nombres_apellidos, contrasenia, activo,
            especialidad_id, sede_id, permisos_id
        ) VALUES (
            '0304050607',
            'Lcda. Ana Rodríguez',
            '$2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2',
            true,
            v_especialidad_fono,
            v_sede_cuenca,
            v_permisos_id3
        );
        RAISE NOTICE 'Especialista 3 creado: Lcda. Ana Rodríguez (Fonoaudiología)';
    END IF;

    -- ====================================
    -- ESPECIALISTA 4: Dr. Luis Morales - Psicología Clínica
    -- ====================================
    IF NOT EXISTS (SELECT 1 FROM especialistas WHERE cedula = '0405060708') THEN
        INSERT INTO permisos (
            pacientes, pasantes, sedes, especialistas, especialidades,
            asignaciones, recursos, instituciones_educativas,
            historia_clinica, fonoaudiologia, psicologia_clinica, psicologia_educativa
        ) VALUES (
            true, false, false, false, false,
            false, true, false,
            true, false, true, false
        ) RETURNING id INTO v_permisos_id4;

        INSERT INTO especialistas (
            cedula, nombres_apellidos, contrasenia, activo,
            especialidad_id, sede_id, permisos_id
        ) VALUES (
            '0405060708',
            'Dr. Luis Morales',
            '$2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2',
            true,
            v_especialidad_psico_clinica,
            v_sede_cuenca,
            v_permisos_id4
        );
        RAISE NOTICE 'Especialista 4 creado: Dr. Luis Morales (Psicología Clínica)';
    END IF;

    RAISE NOTICE '===========================================';
    RAISE NOTICE 'ESPECIALISTAS CREADOS EXITOSAMENTE';
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Todos usan contraseña: admin123';
    RAISE NOTICE '1. Dra. María González - Cédula: 0102030405';
    RAISE NOTICE '2. Dr. Carlos Mendoza - Cédula: 0203040506';
    RAISE NOTICE '3. Lcda. Ana Rodríguez - Cédula: 0304050607';
    RAISE NOTICE '4. Dr. Luis Morales - Cédula: 0405060708';
    RAISE NOTICE '===========================================';
END $$;
