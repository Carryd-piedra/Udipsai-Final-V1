package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import com.ucacue.udipsai.modules.fonoaudiologia.domain.Fonoaudiologia.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import java.util.Date;

@Embeddable
@Data
public class Audicion {

    @Column(name = "se_a_realizado_examen_audiologico")
    private Boolean seARealizadoExamenAudiologico;

    @Column(name = "perdida_auditiva_conductiva_neurosensorial")
    private Boolean perdidaAuditivaConductivaNeurosensorial;

    @Column(name = "hipoacusia_conductiva_bilateral")
    private Boolean hipoacusiaConductivaBilateral;

    @Column(name = "hipoacusia_conductiva_unilateral")
    private Boolean hipoacusiaConductivaUnilateral;

    @Column(name = "hipoacusia_neurosensorial_bilateral")
    private Boolean hipoacusiaNeurosensorialBilateral;

    @Column(name = "hipoacusia_neurosensorial_unilateral")
    private Boolean hipoacusiaNeurosensorialUnilateral;

    @Column(name = "a_tenido_perdida_audicion_pasado")
    private Boolean aTenidoPerdidaAudicionPasado;

    @Column(name = "infecciones_oido_fuertes")
    private Boolean infeccionesOidoFuertes;

    @Column(name = "cual_infecciones_oido_fuertes")
    private String cualInfeccionesOidoFuertes;

    @Column(name = "edad_infecciones_oido_fuertes")
    private Integer edadInfeccionesOidoFuertes;

    @Column(name = "perdida_auditiva")
    private Boolean perdidaAuditiva;

    @Column(name = "unilateral")
    private Boolean unilateral;

    @Column(name = "oido_derecho")
    private Boolean oidoDerecho;

    @Column(name = "oido_izquierdo")
    private Boolean oidoIzquierdo;

    @Column(name = "bilateral")
    private Boolean bilateral;

    @Enumerated(EnumType.STRING)
    @Column(name = "grado_perdida")
    private GradoPerdida gradoPerdida;

    @Enumerated(EnumType.STRING)
    @Column(name = "permanecia")
    private Permanecia permanecia;

    @Column(name = "otitis")
    private Boolean otitis;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_otitis")
    private TipoOtitis tipoOtitis;

    @Column(name = "duracion_otitis_inicio")
    private Date duracionOtitisInicio;

    @Column(name = "duracion_otitis_fin")
    private Date duracionOtitisFin;

    @Column(name = "antecedentes_familiares")
    private Boolean antecedentesFamiliares;

    @Column(name = "exposision_ruidos")
    private Boolean exposisionRuidos;

    @Column(name = "duracion_exposision_ruidos_inicio")
    private Date duracionExposisionRuidosInicio;

    @Column(name = "duracion_exposision_ruidos_fin")
    private Date duracionExposisionRuidosFin;

    @Column(name = "ototoxicos")
    private Boolean ototoxicos;

    @Column(name = "infecciones")
    private Boolean infecciones;

    @Column(name = "uso_audifonos")
    private Boolean usoAudifonos;

    @Column(name = "inicio_uso_audifonos")
    private Date inicioUsoAudifonos;

    @Column(name = "fin_uso_audifonos")
    private Date finUsoAudifonos;

    @Column(name = "implante_coclear")
    private Boolean implanteCoclear;

    @Column(name = "tratamiento_fonoaudiologico_previo")
    private Boolean tratamientoFonoaudiologicoPrevio;
}
