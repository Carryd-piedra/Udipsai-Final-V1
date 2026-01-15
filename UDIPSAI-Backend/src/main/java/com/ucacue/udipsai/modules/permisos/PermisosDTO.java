package com.ucacue.udipsai.modules.permisos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermisosDTO {
    private Long id;

    // Pacientes
    private Boolean pacientes;
    private Boolean pacientesCrear;
    private Boolean pacientesEditar;
    private Boolean pacientesEliminar;

    // Pasantes
    private Boolean pasantes;
    private Boolean pasantesCrear;
    private Boolean pasantesEditar;
    private Boolean pasantesEliminar;

    // Sedes
    private Boolean sedes;
    private Boolean sedesCrear;
    private Boolean sedesEditar;
    private Boolean sedesEliminar;

    // Especialistas
    private Boolean especialistas;
    private Boolean especialistasCrear;
    private Boolean especialistasEditar;
    private Boolean especialistasEliminar;

    // Especialidades
    private Boolean especialidades;
    private Boolean especialidadesCrear;
    private Boolean especialidadesEditar;
    private Boolean especialidadesEliminar;

    // Asignaciones
    private Boolean asignaciones;
    private Boolean asignacionesCrear;
    private Boolean asignacionesEditar;
    private Boolean asignacionesEliminar;

    // Recursos
    private Boolean recursos;
    private Boolean recursosCrear;
    private Boolean recursosEditar;
    private Boolean recursosEliminar;

    // Instituciones Educativas
    private Boolean institucionesEducativas;
    private Boolean institucionesEducativasCrear;
    private Boolean institucionesEducativasEditar;
    private Boolean institucionesEducativasEliminar;

    // Historia Clinica
    private Boolean historiaClinica;
    private Boolean historiaClinicaCrear;
    private Boolean historiaClinicaEditar;
    private Boolean historiaClinicaEliminar;

    // Fonoaudiologia
    private Boolean fonoAudiologia;
    private Boolean fonoAudiologiaCrear;
    private Boolean fonoAudiologiaEditar;
    private Boolean fonoAudiologiaEliminar;

    // Psicologia Clinica
    private Boolean psicologiaClinica;
    private Boolean psicologiaClinicaCrear;
    private Boolean psicologiaClinicaEditar;
    private Boolean psicologiaClinicaEliminar;

    // Psicologia Educativa
    private Boolean psicologiaEducativa;
    private Boolean psicologiaEducativaCrear;
    private Boolean psicologiaEducativaEditar;
    private Boolean psicologiaEducativaEliminar;
}
