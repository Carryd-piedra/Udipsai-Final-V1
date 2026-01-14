package com.ucacue.udipsai.modules.historiaclinica.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;
import lombok.Data;

@Data
public class HistoriaClinicaDTO {
    private Integer id;
    private PacienteDTO paciente;
    private Boolean activo;
    private String genogramaUrl;
    
    private DatosFamiliares datosFamiliares;
    private HistoriaPrenatal historiaPrenatal;
    private HistoriaNatal historiaNatal;
    private HistoriaPostnatal historiaPostnatal;
    private DesarrolloMotor desarrolloMotor;
    private Alimentacion alimentacion;
    private AntecedentesMedicos antecedentesMedicos;
}
