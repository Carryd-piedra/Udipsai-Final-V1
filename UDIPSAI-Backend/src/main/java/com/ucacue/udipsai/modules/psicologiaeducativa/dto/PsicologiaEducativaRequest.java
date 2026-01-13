package com.ucacue.udipsai.modules.psicologiaeducativa.dto;

import com.ucacue.udipsai.modules.psicologiaeducativa.domain.components.*;
import lombok.Data;

@Data
public class PsicologiaEducativaRequest {
    private Integer pacienteId;
    private Boolean activo;
    private HistoriaEscolar historiaEscolar;
    private Desarrollo desarrollo;
    private Adaptacion adaptacion;
    private EstadoGeneral estadoGeneral;
}
