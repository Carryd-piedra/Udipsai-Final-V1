package com.ucacue.udipsai.modules.historiaclinica.dto;

import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;
import lombok.Data;

@Data
public class HistoriaClinicaRequest {
    private Integer pacienteId;
    private Boolean activo;
    private DatosFamiliares datosFamiliares;
    private HistoriaPrenatal historiaPrenatal;
    private HistoriaNatal historiaNatal;
    private HistoriaPostnatal historiaPostnatal;
    private DesarrolloMotor desarrolloMotor;
    private Alimentacion alimentacion;
    private AntecedentesMedicos antecedentesMedicos;
}
