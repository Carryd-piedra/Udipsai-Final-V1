package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class DatosFamiliares {

    @Column(name = "procedencia_padre")
    private String procedenciaPadre;

    @Column(name = "procedencia_madre")
    private String procedenciaMadre;

    @Column(name = "edad_madre_al_nacimiento")
    private String edadMadreAlNacimiento;

    @Column(name = "edad_padre_al_nacimiento")
    private String edadPadreAlNacimiento;

    @Column(name = "consanguinidad")
    private Boolean consanguinidad;
}
