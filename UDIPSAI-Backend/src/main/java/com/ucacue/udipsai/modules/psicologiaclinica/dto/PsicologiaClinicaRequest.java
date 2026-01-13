package com.ucacue.udipsai.modules.psicologiaclinica.dto;

import com.ucacue.udipsai.modules.psicologiaclinica.domain.components.*;
import lombok.Data;

@Data
public class PsicologiaClinicaRequest {
    private Integer pacienteId;
    private Boolean activo;
    private Anamnesis anamnesis;
    private Suenio suenio;
    private Conducta conducta;
    private Sexualidad sexualidad;
    private EvaluacionLenguaje evaluacionLenguaje;
    private EvaluacionAfectiva evaluacionAfectiva;
    private EvaluacionCognitiva evaluacionCognitiva;
    private EvaluacionPensamiento evaluacionPensamiento;
    private Diagnostico diagnostico;
}
