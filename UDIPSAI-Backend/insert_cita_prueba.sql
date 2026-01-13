-- Insertar una cita de prueba para HOY
DO $$
DECLARE
    v_paciente_id INTEGER;
    v_especialista_id INTEGER;
    v_especialidad_id INTEGER;
    v_fecha DATE := CURRENT_DATE;
    v_hora TIME := '10:00:00';
BEGIN
    -- Obtener IDs (asumiendo que existen por los inserts anteriores)
    -- Paciente: Juan Perez (0101010101)
    SELECT id INTO v_paciente_id FROM pacientes WHERE cedula = '0101010101' LIMIT 1;
    
    -- Especialista: Super Admin (0999999999) - O el que estés usando para loguearte
    -- Si te logueaste como Director (0100000001), cambia la cedula aquí.
    -- Vamos a intentar asignar al Super Admin primero.
    SELECT id INTO v_especialista_id FROM especialistas WHERE cedula = '0999999999' LIMIT 1;
    
    -- Especialidad: Psicología Clínica
    SELECT id INTO v_especialidad_id FROM especialidades WHERE area = 'Psicología Clínica' LIMIT 1;

    IF v_paciente_id IS NOT NULL AND v_especialista_id IS NOT NULL THEN
        
        IF NOT EXISTS (SELECT 1 FROM citas WHERE ficha_paciente = v_paciente_id AND fecha = v_fecha AND hora_inicio = v_hora) THEN
            INSERT INTO citas (
                fecha, hora_inicio, hora_fin, estado, 
                ficha_paciente, profesional_id, especialidad_id, 
                fecha_creacion_cita, fecha_modificacion_cita
            ) VALUES (
                v_fecha, 
                v_hora, 
                v_hora + interval '1 hour', 
                'PENDIENTE', 
                v_paciente_id, 
                v_especialista_id, 
                v_especialidad_id,
                NOW(),
                NOW()
            );
            RAISE NOTICE 'Cita de prueba insertada para hoy a las 10:00 AM';
        ELSE
            RAISE NOTICE 'Ya existe una cita para este paciente a esa hora.';
        END IF;

    ELSE
        RAISE NOTICE 'No se pudo insertar la cita: Faltan datos (Paciente o Especialista no encontrados).';
    END IF;
END $$;
