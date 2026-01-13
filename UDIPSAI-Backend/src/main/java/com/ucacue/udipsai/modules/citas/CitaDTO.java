package com.ucacue.udipsai.modules.citas;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadDTO;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * Clase que representa una Cita en la capa de transferencia de datos.
*/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CitaDTO {
    private Long citaId;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate fecha;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;
    private String estado;
    private PacienteDTO paciente;
    private EspecialistaDTO especialista;
    private EspecialidadDTO especialidad;
}
