package com.ucacue.udipsai.modules.asignacion.dto;

import lombok.Data;

@Data
public class AsignacionRequest {
    private Integer pacienteId;
    private Integer pasanteId;
    private Boolean activo;
}
