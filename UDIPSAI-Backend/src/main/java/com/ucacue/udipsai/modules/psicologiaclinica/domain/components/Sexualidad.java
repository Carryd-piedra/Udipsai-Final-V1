package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import com.ucacue.udipsai.modules.psicologiaclinica.domain.PsicologiaClinica.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Embeddable
@Data
public class Sexualidad {

    @Enumerated(EnumType.STRING)
    @Column(name = "sexo_de_nacimiento")
    private SexoDeNacimiento sexoDeNacimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "genero")
    private Genero genero;

    @Column(name = "especificar_genero_otros")
    private String especificarGeneroOtros;

    @Enumerated(EnumType.STRING)
    @Column(name = "orientacion_sexual")
    private OrientacionSexual orientacionSexual;

    @Enumerated(EnumType.STRING)
    @Column(name = "curiosidad_sexual")
    private CuriosidadSexual curiosidadSexual;

    @Enumerated(EnumType.STRING)
    @Column(name = "grado_de_informacion")
    private GradoDeInformacion gradoDeInformacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "actividad_sexual")
    private ActividadSexual actividadSexual;

    @Enumerated(EnumType.STRING)
    @Column(name = "masturbacion")
    private Masturbacion masturbacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "promiscuidad")
    private Promiscuidad promiscuidad;

    @Enumerated(EnumType.STRING)
    @Column(name = "disfunciones")
    private Disfunciones disfunciones;

    @Enumerated(EnumType.STRING)
    @Column(name = "erotismo")
    private Erotismo erotismo;

    @Enumerated(EnumType.STRING)
    @Column(name = "parafilias")
    private Parafilias parafilias;

    @Column(name = "observaciones_aspecto_psicosexual", columnDefinition = "TEXT")
    private String observacionesAspectoPsicosexual;
}
