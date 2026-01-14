-- Script para insertar citas de prueba para el reporte
DO $$
DECLARE
    v_paciente_id INTEGER;
    v_especialista_id INTEGER;
    v_especialidad_id INTEGER;
BEGIN
    -- Obtener ID del paciente Juan Pérez
    SELECT id INTO v_paciente_id FROM pacientes WHERE cedula = '1001001001' LIMIT 1;
    
    -- Obtener ID de un especialista activo
    SELECT id INTO v_especialista_id FROM especialistas WHERE activo = true LIMIT 1;
    
    -- Obtener ID de una especialidad activa
    SELECT id INTO v_especialidad_id FROM especialidades WHERE activo = true LIMIT 1;
    
    IF v_paciente_id IS NOT NULL AND v_especialista_id IS NOT NULL AND v_especialidad_id IS NOT NULL THEN
        -- Insertar cita 1
        INSERT INTO citas (
            ficha_paciente, id_profesional, id_especialidad, 
            fecha, hora_inicio, hora_fin, 
            estado, fecha_creacion
        ) VALUES (
            v_paciente_id, v_especialista_id, v_especialidad_id,
            '2025-01-10', '09:00:00', '10:00:00',
            'FINALIZADA', NOW()
        );
        
        -- Insertar cita 2
        INSERT INTO citas (
            ficha_paciente, id_profesional, id_especialidad, 
            fecha, hora_inicio, hora_fin, 
            estado, fecha_creacion
        ) VALUES (
            v_paciente_id, v_especialista_id, v_especialidad_id,
            '2025-01-15', '14:00:00', '15:00:00',
            'PENDIENTE', NOW()
        );
        
        -- Insertar cita 3
        INSERT INTO citas (
            ficha_paciente, id_profesional, id_especialidad, 
            fecha, hora_inicio, hora_fin, 
            estado, fecha_creacion
        ) VALUES (
            v_paciente_id, v_especialista_id, v_especialidad_id,
            '2025-01-20', '10:00:00', '11:00:00',
            'PENDIENTE', NOW()
        );
        
        RAISE NOTICE 'Citas insertadas correctamente para el paciente Juan Pérez (cédula: 1001001001)';
    ELSE
        RAISE NOTICE 'No se pudieron insertar las citas. Verifique que existan pacientes, especialistas y especialidades.';
        RAISE NOTICE 'Paciente ID: %, Especialista ID: %, Especialidad ID: %', v_paciente_id, v_especialista_id, v_especialidad_id;
    END IF;
END $$;
