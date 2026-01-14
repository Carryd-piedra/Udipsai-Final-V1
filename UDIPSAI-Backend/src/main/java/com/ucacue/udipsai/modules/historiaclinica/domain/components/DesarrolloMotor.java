package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class DesarrolloMotor {

    @Column(name = "sostuvo_la_cabeza")
    private Integer sostuvoLaCabeza;

    @Column(name = "se_sento_solo")
    private Integer seSentoSolo;

    @Column(name = "se_paro_solo")
    private Integer seParoSolo;

    @Column(name = "camino_solo")
    private Integer caminoSolo;

    @Column(name = "inicio_gateo")
    private Integer inicioGateo;

    @Column(name = "tipo_gateo")
    private String tipoGateo;

    @Column(name = "edades_sonrisa_social")
    private Integer edadesSonrisaSocial;

    @Column(name = "edades_balbuceo")
    private Integer edadesBalbuceo;

    @Column(name = "edades_primeras_frases")
    private Integer edadesPrimerasFrases;
}
