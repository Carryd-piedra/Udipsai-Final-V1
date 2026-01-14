package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Fonacion {

    @Column(name = "cree_tono_voz_estudiante_apropiado")
    private Boolean creeTonoVozEstudianteApropiado;

    @Column(name = "respiracion_normal")
    private Boolean respiracionNormal;

    @Column(name = "situaciones_altera_tono_voz")
    private String situacionesAlteraTonoVoz;

    @Column(name = "desde_cuando_alteraciones_voz")
    private String desdeCuandoAlteracionesVoz;

    @Column(name = "tono_de_voz")
    private String tonoDeVoz;

    @Column(name = "respiracion")
    private String respiracion;

    @Column(name = "ronca")
    private Boolean ronca;

    @Column(name = "juego_vocal")
    private Boolean juegoVocal;

    @Column(name = "vocalizacion")
    private Boolean vocalizacion;

    @Column(name = "balbuceo")
    private Boolean balbuceo;

    @Column(name = "silabeo")
    private Boolean silabeo;

    @Column(name = "primeras_palabras")
    private Boolean primerasPalabras;

    @Column(name = "oraciones_dos_palabras")
    private Boolean oracionesDosPalabras;

    @Column(name = "oraciones_tres_palabras")
    private Boolean oracionesTresPalabras;

    @Column(name = "formacion_linguistica_completa")
    private Boolean formacionLinguisticaCompleta;

    @Column(name = "numero_total_palabras")
    private Integer numeroTotalPalabras;
}
