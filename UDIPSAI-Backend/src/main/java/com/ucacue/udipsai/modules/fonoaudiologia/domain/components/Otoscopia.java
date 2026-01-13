package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import com.ucacue.udipsai.modules.fonoaudiologia.domain.Fonoaudiologia.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Embeddable
@Data
public class Otoscopia {

    // Oído Derecho
    @Enumerated(EnumType.STRING)
    @Column(name = "palpacion_pabellon_oido_derecho")
    private PalpacionOido palpacionPabellonOidoDerecho;

    @Enumerated(EnumType.STRING)
    @Column(name = "palpacion_mastoides_oido_derecho")
    private PalpacionOido palpacionMastoidesOidoDerecho;

    @Enumerated(EnumType.STRING)
    @Column(name = "cae_oido_derecho")
    private CAEOido caeOidoDerecho;

    @Enumerated(EnumType.STRING)
    @Column(name = "obstruccion_oido_derecho")
    private ObstruccionOido obstruccionOidoDerecho;

    @Enumerated(EnumType.STRING)
    @Column(name = "apariencia_menbrana_timpanica_oido_derecho")
    private AparienciaMenbranaTimpanica aparienciaMenbranaTimpanicaOidoDerecho;

    @Column(name = "perforacion_oido_derecho")
    private Boolean perforacionOidoDerecho;

    @Column(name = "burbuja_oido_derecho")
    private Boolean burbujaOidoDerecho;

    @Enumerated(EnumType.STRING)
    @Column(name = "coloracion_oido_derecho")
    private ColoracionOido coloracionOidoDerecho;

    // Oído Izquierdo
    @Enumerated(EnumType.STRING)
    @Column(name = "palpacion_pabellon_oido_izquierdo")
    private PalpacionOido palpacionPabellonOidoIzquierdo;

    @Enumerated(EnumType.STRING)
    @Column(name = "palpacion_mastoides_oido_izquierdo")
    private PalpacionOido palpacionMastoidesOidoIzquierdo;

    @Enumerated(EnumType.STRING)
    @Column(name = "cae_oido_izquierdo")
    private CAEOido caeOidoIzquierdo;

    @Enumerated(EnumType.STRING)
    @Column(name = "obstruccion_oido_izquierdo")
    private ObstruccionOido obstruccionOidoIzquierdo;

    @Enumerated(EnumType.STRING)
    @Column(name = "apariencia_menbrana_timpanica_oido_izquierdo")
    private AparienciaMenbranaTimpanica aparienciaMenbranaTimpanicaOidoIzquierdo;

    @Column(name = "perforacion_oido_izquierdo")
    private Boolean perforacionOidoIzquierdo;

    @Column(name = "burbuja_oido_izquierdo")
    private Boolean burbujaOidoIzquierdo;

    @Enumerated(EnumType.STRING)
    @Column(name = "coloracion_oido_izquierdo")
    private ColoracionOido coloracionOidoIzquierdo;
}
