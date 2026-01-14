package com.ucacue.udipsai.modules.psicologiaeducativa.domain.components;

import com.ucacue.udipsai.modules.psicologiaeducativa.domain.PsicologiaEducativa.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data; 

@Embeddable
@Data
public class EstadoGeneral {

    @Enumerated(EnumType.STRING)
    @Column(name = "aprovechamiento_general")
    private AprovechamientoGeneral aprovechamientoGeneral;

    @Column(name = "actividad_escolar", columnDefinition = "TEXT")
    private String actividadEscolar;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}
