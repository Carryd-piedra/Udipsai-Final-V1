package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Alimentacion {

    @Column(name = "tomo_seno")
    private Boolean tomoSeno;

    @Column(name = "edad_destete_tomo_seno")
    private Integer edadDesteteTomoSeno;

    @Column(name = "tomo_biberon")
    private Boolean tomoBiberon;

    @Column(name = "edad_destete_tomo_biberon")
    private Integer edadDesteteTomoBiberon;

    @Column(name = "edad_inicio_comida_solida")
    private Integer edadInicioComidaSolida;

    @Column(name = "habitos_alimenticios_actuales")
    private String habitosAlimenticiosActuales;

    @Column(name = "edad_dejo_panial")
    private Integer edadDejoPanial;

    @Column(name = "edad_control_esfinferes_diurno")
    private Integer edadControlEsfinferesDiurno;

    @Column(name = "edad_control_esfinferes_nocturno")
    private Integer edadControlEsfinferesNocturno;

    @Column(name = "se_viste_solo")
    private Boolean seVisteSolo;

    @Column(name = "se_lanza_solo")
    private Boolean seLanzaSolo;
}
