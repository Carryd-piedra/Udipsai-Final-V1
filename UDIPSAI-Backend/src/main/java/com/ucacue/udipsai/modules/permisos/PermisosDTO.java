package com.ucacue.udipsai.modules.permisos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermisosDTO {
    private Long id;
    private Boolean pacientes;
    private Boolean pasantes;
    private Boolean sedes;
    private Boolean especialistas;
    private Boolean especialidades;
    private Boolean asignaciones;
    private Boolean recursos;
    private Boolean institucionesEducativas;
    private Boolean historiaClinica;
    private Boolean fonoAudiologia;
    private Boolean psicologiaClinica;
    private Boolean psicologiaEducativa;
}
