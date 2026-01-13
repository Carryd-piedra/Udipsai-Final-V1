package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class AntecedentesMedicos {

    @Column(name = "alergias", columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "enfermedades_virales", columnDefinition = "TEXT")
    private String enfermedadesVirales;

    @Column(name = "hospitalizaciones_quirurgicas_y_causas", columnDefinition = "TEXT")
    private String hospitalizacionesQuirurgicasYCausas;

    @Column(name = "accidentes_y_secuelas", columnDefinition = "TEXT")
    private String accidentesYSecuelas;

    @Column(name = "toma_medicacion_actualmente", columnDefinition = "TEXT")
    private String tomaMedicacionActualmente;

    @Column(name = "examenes_complementarios_realizados", columnDefinition = "TEXT")
    private String examenesComplementariosRealizados;

    @Column(name = "antecedentes_patologicos_familiares", columnDefinition = "TEXT")
    private String antecedentesPatologicosFamiliares;

    @Column(name = "vacunacion_c", columnDefinition = "TEXT")
    private String vacunacionC;
}

