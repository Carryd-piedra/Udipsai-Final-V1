package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class HistoriaPrenatal {

    @Column(name = "embarazo_numero")
    private Integer embarazoNumero;

    @Column(name = "controles_eco")
    private Boolean controlesEco;

    @Column(name = "hijos_vivos")
    private Integer hijosVivos;

    @Column(name = "seg_semestre_aborto")
    private Boolean segSemestreAborto;

    @Column(name = "seg_semestre_amenaza")
    private Boolean segSemestreAmenaza;

    @Column(name = "alimentacion")
    private Boolean alimentacion;

    @Column(name = "ingesta_medicamentos")
    private Boolean ingestaMedicamentos;
}
