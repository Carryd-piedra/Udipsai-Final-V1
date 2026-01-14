package com.ucacue.udipsai.modules.asignacion.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AsignacionDTO {
    private Long id;
    private PacienteDTO paciente;
    private PasanteDTO pasante;
    private Boolean activo;
}
