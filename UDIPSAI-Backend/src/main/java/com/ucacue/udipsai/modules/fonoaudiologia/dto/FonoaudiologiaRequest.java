package com.ucacue.udipsai.modules.fonoaudiologia.dto;

import com.ucacue.udipsai.modules.fonoaudiologia.domain.components.*;
import lombok.Data;

@Data
public class FonoaudiologiaRequest {
    private Integer pacienteId;
    private Boolean activo;
    private Habla habla;
    private Audicion audicion;
    private Fonacion fonacion;
    private HistoriaAuditiva historiaAuditiva;
    private Vestibular vestibular;
    private Otoscopia otoscopia;
}
