package com.ucacue.udipsai.modules.psicologiaclinica.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.psicologiaclinica.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "psicologia_clinica_registros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PsicologiaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    private Paciente paciente;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // --- Componentes @Embeddable ---

    @Embedded
    private Anamnesis anamnesis;

    @Embedded
    private Suenio suenio;

    @Embedded
    private Conducta conducta;

    @Embedded
    private Sexualidad sexualidad;

    @Embedded
    private EvaluacionLenguaje evaluacionLenguaje;

    @Embedded
    private EvaluacionAfectiva evaluacionAfectiva;

    @Embedded
    private EvaluacionCognitiva evaluacionCognitiva;

    @Embedded
    private EvaluacionPensamiento evaluacionPensamiento;

    @Embedded
    private Diagnostico diagnostico;
    
    // --- Enums ---

    public enum TipoHorarioDeSuenio {
        NOCTURNO, DIURNO, MIXTO
    }

    public enum CompaniaSuenio {
        SOLO, ACOMPANIADO
    }

    public enum SexoDeNacimiento {
        MASCULINO, FEMENINO
    }

    public enum Genero {
        MASCULINO, FEMENINO, OTROS
    }

    public enum OrientacionSexual {
        HETEROSEXUAL, HOMOSEXUAL, BISEXUAL, ASEXUAL, OTROS
    }

    public enum CuriosidadSexual {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum GradoDeInformacion {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum ActividadSexual {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum Masturbacion {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum Promiscuidad {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum Disfunciones {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum Erotismo {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum Parafilias {
        AUSENTE, MEDIA, ABUNDANTE
    }

    public enum Incoherencia {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Bloqueos {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Preservacion {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Prolijidad {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Desgragacion {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Estereotipias {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Neologismos {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Musitacion {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Desorientacion {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum Espacio {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum RespectoASiMismo {
        AUSENTE, LEVE, MODERADO, GRAVE
    }

    public enum RespectoAOtrasPersonas {
        AUSENTE, LEVE, MODERADO, GRAVE
    }
}
